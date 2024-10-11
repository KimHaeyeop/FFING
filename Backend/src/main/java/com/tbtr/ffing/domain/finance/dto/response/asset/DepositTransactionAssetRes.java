package com.tbtr.ffing.domain.finance.dto.response.asset;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class DepositTransactionAssetRes {

	private Long transactionId;
	private String paymentName;
	private String paymentDate;
	private String paymentTime;
	private BigDecimal paymentBalance;
	private BigDecimal totalBalance;

	public DepositTransactionAssetRes(Long transactionId, String paymentDate, String paymentTime, BigDecimal paymentBalance, BigDecimal totalBalance) {
		this.transactionId = transactionId;
		if (paymentBalance.compareTo(BigDecimal.ZERO) > 0) {
			paymentName = "입금";
		} else {
			paymentName = "출금";
		}
        this.paymentDate = paymentDate;
        this.paymentTime = paymentTime;
        this.paymentBalance = paymentBalance;
        this.totalBalance = totalBalance;
	}

}
