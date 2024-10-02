package com.tbtr.ffing.domain.finance.dto.response.card;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.tbtr.ffing.global.openfeign.constants.CommonConstants;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 카드결제 시 필요한 response header
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString // 디버깅용
public class cHeader {

    private String responseCode;
    private String responseMessage;
    private String apiName;
    private String transmissionDate;
    private String transmissionTime;
    private String institutionCode;
    private String apiKey;
    private String apiServiceCode;
    private String institutionTransactionUniqueNo;
}
