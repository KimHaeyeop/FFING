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
@Table(name = "pet_collection")
public class PetCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petCollectionId;

    @Column(nullable = false)
    private LocalDate obtainedAt;

    @Column(nullable = false)
    private Long petId;

    @Column(nullable = false)
    private Long gameProfileId;
}