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
public class SpendingReq {

    String spendingBalance;

    public static Goal spendingTo(SpendingReq spendingReq, User user) {
        return Goal.builder()
                   .goalType("2")
                   .balance(new BigDecimal(spendingReq.getSpendingBalance()))
                   .user(user)
                   .build();
    }
}
