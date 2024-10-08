package com.tbtr.ffing.domain.alarm.dto.response;

import com.tbtr.ffing.domain.alarm.entity.Alarm;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AlarmRes {

    private Long alarmId;
    private String alarmDate;
    private String alarmTime;
    private String alarmType;
    private String alarmTitle;
    private String alarmContent;
    private String alarmLabel;
    private Boolean alarmStatus;

    public static AlarmRes of(Alarm alarm) {
        return AlarmRes.builder()
                       .alarmId(alarm.getAlarmId())
                       .alarmDate(alarm.getAlarmDate())
                       .alarmTime(alarm.getAlarmTime())
                       .alarmType(alarm.getAlarmType().toString())
                       .alarmTitle(alarm.getAlarmTitle())
                       .alarmContent(alarm.getAlarmContent())
                       .alarmLabel(alarm.getAlarmLabel().toString())
                       .alarmStatus(alarm.getAlarmStatus()).build();
    }
}
