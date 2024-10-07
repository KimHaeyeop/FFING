package com.tbtr.ffing.domain.alarm.service.impl;

import com.tbtr.ffing.domain.alarm.dto.response.AlarmRes;
import com.tbtr.ffing.domain.alarm.entity.Alarm;
import com.tbtr.ffing.domain.alarm.repository.AlarmRepository;
import com.tbtr.ffing.domain.alarm.service.AlarmService;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlarmServiceImpl implements AlarmService {

    private final AlarmRepository alarmRepository;

    @Override
    public List<AlarmRes> getAlarmList(Long userId) {
        List<Alarm> alarms = alarmRepository.findAllByUserIdOrderByAlarmDateDescAlarmTimeDesc(userId);

        return alarms.stream()
                     .map(AlarmRes::of)  // Alarm -> AlarmRes 변환
                     .collect(Collectors.toList());
    }

    @Override
    public AlarmRes getAlarm(Long userId, Long alarmId) {
        Alarm alarm = alarmRepository.findByUserIdAndAlarmId(userId, alarmId)
                                         .orElseThrow(() -> new CustomException(ErrorCode.ALARM_NOT_FOUND));
        // alarmStatus 를 true 로 업데이트
        if (!alarm.getAlarmStatus()) {
            alarm.setAlarmStatus(true);
            alarmRepository.save(alarm);  // DB에 업데이트 반영
        }
        return AlarmRes.of(alarm);
    }
}
