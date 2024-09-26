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
@Table(name = "stock_info")
public class StockInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockInfoId;

    @Column(nullable = false, length = 6)
    private String stockCode;

    @Column(nullable = false, length = 50)
    private String stockName;

    @Column(nullable = false)
    private Long currentEvaluationPrice;

}