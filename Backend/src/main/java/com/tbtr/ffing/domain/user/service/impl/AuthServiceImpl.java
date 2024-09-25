package com.tbtr.ffing.domain.user.service.impl;

import com.tbtr.ffing.domain.user.dto.UserInfoDto;
import com.tbtr.ffing.domain.user.dto.UserInfoDto.Request;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.domain.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;

    @Override
    public void signup(Request requestDTO) {
        String nickname = requestDTO.getNickname();

        System.out.println("nickname: " + nickname);
        if (userRepository.existsByNickname(nickname)) {
            return;
        }

        User userInfoDto = UserInfoDto.Request.toEntity(requestDTO, bCryptPasswordEncoder);

        userRepository.save(userInfoDto);
        System.out.println("saved user: " + userInfoDto);
    }
}
