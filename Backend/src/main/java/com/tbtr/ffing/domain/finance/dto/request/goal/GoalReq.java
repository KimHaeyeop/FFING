package com.tbtr.ffing.domain.finance.dto.request.goal;

import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.user.entity.User;
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

    String goalBalance;
    String spendingBalance;

    public static Goal goalTo(GoalReq goalReq, BigDecimal startBalance, User user) {
        return Goal.builder()
                   .goalType("1")
                   .startBalance(startBalance)
                   .balance(new BigDecimal(goalReq.getGoalBalance()))
                   .user(user)
                   .build();
    }

    public static Goal spendingTo(GoalReq goalReq, User user) {
        return Goal.builder()
                   .goalType("2")
                   .balance(new BigDecimal(goalReq.getSpendingBalance()))
                   .user(user)
                   .build();
    }
}
