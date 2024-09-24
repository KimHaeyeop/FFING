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
@Table(name = "savings_account")
public class SavingsAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long savingsAccountId;

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

    @Column(nullable = true)
    private Long installmentNumber;

    @Column(nullable = false)
    private LocalDate accountCreateDate;

    @Column(nullable = false)
    private LocalDate accountExpiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SavingsAccountStatus status;

    @Column(nullable = false)
    private Long savingsProductId;

    @Column(nullable = false)
    private Long ssafyUserId;

    public enum SavingsAccountStatus {
        ACTIVE, MATURED, CLOSED
    }
}