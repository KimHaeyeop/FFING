package com.tbtr.ffing.domain.finance.dto.response.card;

import lombok.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class cREC {

    private Long transactionUniqueNo;
    private String categoryId;
    private String categoryName;
    private Long merchantId;
    private String merchantName;
    private String transactionDate;
    private String transactionTime;
    private Long paymentBalance;

}
