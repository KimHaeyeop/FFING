package com.tbtr.ffing.domain.finance.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "card_product")
public class CardProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cardProductId;

    @Column(nullable = false, length = 20)
    private String cardUniqueNo;

    @Column(nullable = false, length = 4)
    private String cardIssuerCode;

    @Column(nullable = false, length = 20)
    private String cardIssuerName;

    @Column(nullable = false, length = 100)
    private String cardName;

    @Column(length = 255)
    private String cardDescription;
}