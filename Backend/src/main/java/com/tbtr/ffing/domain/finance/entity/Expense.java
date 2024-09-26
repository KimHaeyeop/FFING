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
@ToString
@Table(name = "expense")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expenseId;

    @Column(nullable = false, length = 255)
    private String expenseName;

    @Enumerated(EnumType.STRING)
    private ExpenseCategory expenseCategory;

    @Column(length = 255)
    private String expenseMemo;

    @Column(nullable = false, length = 8)
    private String expenseDate;

    @Column(nullable = false, length = 6)
    private String expenseTime;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal expenseBalance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}