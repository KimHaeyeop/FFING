package com.tbtr.ffing.domain.finance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "stock_account")
public class StockAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockAccountId;

    @Column(nullable = false, length = 3)
    private String securitiesCompanyCode;

    @Column(nullable = false, length = 50)
    private String securitiesCompanyName;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal stockAccountBalance;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal totalEvaluationAmount;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal totalPurchaseAmount;

    @Column(nullable = false)
    private Long ssafyUserId;

    @OneToMany(mappedBy = "stockAccount")
    private List<StockTransaction> stockTransactions;
}