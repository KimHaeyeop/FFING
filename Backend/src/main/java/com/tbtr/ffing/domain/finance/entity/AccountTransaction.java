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
@Table(name = "account_transaction")
public class AccountTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountTransactionId;

    @Column(nullable = false, length = 8)
    private String transactionDate;

    @Column(nullable = false, length = 6)
    private String transactionTime;

    @Column(nullable = false, length = 5)
    private String transactionType;

    @Column(nullable = false, length = 10)
    private String transactionTypeName;

    @Column(length = 16)
    private String transactionAccountNo;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal transactionBalance;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal transactionAfterBalance;

    @Column(nullable = false, length = 255)
    private String transactionSummary;

    @Column(nullable = false, length = 255)
    private String transactionMemo;

    @Column(nullable = false)
    private Long accountId;
}