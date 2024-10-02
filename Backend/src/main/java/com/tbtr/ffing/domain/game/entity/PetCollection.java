package com.tbtr.ffing.domain.game.entity;

import com.tbtr.ffing.domain.user.entity.User;
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
    private LocalDate createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private PetList petList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
