package com.tbtr.ffing.domain.finance.dto.response.asset;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AccountAssetRes {

	private Long accountId;
	private String bankCode;
	private String accountName;
	private String accountNo;
	private BigDecimal totalBalance;

}
