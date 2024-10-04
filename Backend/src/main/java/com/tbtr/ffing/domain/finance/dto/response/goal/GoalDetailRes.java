package com.tbtr.ffing.domain.finance.dto.response.goal;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class GoalDetailRes {

    String totalAsset;              // 현재 총 자산
    int leftMonths;                 // 남은 개월 수
    String fixedIncome;             // 고정 수입
    String recommendedGoalBalance;  // 추천 목표 자산액
    String upperLimitBalance;       // 상한 자산액
    String lowerLimitBalance;       // 하한 자산액
}
