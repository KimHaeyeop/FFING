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
public class CheckRes {

    String goalBalance;
    String spendingBalance;

    public static CheckRes of(String goalBalance, String spendingBalance) {
        return CheckRes.builder()
                       .goalBalance(goalBalance)
                       .spendingBalance(spendingBalance).build();
    }
}
