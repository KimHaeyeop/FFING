package com.tbtr.ffing.domain.finance.dto.response.expense;

import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ExpenseRes {

    private Long expenseId;
    private String expenseName;
    private ExpenseCategory expenseCategory;
    private String expenseMemo;
    private String expenseDate;
    private String expenseTime;
    private BigDecimal expenseBalance;

}
