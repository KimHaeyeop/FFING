package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.dto.response.dashboard.MainDashboardRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.repository.AssetRepository;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.finance.service.AssetService;
import com.tbtr.ffing.domain.finance.service.DashboardService;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.game.service.PetService;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final GoalRepository goalRepository;
    private final AssetRepository assetRepository;
    private final PetService petService;
    private final ExpenseRepository expenseRepository;
    private final ExpenseService expenseService;

    @Override
    @Transactional
    public MainDashboardRes mainPage(Long userId) {
        LocalDate now = LocalDate.now();
        String yearMonth = now.format(DateTimeFormatter.ofPattern("yyyyMM"));

        // 목표 자산액
        BigDecimal goalBalance = goalRepository.findGoalBalanceByUserIdAndThisYear(userId);
        // 총 자산액
        AssetRes assetRes = assetRepository.findCurrentAssetByUserId(userId);
        BigDecimal totalAsset = assetRes == null ? BigDecimal.ZERO : assetRes.getTotalAsset();
        // 펫 코드

        String petCode = petService.getHomePetInfo(userId).get("currentPetInfo").getPetCode();
        // 이번 달 총 소비
        BigDecimal monthTotalSpending = expenseRepository.getTotalExpenseForMonth(yearMonth);

        // 이번 달 목표 소바액
        BigDecimal monthGoalSpending = goalRepository.findRecentSpendingBalanceByUserId(userId);

        // 이번 달 카테고리 별 소비
        List<CategoryExpenseRes> monthCategoryExpenses = expenseService.getThisMonthCategoryExpenses();

        return MainDashboardRes.builder()
                .goalBalance(goalBalance)
                .totalAsset(totalAsset)
                .petCode(petCode)
                .monthTotalSpending(monthTotalSpending)
                .monthGoalSpending(monthGoalSpending)
                .monthCategoryExpenses(monthCategoryExpenses).build();
    }
}
