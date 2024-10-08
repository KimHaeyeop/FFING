package com.tbtr.ffing.domain.finance.dto.response.asset;

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

}
