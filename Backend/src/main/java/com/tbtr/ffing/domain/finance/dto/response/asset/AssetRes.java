package com.tbtr.ffing.domain.finance.dto.response.asset;

import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.user.entity.User;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AssetRes {

	private Long assetId;
	private BigDecimal totalAsset;
	private BigDecimal accountBalance;
	private BigDecimal depositSavingsBalance;
	private BigDecimal stockBalance;
	private BigDecimal othersBalance;
	private String updatedDate;

	public Asset toNewEntity(User user) {
		return Asset.builder()
				.totalAsset(totalAsset)
				.accountBalance(accountBalance)
				.depositSavingsBalance(depositSavingsBalance)
				.stockBalance(stockBalance)
				.othersBalance(othersBalance)
				.updatedDate(updatedDate)
				.user(user)
				.build();
	}

	public Asset toOldEntity(User user) {
		return Asset.builder()
				.assetId(assetId)
				.totalAsset(totalAsset)
				.accountBalance(accountBalance)
				.depositSavingsBalance(depositSavingsBalance)
				.stockBalance(stockBalance)
				.othersBalance(othersBalance)
				.updatedDate(updatedDate)
				.user(user)
				.build();
	}

}
