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
public class SpendingReq {

    Long userId;
    String spendingBalance;

    public static Goal spendingTo(SpendingReq SpendingReq) {
        return Goal.builder()
                   .userId(SpendingReq.getUserId())
                   .goalType("2")
                   .balance(new BigDecimal(SpendingReq.getSpendingBalance()))
                   .build();
    }
}
