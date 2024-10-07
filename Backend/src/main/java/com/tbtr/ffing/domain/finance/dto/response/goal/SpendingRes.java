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
public class SpendingRes {

    int leftMonths;
    String spendingBalance;

    public static SpendingRes of(int leftMonths, String spendingBalance) {
        return SpendingRes.builder()
                          .leftMonths(leftMonths)
                          .spendingBalance(spendingBalance).build();
    }
}
