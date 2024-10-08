package com.tbtr.ffing.domain.alarm.service;

import com.tbtr.ffing.domain.alarm.dto.response.AlarmRes;
import java.util.List;

public interface AlarmService {

    List<AlarmRes> getAlarmList(Long userId);

    AlarmRes getAlarm(Long userId, Long alarmId);
}
