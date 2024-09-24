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
@Table(name = "account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(nullable = false, length = 20)
    private String accountName;

    @Column(nullable = false, length = 16)
    private String accountNo;

    @Column(nullable = false)
    private LocalDate accountCreatedDate;

    @Column(nullable = false)
    private LocalDate accountExpiryDate;

    @Column(precision = 16, scale = 2)
    private BigDecimal accountBalance;

    @Column(nullable = false)
    private LocalDate lastTransactionDate;

    @Column(nullable = false)
    private Long ssafyUserId;

    @Column(nullable = false)
    private Long demandDepositId;
}