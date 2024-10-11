package com.tbtr.ffing.domain.finance.dto.response.asset;

import com.tbtr.ffing.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class DepositAssetRes {

	private Long accountId;
	private String bankCode;
	private String accountName;
	private String accountNo;
	private BigDecimal totalBalance;
	private String type;

	public DepositAssetRes(Long accountId, String bankCode, String accountName, String accountNo, BigDecimal totalBalance) {
		this.accountId = accountId;
        this.bankCode = bankCode;
        this.accountName = accountName;
        this.accountNo = accountNo;
        this.totalBalance = totalBalance;
        this.type = "deposit";
	}

}
