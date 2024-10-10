package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.fcm.entity.Fcm;
import com.tbtr.ffing.domain.fcm.event.FcmEvent;
import com.tbtr.ffing.domain.fcm.repository.FcmRepository;
import com.tbtr.ffing.domain.finance.dto.request.card.CreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.dto.request.card.SsafyCreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.dto.request.card.cHeader;
import com.tbtr.ffing.domain.finance.dto.response.card.SsafyCreateCardTransactionRes;
import com.tbtr.ffing.domain.finance.entity.Card;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.repository.CardRepository;
import com.tbtr.ffing.domain.finance.repository.CardTransactionRepository;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.finance.service.CardService;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.openfeign.SsafyDeveloperClient;
import com.tbtr.ffing.global.util.InstitutionTransactionNoGenerator;
import com.tbtr.ffing.domain.alarm.entity.Alarm;
import com.tbtr.ffing.domain.alarm.repository.AlarmRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final SsafyDeveloperClient ssafyDeveloperClient;
    private final CardTransactionRepository cardTransactionRepository;
    private final UserRepository userRepository;
    private final ExpenseService expenseService;
    private final FcmRepository fcmRepository;
    private final AlarmRepository alarmRepository;
    private final GoalRepository goalRepository;

    private static final Logger logger = LoggerFactory.getLogger(CardServiceImpl.class);

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Value("${SSAFY_DEVELOPER_API_KEY}")
    private String apiKey;

    @Override
    @Transactional
    public void addCardTransaction(CreateCardTransactionReq createCardTransactionReq) {
        String userKey = createCardTransactionReq.getUserKey();
        ExpenseCategory category = createCardTransactionReq.getCategory();

        String random = InstitutionTransactionNoGenerator.generateInstitutionTransactionUniqueNo();

        cHeader header = cHeader.of(
                apiKey,
                userKey,
                random
        );

        User user = userRepository.findByUserId(createCardTransactionReq.getUserId());

        SsafyCreateCardTransactionReq ssafyCreateCardTransactionReq = SsafyCreateCardTransactionReq.of(header, createCardTransactionReq.getCardNo(), createCardTransactionReq.getCvc(), createCardTransactionReq.getMerchantId(), createCardTransactionReq.getPaymentBalance());
        SsafyCreateCardTransactionRes res = ssafyDeveloperClient.createCreditCardTransaction(ssafyCreateCardTransactionReq);

        Card card = cardRepository.findByCardNo(ssafyCreateCardTransactionReq.getCardNo());

        if(card != null) {
            CardTransaction newCardTransaction = res.toEntity(card, category);
            cardTransactionRepository.save(newCardTransaction);

            expenseService.addCardTransactionToExpense(newCardTransaction, user);

            BigDecimal spendingPercentage = calculateSpendingPercentage(user.getUserId(), newCardTransaction.getPaymentBalance());

            addAlarmForCardTransaction(newCardTransaction, user, spendingPercentage);

            sendFcmNotification(user, newCardTransaction, spendingPercentage);
        }
    }

    private BigDecimal calculateSpendingPercentage(Long userId, BigDecimal spendingAmount) {
        String yearMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        Goal spendingGoal = goalRepository.findSpendingByUserIdAndYearMonth(userId, yearMonth);

        System.out.println(spendingGoal);

        if (spendingGoal != null && spendingGoal.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            return spendingAmount.divide(spendingGoal.getBalance(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        return BigDecimal.ZERO;
    }

    private void addAlarmForCardTransaction(CardTransaction cardTransaction, User user, BigDecimal spendingPercentage) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        String alarmTitle;
        String alarmContent;
        Alarm.AlarmLabel alarmLabel;

        if (spendingPercentage.compareTo(new BigDecimal("50")) >= 0) {
            alarmTitle = "🚨비상🚨";
            alarmContent = String.format("💸경고💸 %s에서 지출 상한의 %.0f%%를 사용했어요! 지출이 EVEN하지 않습니다.",
                    cardTransaction.getMerchant(),
                    spendingPercentage);
            alarmLabel = Alarm.AlarmLabel.WARNING;
        } else {
            alarmTitle = "💸주의💸";
            alarmContent = String.format("🚨비상🚨 %s에서 지출 상한의 %.0f%%를 사용했어요! 지출이 EVEN하지 않지 않습니다.",
                    cardTransaction.getMerchant(),
                    spendingPercentage);
            alarmLabel = Alarm.AlarmLabel.CAUTION;
        }

        Alarm alarm = Alarm.builder()
                .alarmDate(currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .alarmTime(currentTime.format(DateTimeFormatter.ofPattern("HHmmss")))
                .alarmType(Alarm.AlarmType.EVENT)
                .alarmTitle(alarmTitle)
                .alarmContent(alarmContent)
                .alarmLabel(alarmLabel)
                .alarmStatus(false)
                .userId(user.getUserId())
                .build();

        alarmRepository.save(alarm);
        logger.info("Alarm created for card transaction: {}", cardTransaction.getCardTransactionId());
    }

    private void sendFcmNotification(User user, CardTransaction cardTransaction, BigDecimal spendingPercentage) {
        Fcm fcm = fcmRepository.findByUser(user);

        if (fcm != null && fcm.getFcmToken() != null) {
            String title;
            String body;
            if (spendingPercentage.compareTo(new BigDecimal("50")) >= 0) {
                title = "🚨비상🚨";
                body = String.format("%s에서 지출 상한의 %.0f%%를 사용했어요! 지출이 EVEN하지 않습니다.",
                        cardTransaction.getMerchant(),
                        spendingPercentage);
            } else {
                title = "💸주의💸";
                body = String.format("%s에서 지출 상한의 %.0f%%를 사용했어요! 지출이 EVEN하지 않지 않습니다.",
                        cardTransaction.getMerchant(),
                        spendingPercentage);
            }

            FcmEvent fcmEvent = new FcmEvent(this, title, body, fcm.getFcmToken());

            logger.info("Publishing FCM event for user: {}", user.getUsername());
            eventPublisher.publishEvent(fcmEvent);
            logger.info("FCM event published successfully for user: {}", user.getUsername());
        } else {
            logger.warn("No FCM token found for user: {}", user.getUsername());
        }
    }
}