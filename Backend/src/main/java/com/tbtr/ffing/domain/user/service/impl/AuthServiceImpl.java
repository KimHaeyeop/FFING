package com.tbtr.ffing.domain.user.service.impl;

import com.tbtr.ffing.domain.user.dto.UserInfoDTO;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.domain.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class AuthServiceImpl implements AuthService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;

    @Override
    public UserInfoDTO.Response signup(UserInfoDTO.Request requestDTO) {
        // ! 1. email 중복 체크
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");

        }

        // ! 2. nickname 중복 체크
        if (userRepository.existsByNickname(requestDTO.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        User userInfoDto = UserInfoDTO.Request.toEntity(requestDTO, bCryptPasswordEncoder);
        userRepository.save(userInfoDto);

        return UserInfoDTO.Response.of(userInfoDto);
    }
}
