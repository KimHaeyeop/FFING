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
@Table(name = "deposit_account")
public class DepositAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long depositAccountId;

    @Column(nullable = false, length = 3)
    private String bankCode;

    @Column(nullable = false, length = 20)
    private String accountName;

    @Column(nullable = false, length = 20)
    private String withdrawalAccountNo;

    @Column(nullable = false, length = 20)
    private String accountNo;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal depositBalance;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal totalBalance;

    @Column(nullable = false)
    private LocalDate accountCreateDate;

    @Column(nullable = false)
    private LocalDate accountExpiryDate;

    @Column(nullable = false)
    private Long depositProductId;

    @Column(nullable = false)
    private Long ssafyUserId;
}