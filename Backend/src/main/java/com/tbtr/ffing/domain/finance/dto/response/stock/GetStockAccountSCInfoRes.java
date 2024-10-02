package com.tbtr.ffing.domain.finance.dto.response.stock;

import com.tbtr.ffing.domain.finance.entity.StockAccount;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GetStockAccountSCInfoRes {

    private Long stockAccountId;
    private String stockCode;
    private String stockName;
    private BigDecimal totalSumEvaluationAmount;
    private Long totalStockQuantity;
    private BigDecimal totalSumPurchaseAmount;
    private BigDecimal totalPLBalance;
    private BigDecimal totalPLRate;

}
