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
@Table(name = "expense")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expenseId;

    @Column(nullable = false, length = 255)
    private String expenseName;

    @Column(nullable = false, length = 255)
    private String expenseCategory;

    @Column(length = 255)
    private String expenseMemo;

    @Column(nullable = false, length = 8)
    private String expenseDate;

    @Column(nullable = false, length = 6)
    private String expenseTime;

    @Column(nullable = false, length = 255)
    private String expenseMethod;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal expenseBalance;

    @Column(nullable = false)
    private Long userId;
}