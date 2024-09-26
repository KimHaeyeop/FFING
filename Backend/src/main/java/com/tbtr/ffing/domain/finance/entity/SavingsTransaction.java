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
@Table(name = "savings_transaction")
public class SavingsTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long savingsTransactionId;

    @Column(nullable = false, length = 8)
    private String paymentDate;

    @Column(nullable = false, length = 6)
    private String paymentTime;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal paymentBalance;

    @Column(nullable = false)
    private Long depositInstallment;

    @Column(nullable = false)
    private boolean status;

    @Column(length = 255)
    private String failureReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "savings_account_id", nullable = false)
    private SavingsAccount savingsAccount;

}