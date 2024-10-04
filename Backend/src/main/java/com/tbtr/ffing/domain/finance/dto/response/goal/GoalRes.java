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
public class GoalRes {

    String goalBalance;
    SpendingRes spending;

    public static GoalRes of(String goalBalance, SpendingRes spending) {
        return GoalRes.builder()
                      .goalBalance(goalBalance)
                      .spending(spending).build();
    }
}
