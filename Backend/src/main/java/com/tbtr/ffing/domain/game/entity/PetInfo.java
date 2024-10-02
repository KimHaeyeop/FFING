package com.tbtr.ffing.domain.game.entity;

import com.tbtr.ffing.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pet_info")
public class PetInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petInfoId;

    @Column(nullable = false)
    private int totalStat;

    @Column(nullable = false)
    private int financeStat;

    @Column(nullable = false)
    private int foodBakeryStat;

    @Column(nullable = false)
    private int lifeCultureStat;

    @Column(nullable = false)
    private int shoppingStat;

    @Column(nullable = false)
    private int transportationStat;

    @Column(nullable = false)
    private int winCount;

    @Column(nullable = false)
    private int loseCount;

    @Column(nullable = false)
    private LocalDate createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private PetList petList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private PetType petType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
