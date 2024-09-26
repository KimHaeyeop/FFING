package com.tbtr.ffing.domain.finance.entity;

import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.DepositAssetRes;
import com.tbtr.ffing.domain.user.entity.SsafyUser;
import com.tbtr.ffing.domain.user.entity.User;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deposit_product_id", nullable = false)
    private DepositProduct depositProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ssafy_user_id", nullable = false)
    private SsafyUser ssafyUser;

    public DepositAssetRes of(DepositAccount depositAccount) {
        return DepositAssetRes.builder()
                .depositId(depositAccount.depositAccountId)
                .bankCode(depositAccount.bankCode)
                .accountName(depositAccount.accountName)
                .accountNo(depositAccount.accountNo)
                .totalBalance(depositAccount.totalBalance)
                .build();
    }
}