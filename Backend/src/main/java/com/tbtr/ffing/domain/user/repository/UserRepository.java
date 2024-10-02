package com.tbtr.ffing.domain.user.repository;

import com.tbtr.ffing.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);

    User findByUserId(Long userid);
    User findByEmail(String email);
}