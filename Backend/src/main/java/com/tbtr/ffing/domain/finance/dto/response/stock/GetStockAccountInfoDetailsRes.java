package com.tbtr.ffing.domain.finance.dto.response.stock;

import jakarta.persistence.Column;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GetStockAccountInfoDetailsRes {

    private Long stockAccountId;
    private String securitiesCompanyCode;
    private String securitiesCompanyName;
    private Long stockAccountBalance;
    private Long totalEvaluationAmount;
    private Long totalPurchaseAmount;

    private List<GetStockTransactionInfoRes> stockTransactionInfos;

}
