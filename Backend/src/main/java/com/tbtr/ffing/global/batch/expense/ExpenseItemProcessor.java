package com.tbtr.ffing.global.batch.expense;

import com.tbtr.ffing.domain.fcm.event.FcmEvent;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.fcm.repository.FcmRepository;
import com.tbtr.ffing.domain.fcm.entity.Fcm;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
public class ExpenseItemProcessor implements ItemProcessor<User, Expense> {

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

        // FCM 토큰 찾기
        Fcm fcm = fcmRepository.findByUser(user);
        if (fcm != null && fcm.getFcmToken() != null) {
            // FCM 이벤트 발생
            FcmEvent fcmEvent = new FcmEvent(this,
                    "새로운 지출이 등록되었습니다.",
                    "지출 항목: " + expense.getExpenseName() + ", 금액: " + expense.getExpenseBalance(),
                    fcm.getFcmToken());
            eventPublisher.publishEvent(fcmEvent);
        }

        return expense;
    }

    private ExpenseCategory getRandomExpenseCategory() {
        ExpenseCategory[] categories = ExpenseCategory.values();
        return categories[random.nextInt(categories.length)];
    }
}