package com.tbtr.ffing.domain.game.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_game_profile")
public class UserGameProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameProfileId;

    @Column(nullable = false)
    private int totalWin;

    @Column(nullable = false)
    private int totalLose;

    @Column(nullable = false)
    private Long userId;
}