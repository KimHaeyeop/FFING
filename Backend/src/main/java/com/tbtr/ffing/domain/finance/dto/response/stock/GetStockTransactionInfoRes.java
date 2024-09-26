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
    private Long transactionBalance;
    private Long transactionQuantity;
    private String transactionDate;
    private String transactionTime;

    private Long stockAccountId;
    private Long stockInfoId;
}
