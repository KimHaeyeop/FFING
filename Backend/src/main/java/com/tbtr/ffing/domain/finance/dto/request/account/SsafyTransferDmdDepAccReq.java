package com.tbtr.ffing.domain.finance.dto.request.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

/**
 * Ssafy 계좌이체 요청에 사용되는 DTO
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SsafyTransferDmdDepAccReq {
	@JsonProperty("Header")
	private tHeader header;
	private String depositAccountNo; // 입금계좌번호
	private String depositTransactionSummary; // 거래요약내용(입금계좌)
	private BigDecimal transactionBalance; // 거래금액
	private String withdrawalAccountNo; // 출금계좌번호
	private String withdrawalTransactionSummary; // 거래요약내용(출금계좌)


	public static SsafyTransferDmdDepAccReq of(tHeader header, String depositAccountNo, BigDecimal transactionBalance, String withdrawalAccountNo, String withdrawalTransactionSummary) {

		return SsafyTransferDmdDepAccReq.builder()
				.header(header)
				.depositAccountNo(depositAccountNo)
				.transactionBalance(transactionBalance)
				.withdrawalAccountNo(withdrawalAccountNo)
				.depositTransactionSummary("(수시입출금) : 입금(이체)")
				.withdrawalTransactionSummary(withdrawalTransactionSummary)
				.build();



	}
}
