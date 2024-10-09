package com.tbtr.ffing.domain.finance.dto.response.dashboard;

import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainDashboardRes {
    BigDecimal goalBalance; // 목표 자산액
    BigDecimal totalAsset; // 총 자산액
    String petCode; // 펫 코드
    BigDecimal monthTotalSpending; // 이번 달 총 소비
    List<CategoryExpenseRes> monthCategoryExpenses; // 이번 달 카테고리 별 소비
}