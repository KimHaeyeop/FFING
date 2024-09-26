package com.tbtr.ffing.domain.finance.dto.response.stock;

import com.tbtr.ffing.domain.finance.entity.StockAccount;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GetStockAccountInfoRes {

    private Long stockAccountId;
    private String securitiesCompanyName;
    private BigDecimal stockAccountBalance;
    private BigDecimal totalPLBalance;
    private BigDecimal totalPLRate;

    public static GetStockAccountInfoRes from(StockAccount account) {
        BigDecimal totalPLBalance = account.getTotalEvaluationAmount().subtract(account.getTotalPurchaseAmount());
        BigDecimal totalPLRate = BigDecimal.ZERO;;
        if (account.getTotalPurchaseAmount().compareTo(BigDecimal.ZERO) != 0) {
            totalPLRate = totalPLBalance.multiply(new BigDecimal("100"))
                    .divide(account.getTotalPurchaseAmount(), 2, RoundingMode.HALF_EVEN);
        }
        System.out.println(totalPLRate);

        return new GetStockAccountInfoRes(
                account.getStockAccountId(),
                account.getSecuritiesCompanyName(),
                account.getStockAccountBalance(),
                totalPLBalance,
                totalPLRate
        );
    }
}
