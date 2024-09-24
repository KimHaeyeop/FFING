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
@Table(name = "deposit_product")
public class DepositProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long depositProductId;

    @Column(nullable = false, length = 20)
    private String accountTypeUniqueNo;

    @Column(nullable = false, length = 3)
    private String bankCode;

    @Column(nullable = false, length = 20)
    private String bankName;

    @Column(nullable = false, length = 20)
    private String productName;

    @Column(nullable = false)
    private Long subscriptionPeriod;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal minSubscriptionBalance;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal maxSubscriptionBalance;

    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal interestRate;
}