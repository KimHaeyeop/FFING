package com.tbtr.ffing.domain.finance.dto.response.account;

import lombok.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class tREC {
	private Long transactionUniqueNo;
	private String accountNo;
	private String transactionDate;
	private String transactionType;
	private String transactionTypeName;
	private String transactionAccountNo;
}
