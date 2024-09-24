package com.tbtr.ffing.domain.alarm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "alarm")
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alarmId;

    @Column(nullable = false, length = 8)
    private String alarmDate;

    @Column(nullable = false, length = 6)
    private String alarmTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlarmType alarmType;

    @Column(nullable = false, length = 20)
    private String alarmTitle;

    @Column(nullable = false, length = 255)
    private String alarmContent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlarmLabel alarmLabel;

    @Column(nullable = true, columnDefinition = "tinyint(1) default 0")
    private Boolean alarmStatus;

    @Column(nullable = false)
    private Long userId;

    public enum AlarmType {
        DAILY, WEEKLY, MONTHLY, EVENT, GAME
    }

    public enum AlarmLabel {
        CHECK, ADVICE, WARNING, CAUTION, GAME
    }
}