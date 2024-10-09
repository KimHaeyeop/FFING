package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.request.account.SsafyTransferDmdDepAccReq;
import com.tbtr.ffing.domain.finance.dto.request.account.TransferDmdDepAccReq;
import com.tbtr.ffing.domain.finance.dto.request.account.tHeader;
import com.tbtr.ffing.domain.finance.dto.response.account.SsafyTransferDmdDepAccRes;
import com.tbtr.ffing.domain.finance.entity.Account;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.repository.AccountRepository;
import com.tbtr.ffing.domain.finance.repository.AccountTransactionRepository;
import com.tbtr.ffing.domain.finance.service.AccountService;
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
    private final FcmRepository fcmRepository;
    private final AlarmRepository alarmRepository;
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

            // FCM 알림 전송
            sendFcmNotification(user, transferDmdDepAccReq.getTransactionBalance());

            // Alarm 엔티티에 알림 추가
            addAlarmForAccountTransfer(newAccountTransaction, user);

            // asset 업데이트 추가 필요
        }
    }

    private void sendFcmNotification(User user, BigDecimal amount) {
        Fcm fcm = fcmRepository.findByUser(user);
        if (fcm != null && fcm.getFcmToken() != null) {
            FcmEvent fcmEvent = new FcmEvent(this,
                    "💸 계좌 이체 알림",
                    amount + "원이 이체되었습니다.",
                    fcm.getFcmToken());

            logger.info("Publishing FCM event for user: {}", user.getUsername());
            eventPublisher.publishEvent(fcmEvent);
            logger.info("FCM event published successfully for user: {}", user.getUsername());
        } else {
            logger.warn("No FCM token found for user: {}", user.getUsername());
        }
    }

    private void addAlarmForAccountTransfer(AccountTransaction accountTransaction, User user) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        Alarm alarm = Alarm.builder()
                .alarmDate(currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .alarmTime(currentTime.format(DateTimeFormatter.ofPattern("HHmmss")))
                .alarmType(Alarm.AlarmType.EVENT)
                .alarmTitle("계좌 이체 완료")
                .alarmContent("금액: " + accountTransaction.getTransactionBalance() + "원이 이체되었습니다.")
                .alarmLabel(Alarm.AlarmLabel.CHECK)
                .alarmStatus(false)
                .userId(user.getUserId())
                .build();

        alarmRepository.save(alarm);
        logger.info("Alarm created for account transaction: {}", accountTransaction.getAccountTransactionId());
    }
}