package com.tbtr.ffing.domain.finance.dto.response.asset;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AssetGoalRes {

    BigDecimal goalBalance;
    BigDecimal startBalance;
    String createdDate;
    BigDecimal averageIncrese;
    BigDecimal targetIncrese;

}

