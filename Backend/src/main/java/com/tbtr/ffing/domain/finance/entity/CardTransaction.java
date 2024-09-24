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
@Table(name = "card_transaction")
public class CardTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cardTransactionId;

    @Column(nullable = false, length = 255)
    private String category;

    @Column(nullable = false, length = 100)
    private String merchant;

    @Column(nullable = false, length = 8)
    private String transactionDate;

    @Column(nullable = false, length = 6)
    private String transactionTime;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal paymentBalance;

    @Column(nullable = false, length = 20)
    private String transactionStatus;

    @Column(nullable = false, length = 16)
    private String cardNo;

    @Column(nullable = false)
    private Long ssafyUserId;

    @Column(nullable = false)
    private Long cardProductId;
}