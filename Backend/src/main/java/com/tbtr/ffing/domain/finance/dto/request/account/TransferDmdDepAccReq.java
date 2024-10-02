package com.tbtr.ffing.domain.finance.dto.request.account;

import com.tbtr.ffing.domain.finance.entity.Account;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import lombok.*;

import java.math.BigDecimal;

/**
 * ffing 계좌이체 요청에 사용되는 DTO
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TransferDmdDepAccReq {

	private String userKey;
	private Long userId;
	private String depositAccountNo; // 입금계좌번호
	private String withdrawalAccountNo; // 출금계좌번호
	private BigDecimal transactionBalance; // 거래금액
	private String withdrawalTransactionSummary; // 거래요약내용(출금계좌)
	private String transactionMemo; // 거래 메모

	public AccountTransaction toEntity(String transmissionDate, String transmissionTime, Account account, BigDecimal newBalance) {

		return AccountTransaction.builder()
				.transactionDate(transmissionDate)
				.transactionTime(transmissionTime)
				.transactionType("2")
				.transactionTypeName("출금(이체)")
				.transactionAccountNo(depositAccountNo)
				.transactionBalance(transactionBalance)
				.transactionAfterBalance(newBalance)
				.transactionSummary(withdrawalTransactionSummary)
				.transactionMemo(transactionMemo)
				.account(account)
				.build();

	}
}
