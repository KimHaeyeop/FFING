package com.tbtr.ffing.domain.finance.dto.response.stock;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GetStockTransactionInfoRes {

    private Long stockTransactionId;
    private String transactionType;
    private BigDecimal transactionBalance;
    private BigDecimal transactionQuantity;
    private String transactionDate;
    private String transactionTime;

    private Long stockAccountId;
    private String securitiesCompanyName;

    private Long stockInfoId;
    private String stockCode;
    private String stockName;
}
