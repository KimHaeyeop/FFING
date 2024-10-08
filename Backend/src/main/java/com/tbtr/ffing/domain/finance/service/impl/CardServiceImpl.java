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
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.repository.CardRepository;
import com.tbtr.ffing.domain.finance.repository.CardTransactionRepository;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.service.CardService;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.batch.expense.ExpenseItemProcessor;
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

    private static final Logger logger = LoggerFactory.getLogger(ExpenseItemProcessor.class);

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Value("${SSAFY_DEVELOPER_API_KEY}")
    private String apiKey;

    /**
     * 카드 지출 발생
     */
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

        // cardNo로 card찾기
        Card card = cardRepository.findByCardNo(ssafyCreateCardTransactionReq.getCardNo());

        if(card != null) {
            // cardTransaction 추가
            CardTransaction newCardTransaction = res.toEntity(card, category);
            cardTransactionRepository.save(newCardTransaction);

            // expense 추가
            expenseService.addCardTransactionToExpense(newCardTransaction, user);

            // Alarm 엔티티에 알림 추가
            addAlarmForCardTransaction(newCardTransaction, user);

            // FCM 토큰 찾기
            Fcm fcm = fcmRepository.findByUser(user);

            if (fcm != null && fcm.getFcmToken() != null) {
                // FCM 이벤트 발생
                FcmEvent fcmEvent = new FcmEvent(this,
                        "💥💥새로운 지출 등록💥💥",
                        "지출 항목: " + newCardTransaction.getMerchant() + ", 금액: " + newCardTransaction.getPaymentBalance(),
                        fcm.getFcmToken());

                logger.info("Publishing FCM event for user: {}", user.getUsername());
                eventPublisher.publishEvent(fcmEvent);
                logger.info("FCM event published successfully for user: {}", user.getUsername());
            } else {
                logger.warn("No FCM token found for user: {}", user.getUsername());
            }
        }
    }

    private void addAlarmForCardTransaction(CardTransaction cardTransaction, User user) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        Alarm alarm = Alarm.builder()
                .alarmDate(currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .alarmTime(currentTime.format(DateTimeFormatter.ofPattern("HHmmss")))
                .alarmType(Alarm.AlarmType.EVENT)
                .alarmTitle("💥💥새로운 지출이 등록💥💥")
                .alarmContent("지출 항목: " + cardTransaction.getMerchant() + ", 금액: " + cardTransaction.getPaymentBalance())
                .alarmLabel(Alarm.AlarmLabel.CAUTION)
                .alarmStatus(false)
                .userId(user.getUserId())
                .build();

        alarmRepository.save(alarm);
        logger.info("Alarm created for card transaction: {}", cardTransaction.getCardTransactionId());
    }
}