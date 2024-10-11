package com.tbtr.ffing.domain.alarm.repository;

import com.tbtr.ffing.domain.alarm.entity.Alarm;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    List<Alarm> findAllByUserIdOrderByAlarmDateDescAlarmTimeDesc(Long userId);

    Optional<Alarm> findByUserIdAndAlarmId(Long userId, Long alarmId);
}
