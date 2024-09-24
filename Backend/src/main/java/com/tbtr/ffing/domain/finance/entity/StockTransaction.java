package com.tbtr.ffing.domain.finance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "stock_transaction")
public class StockTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockTransactionId;

    @Column(nullable = false, length = 50)
    private String stockName;

    @Column(nullable = false, length = 3)
    private String stockCode;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal evaluationAmount;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal purchaseAmount;

    @Column(nullable = false)
    private Long stockId;
}