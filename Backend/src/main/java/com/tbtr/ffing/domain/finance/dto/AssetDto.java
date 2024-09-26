package com.tbtr.ffing.domain.finance.dto;

import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.user.entity.User;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * ffing 계좌이체 요청에 사용되는 DTO
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AssetDto {

	private Long assetId;
	private BigDecimal totalAsset;
	private BigDecimal accountBalance;
	private BigDecimal depositSavingsBalance;
	private BigDecimal stockBalance;
	private BigDecimal othersBalance;
	private LocalDate updatedAt;
	private Long userId;

//	public Asset toEntity(User user) {
//
//		return Asset.builder()
//				.assetId(assetId)
//				.totalAsset(totalAsset)
//				.accountBalance(accountBalance)
//				.depositSavingsBalance(depositSavingsBalance)
//				.stockBalance(stockBalance)
//				.othersBalance(othersBalance)
//				.updatedAt(updatedAt)
//				.user(user)
//				.build();
//
//	}
}
