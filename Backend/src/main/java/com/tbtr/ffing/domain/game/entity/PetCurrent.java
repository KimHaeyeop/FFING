package com.tbtr.ffing.domain.game.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pet_current")
public class PetCurrent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petCurrentId;

    @Column(nullable = false)
    private LocalDate obtainedAt;

    @Column(nullable = false)
    private int currentFoodStat;

    @Column(length = 255)
    private String field; // 스탯 카테고리 추가해야함

    @Column(nullable = false)
    private int winCount;

    @Column(nullable = false)
    private int loseCount;

    @Column(nullable = false)
    private Long petId;

    @Column(nullable = false)
    private Long gameProfileId;
}