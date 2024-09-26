package com.tbtr.ffing.domain.user.service.impl;

import com.tbtr.ffing.domain.user.dto.UserInfoDto;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.domain.user.service.AuthService;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
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
    public UserInfoDto.Response signup(UserInfoDto.Request requestDTO) {
        // ! 1. email 중복 체크
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);

        }

        // ! 2. nickname 중복 체크
        if (userRepository.existsByNickname(requestDTO.getNickname())) {
            throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        User userInfoDto = UserInfoDto.Request.toEntity(requestDTO, bCryptPasswordEncoder);
        userRepository.save(userInfoDto);

        return UserInfoDto.Response.of(userInfoDto);
    }
}
