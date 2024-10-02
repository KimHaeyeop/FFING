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
    Boolean goalType;
    String balance;

    public static Goal to(GoalReq goalReq) {
        return Goal.builder()
                   .userId(goalReq.getUserId())
                   .goalType(goalReq.getGoalType())
                   .balance(new BigDecimal(goalReq.getBalance()))
                   .build();
    }
}
