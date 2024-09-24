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
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockId;

    @Column(nullable = false, length = 3)
    private String securitiesCompanyCode;

    @Column(nullable = false)
    private LocalDate stockAccountCreatedAt; // 없어도 될거같음

    @Column(nullable = false)
    private LocalDate stockAccountLastTransactionDate; // 없어도 될거같음

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal totalEvaluationAmount;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal totalPurchaseAmount;

    @Column(nullable = false)
    private Long ssafyUserId;
}