package com.tbtr.ffing.domain.finance.entity;

import com.tbtr.ffing.domain.user.entity.User;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    public Expense toEntity(User user) {
        return Expense.builder()
                .expenseName(this.merchant)
                .expenseCategory(this.category)
                .expenseMemo(null)
                .expenseDate(this.transactionDate)
                .expenseTime(this.transactionTime)
                .expenseBalance(this.paymentBalance)
                .user(user)
                .build();
    }
}