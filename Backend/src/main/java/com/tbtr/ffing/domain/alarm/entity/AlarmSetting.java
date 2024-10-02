package com.tbtr.ffing.domain.alarm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "alarm_setting")
public class AlarmSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alarmId;

    @Column(nullable = true, columnDefinition = "tinyint(1) default 1")
    private Boolean dailyAlarm;

    @Column(nullable = true, columnDefinition = "tinyint(1) default 1")
    private Boolean weeklyAlarm;

    @Column(nullable = true, columnDefinition = "tinyint(1) default 1")
    private Boolean monthlyAlarm;

    @Column(nullable = true, columnDefinition = "tinyint(1) default 1")
    private Boolean eventAlarm; // ADVICE, WARNING, CAUTION에 해당

    @Column(nullable = true, columnDefinition = "tinyint(1) default 1")
    private Boolean gameAlarm;

    @Column(nullable = false)
    private Long userId;
}