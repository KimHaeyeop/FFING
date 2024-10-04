package com.tbtr.ffing.domain.game.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pet_list")
public class PetList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petId;

    @Column(nullable = false, length = 10)
    private String petName;

    @Column(nullable = false)
    private int petCategory; // 음식 같은 카테고리
}