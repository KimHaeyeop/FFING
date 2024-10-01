package com.tbtr.ffing.global.config;

import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.auth.JWTFilter;
import com.tbtr.ffing.global.auth.util.JWTUtil;
import com.tbtr.ffing.global.redis.repository.RedisJwtTokenRepository;
import com.tbtr.ffing.global.redis.service.RedisJwtTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Log4j2
public class SecurityConfig {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final RedisJwtTokenRepository redisJwtTokenRepository;
    private final RedisJwtTokenService redisJwtTokenService;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests((auth) -> auth
//                    .requestMatchers("/", "/auth/**").permitAll()
//                    .requestMatchers("/admin/**").hasRole("ADMIN")
//                    .anyRequest().authenticated())
                    .anyRequest().permitAll()) // 임시로 모두 허용
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // 세션 관리 설정
        http.addFilterBefore(new JWTFilter(jwtUtil, userRepository, redisJwtTokenRepository, redisJwtTokenService),
                UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
}
//package com.tbtr.ffing.global.config;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//
//        http
//                // csrf disable
//                .csrf(AbstractHttpConfigurer::disable)
//                //Form 로그인 방식 disable
//                .formLogin(AbstractHttpConfigurer::disable)
//                //http basic 인증 방식 disable
//                .httpBasic(AbstractHttpConfigurer::disable)
//                // session 설정
//                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//
//        // admin 경로는 admin 권한 소유자만 접근
//        http.authorizeHttpRequests((auth) -> auth
//                .requestMatchers("/ffing/admin/**").hasRole("ADMIN")
//                .anyRequest().authenticated());
//
//        return http.build();
//    }
//
//    @Bean
//    public BCryptPasswordEncoder bCryptPasswordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//}
