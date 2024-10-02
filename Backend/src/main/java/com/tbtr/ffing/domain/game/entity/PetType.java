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
@Table(name = "pet_type")
public class PetType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petTypeId;

    @Column(nullable = false, length = 2)
    private String typeCode;

    @Column(nullable = false, length = 20)
    private String typeName;

    @Column(nullable = false, length = 255)
    private String imageUrl;

}