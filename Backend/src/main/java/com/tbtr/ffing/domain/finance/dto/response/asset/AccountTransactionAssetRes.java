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

	private Long transactionId;
	private String paymentName;
	private String paymentDate;
	private String paymentTime;
	private String paymentType;
	private String paymentMemo;
	private BigDecimal paymentBalance;
	private BigDecimal totalBalance;

}
