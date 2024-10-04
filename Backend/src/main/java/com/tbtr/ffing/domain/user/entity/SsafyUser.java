package com.tbtr.ffing.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ssafy_user")
public class SsafyUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ssafyUserId;

    @Column(nullable = false, length = 40)
    private String userId;

    @Column(nullable = false, length = 20)
    private String username;

    @Column(nullable = false, length = 60)
    private String userKey;

    @Column(nullable = false)
    private LocalDate createdAt;
}