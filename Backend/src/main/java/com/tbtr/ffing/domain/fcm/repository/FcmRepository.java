package com.tbtr.ffing.domain.fcm.repository;

import com.tbtr.ffing.domain.fcm.entity.Fcm;
import com.tbtr.ffing.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FcmRepository extends JpaRepository<Fcm, Long> {
    Optional<Fcm> findByUserUserId(Long userId);

    @Query("SELECT f FROM Fcm f WHERE f.user.userId IN :userIds")
    List<Fcm> findAllByUserIds(@Param("userIds") List<Long> userIds);

    Fcm findByUser(User user);
}