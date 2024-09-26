package com.tbtr.ffing.domain.finance.entity;

import com.tbtr.ffing.domain.finance.dto.response.asset.DepositAssetRes;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "savings_product_id", nullable = false)
    private SavingsProduct SavingsProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ssafy_user_id", nullable = false)
    private SsafyUser ssafyUser;

    public DepositAssetRes of(SavingsAccount savingsAccount) {
        return DepositAssetRes.builder()
                .depositId(savingsAccount.savingsAccountId)
                .bankCode(savingsAccount.bankCode)
                .accountName(savingsAccount.accountName)
                .accountNo(savingsAccount.accountNo)
                .totalBalance(savingsAccount.totalBalance)
                .build();
    }

    public enum SavingsAccountStatus {
        ACTIVE, MATURED, CLOSED
    }

}