package com.tbtr.ffing.domain.finance.dto.response.account;

import lombok.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
// @JsonPropertyOrder({
// 	"responseCode",
// 	"responseMessage",
// 	"apiName",
// 	"transmissionDate",
// 	"transmissionTime",
// 	"institutionCode",
// 	"apiKey",
// 	"apiServiceCode",
// 	"institutionTransactionUniqueNo"
// })
public class tHeader {
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
