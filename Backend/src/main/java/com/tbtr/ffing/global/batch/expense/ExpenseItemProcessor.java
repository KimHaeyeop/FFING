package com.tbtr.ffing.global.batch.expense;

import com.tbtr.ffing.domain.fcm.event.FcmEvent;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.fcm.repository.FcmRepository;
import com.tbtr.ffing.domain.fcm.entity.Fcm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Slf4j
@Component
public class ExpenseItemProcessor implements ItemProcessor<User, Expense> {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseItemProcessor.class);

    private final Random random = new Random();

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private FcmRepository fcmRepository;

    @Override
    public Expense process(User user) {
        Expense expense = Expense.builder()
                .expenseName("Scheduled Expense for " + user.getUsername())
                .expenseCategory(getRandomExpenseCategory())
                .expenseMemo("Auto generated expense at " + LocalTime.now())
                .expenseDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .expenseTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss")))
                .expenseBalance(BigDecimal.valueOf(random.nextDouble() * 100))
                .user(user)
                .build();
        log.info("===User 찾기 START===");
        logger.info("Processing user: {}", user);

        // FCM 토큰 찾기
        Fcm fcm = fcmRepository.findByUser(user);
        log.info("===FCM 토큰 찾기 START===");
        logger.info("Found FCM for user: {}, FCM: {}", user.getUsername(), fcm);
        if (fcm != null && fcm.getFcmToken() != null) {
            logger.info("Found FCM token for user: {}", user.getUsername());

            // FCM 이벤트 발생
            FcmEvent fcmEvent = new FcmEvent(this,
                    "새로운 지출이 등록되었습니다.",
                    "지출 항목: " + expense.getExpenseName() + ", 금액: " + expense.getExpenseBalance(),
                    fcm.getFcmToken());

            logger.info("Publishing FCM event for user: {}", user.getUsername());
            eventPublisher.publishEvent(fcmEvent);
            logger.info("FCM event published successfully for user: {}", user.getUsername());
        } else {
            logger.warn("No FCM token found for user: {}", user.getUsername());
        }

        return expense;
    }

    private ExpenseCategory getRandomExpenseCategory() {
        ExpenseCategory[] categories = ExpenseCategory.values();
        return categories[random.nextInt(categories.length)];
    }
}