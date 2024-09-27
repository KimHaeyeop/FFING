package com.tbtr.ffing.domain.finance.dto.response.asset;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AccountTransactionAssetRes {

	private Long accountTransactionId;
	private String transactionDate;
	private String transactionTime;
	private String transactionType;
	private String transactionTypeName;
	private String transactionAccountNo;
	private BigDecimal transactionBalance;
	private BigDecimal transactionAfterBalance;
	private String transactionSummary;
	private String transactionMemo;

	// AccountTransactionDTO 어떻게 작성해야 할 지 생각 좀 해봐야겠다...

//	public AccountTransactionAssetRes(Long transactionId, String paymentDate, String paymentTime, long depositInstallment, BigDecimal paymentBalance, BigDecimal totalBalance) {
//		this.transactionId = transactionId;
//		if (paymentBalance.compareTo(BigDecimal.ZERO) > 0) {
//			paymentName = "입금";
//		} else {
//			paymentName = "출금";
//		}
//        this.paymentDate = paymentDate;
//        this.paymentTime = paymentTime;
//		this.depositInstallment = depositInstallment;
//        this.paymentBalance = paymentBalance;
//        this.totalBalance = totalBalance;
//	}

}
