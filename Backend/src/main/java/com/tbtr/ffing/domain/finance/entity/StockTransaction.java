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

    @Column(nullable = false, length = 5)
    private String transactionType;

    @Column(precision = 16, scale = 2, nullable = true, columnDefinition = "decimal(16, 2) default 0")
    private BigDecimal transactionBalance;

    @Column(nullable = false)
    private Long transactionQuantity;

    @Column(nullable = false, length = 8)
    private String transactionDate;

    @Column(nullable = false, length = 6)
    private String transactionTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_account_id")
    private StockAccount stockAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_info_id")
    private StockInfo stockInfo;

    @Override
    public String toString() {
        return "StockTransaction [stockTransactionId=" + stockTransactionId
                + ", transactionType=" + transactionType
                + ", transactionBalance=" + transactionBalance
                + ", transactionQuantity=" + transactionQuantity
                + ", transactionDate=" + transactionDate
                + ", transactionTime=" + transactionTime
                + ", stockAccount=" + stockAccount
                + ", stockInfo=" + stockInfo
                + "]"
                ;
    }
}
