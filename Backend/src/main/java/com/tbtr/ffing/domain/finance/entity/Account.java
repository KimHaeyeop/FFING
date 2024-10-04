package com.tbtr.ffing.domain.finance.entity;

import com.tbtr.ffing.domain.user.entity.SsafyUser;
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

    @Column(nullable = false, length = 5)
    private String bankCode;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ssafy_user_id", nullable = false)
    private SsafyUser ssafyUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demand_deposit_id", nullable = false)
    private AccountProduct accountProduct;
}