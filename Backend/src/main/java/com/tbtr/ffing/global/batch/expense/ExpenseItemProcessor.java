package com.tbtr.ffing.global.batch.expense;

import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.user.entity.User;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

/**
 * User 정보를 기반으로 Expense 객체를 생성하는 ItemProcessor
 */
@Component
public class ExpenseItemProcessor implements ItemProcessor<User, Expense> {

    private final Random random = new Random();

    /**
     * User 객체를 입력받아 새로운 Expense 객체를 생성합니다.
     *
     * @param user 입력 User 객체
     * @return 생성된 Expense 객체
     */
    @Override
    public Expense process(User user) {
        return Expense.builder()
                .expenseName("Scheduled Expense for " + user.getUsername())
                .expenseCategory(getRandomExpenseCategory())
                .expenseMemo("Auto generated expense at " + LocalTime.now())
                .expenseDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .expenseTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss")))
                .expenseBalance(BigDecimal.valueOf(random.nextDouble() * 100))
                .user(user)
                .build();
    }

    private ExpenseCategory getRandomExpenseCategory() {
        ExpenseCategory[] categories = ExpenseCategory.values();
        return categories[random.nextInt(categories.length)];
    }
}