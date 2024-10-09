package com.tbtr.ffing.domain.finance.entity;

import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "asset")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assetId;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal totalAsset;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal accountBalance;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal depositSavingsBalance;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal stockBalance;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal othersBalance;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public AssetRes of(Asset asset) {
        return AssetRes.builder()
                .assetId(asset.assetId)
                .totalAsset(asset.totalAsset)
                .accountBalance(asset.accountBalance)
                .depositSavingsBalance(asset.depositSavingsBalance)
                .stockBalance(asset.stockBalance)
                .othersBalance(asset.othersBalance)
                .build();
    }
}