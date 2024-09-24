package com.tbtr.ffing.domain.finance.entity;

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

    @Column(nullable = true, columnDefinition = "date default current_date()")
    private LocalDate updatedAt;

    @Column(nullable = false)
    private Long userId;
}