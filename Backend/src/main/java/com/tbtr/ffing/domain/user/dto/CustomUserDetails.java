package com.tbtr.ffing.domain.user.dto;

import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.entity.UserRole;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
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
    private final String email, password;
    private final UserRole role;

    public static CustomUserDetails of(User user) {
        return CustomUserDetails.builder()
                                .userId(user.getUserId())
                                .ssafyUserId(user.getSsafyUserId())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .build();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.getKey()));
    }

    public Map<String, Object> getClaims() {
        Map<String, Object> map = new HashMap<>();

        map.put("userId", userId);
        map.put("ssafyUserId", ssafyUserId);
        map.put("role", role);

        return map;
    }
}