package com.tbtr.ffing.domain.finance.dto.request.goal;

import com.tbtr.ffing.domain.finance.entity.Goal;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class GoalReq {

    Long userId;
    String goalBalance;
    String spendingBalance;

    public static Goal goalTo(GoalReq goalReq) {
        return Goal.builder()
                   .userId(goalReq.getUserId())
                   .goalType("1")
                   .balance(new BigDecimal(goalReq.getGoalBalance()))
                   .build();
    }

    public static Goal spendingTo(GoalReq goalReq) {
        return Goal.builder()
                   .userId(goalReq.getUserId())
                   .goalType("2")
                   .balance(new BigDecimal(goalReq.getSpendingBalance()))
                   .build();
    }
}
