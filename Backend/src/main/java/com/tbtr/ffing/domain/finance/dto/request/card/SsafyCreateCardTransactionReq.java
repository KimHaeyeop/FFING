package com.tbtr.ffing.domain.finance.dto.request.card;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * ssafy 카드결제
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SsafyCreateCardTransactionReq {

    @JsonProperty("Header")
    private cHeader header;
    private String cardNo; // 카드번호
    private String cvc; // 카드보안번호
    private Long merchantId; // 가맹점ID
    private Long paymentBalance; // 거래금액


}
