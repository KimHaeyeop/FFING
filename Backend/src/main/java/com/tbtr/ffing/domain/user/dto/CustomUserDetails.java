package com.tbtr.ffing.domain.user.dto;

import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.entity.UserRole;
import java.util.Collection;
import java.util.Collections;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
@Builder
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Long userId, ssafyUserId;
    private final String email, username, password;
    private final UserRole role;

    public static CustomUserDetails of(User user) {
        return CustomUserDetails.builder()
                                .userId(user.getUserId())
                                .ssafyUserId(user.getSsafyUserId())
                                .email(user.getEmail())
                                .username(user.getUsername())
                                .role(user.getRole())
                                .build();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.getKey()));
    }
}