package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.request.account.SsafyTransferDmdDepAccReq;
import com.tbtr.ffing.domain.finance.dto.request.account.TransferDmdDepAccReq;
import com.tbtr.ffing.domain.finance.dto.request.account.tHeader;
import com.tbtr.ffing.domain.finance.dto.response.account.SsafyTransferDmdDepAccRes;
import com.tbtr.ffing.domain.finance.entity.Account;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.repository.AccountRepository;
import com.tbtr.ffing.domain.finance.repository.AccountTransactionRepository;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.finance.service.AccountService;
import com.tbtr.ffing.domain.finance.service.AssetService;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.openfeign.SsafyDeveloperClient;
import com.tbtr.ffing.global.util.InstitutionTransactionNoGenerator;
import com.tbtr.ffing.domain.fcm.entity.Fcm;
import com.tbtr.ffing.domain.fcm.event.FcmEvent;
import com.tbtr.ffing.domain.fcm.repository.FcmRepository;
import com.tbtr.ffing.domain.alarm.entity.Alarm;
import com.tbtr.ffing.domain.alarm.repository.AlarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountTransactionRepository accountTransactionRepository;
    private final SsafyDeveloperClient ssafyDeveloperClient;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final ExpenseService expenseService;
    private final AssetService assetService;
    private final FcmRepository fcmRepository;
    private final AlarmRepository alarmRepository;
    private final GoalRepository goalRepository;
    private final ApplicationEventPublisher eventPublisher;

    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    @Value("${SSAFY_DEVELOPER_API_KEY}")
    private String apiKey;

    @Override
    @Transactional
    public void updateAccountTransfer(TransferDmdDepAccReq transferDmdDepAccReq) {

        String userKey = transferDmdDepAccReq.getUserKey();
        String random = InstitutionTransactionNoGenerator.generateInstitutionTransactionUniqueNo();

        tHeader header = tHeader.of(
                apiKey,
                userKey,
                random
        );

        User user = userRepository.findByUserId(transferDmdDepAccReq.getUserId());

        SsafyTransferDmdDepAccReq ssafyTransferDmdDepAccReq = SsafyTransferDmdDepAccReq.of(header, transferDmdDepAccReq.getDepositAccountNo(), transferDmdDepAccReq.getTransactionBalance(), transferDmdDepAccReq.getWithdrawalAccountNo(), transferDmdDepAccReq.getWithdrawalTransactionSummary());
        SsafyTransferDmdDepAccRes res = ssafyDeveloperClient.updateDemandDepositAccountTransfer(ssafyTransferDmdDepAccReq);

        Account account = accountRepository.findByAccountNo(transferDmdDepAccReq.getWithdrawalAccountNo());

        if(res.getHeader().getResponseCode().equals("H0000") && account!=null){

            // 현재 계좌 잔액 조회
            BigDecimal currentBalance = account.getAccountBalance();

            // 새로운 잔액 계산
            BigDecimal newBalance = currentBalance.subtract(transferDmdDepAccReq.getTransactionBalance());

            // accountTransaction 추가
            AccountTransaction newAccountTransaction = transferDmdDepAccReq.toEntity(
                    header.getTransmissionDate(),
                    header.getTransmissionTime(),
                    account,
                    newBalance
            );
            accountTransactionRepository.save(newAccountTransaction);

            // expense 추가
            expenseService.addAccountTransferToExpense(newAccountTransaction, user);

            // 목표 대비 지출 비율 계산
            BigDecimal spendingPercentage = calculateSpendingPercentage(user.getUserId(), transferDmdDepAccReq.getTransactionBalance());

            // FCM 알림 전송
            sendFcmNotification(user, transferDmdDepAccReq.getTransactionBalance(), spendingPercentage);

            // Alarm 엔티티에 알림 추가
            addAlarmForAccountTransfer(newAccountTransaction, user, spendingPercentage);

            // asset 업데이트 추가 필요
            assetService.addAccountTransferToAsset(newAccountTransaction, user);
        }
    }

    private BigDecimal calculateSpendingPercentage(Long userId, BigDecimal spendingAmount) {
        String yearMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        Goal spendingGoal = goalRepository.findSpendingByUserIdAndYearMonth(userId, yearMonth);

        if (spendingGoal != null && spendingGoal.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            return spendingAmount.divide(spendingGoal.getBalance(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        return BigDecimal.ZERO;
    }

    private void sendFcmNotification(User user, BigDecimal amount, BigDecimal spendingPercentage) {
        Fcm fcm = fcmRepository.findByUser(user);
        if (fcm != null && fcm.getFcmToken() != null) {
            String title;
            String content;
            if (spendingPercentage.compareTo(new BigDecimal("50")) >= 0) {
                title = "🚨비상🚨";
                content = String.format("목표 지출의 %.0f%%가 이체되었습니다,,괜찮아,,.딩린리링리,.,,🎶", spendingPercentage);
            } else {
                title = "💸주의💸";
                content = String.format("목표 지출의 %.0f%%가 이체되었습니다,,괜찮아,,.딩린리링리,.,,🎶", spendingPercentage);
            }

            FcmEvent fcmEvent = new FcmEvent(this, title, content, fcm.getFcmToken());

            logger.info("Publishing FCM event for user: {}", user.getUsername());
            eventPublisher.publishEvent(fcmEvent);
            logger.info("FCM event published successfully for user: {}", user.getUsername());
        } else {
            logger.warn("No FCM token found for user: {}", user.getUsername());
        }
    }

    private void addAlarmForAccountTransfer(AccountTransaction accountTransaction, User user, BigDecimal spendingPercentage) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        String alarmTitle;
        String alarmContent;
        Alarm.AlarmLabel alarmLabel;

        if (spendingPercentage.compareTo(new BigDecimal("50")) >= 0) {
            alarmTitle = "🚨비상🚨";
            alarmContent = String.format("🚨비상🚨 지출 상한의 %.0f%%만큼 이체가 발생했습니다,,괜찮아,,.딩린리링리,.,,🎶", spendingPercentage);
            alarmLabel = Alarm.AlarmLabel.WARNING;
        } else {
            alarmTitle = "💸주의💸";
            alarmContent = String.format("💸주의💸 지출 상한의 %.0f%%만큼 이체가 발생했습니다,,괜찮아,,.딩린리링리,.,,🎶", spendingPercentage);
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
        logger.info("Alarm created for account transaction: {}", accountTransaction.getAccountTransactionId());
    }
}