package com.tbtr.ffing.domain.game.dto.internal;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class DamageInfo {
    private double damage;
    private String damageStatus;
}
