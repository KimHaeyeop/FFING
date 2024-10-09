package com.tbtr.ffing.domain.finance.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "account_product")
public class AccountProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountProductId;

    @Column(nullable = false, length = 20)
    private String accountTypeUniqueNo;

    @Column(nullable = false, length = 20)
    private String accountName;

    @Column(nullable = false, length = 5)
    private String bankCode;

    @Column(nullable = false, length = 20)
    private String bankName;
}