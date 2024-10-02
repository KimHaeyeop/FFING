package com.tbtr.ffing.global.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 메세지 구독 경로
        config.enableSimpleBroker("/sub");
        // 메시지 보낼 때 관련 경로 설정
        config.setApplicationDestinationPrefixes("/pub");
    }

    // Client에서 websocket 연결할 때 사용할 API 경로를 설정
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 매칭용
        registry.addEndpoint("/match")
                .setAllowedOriginPatterns("*")
                .withSockJS();
        //배틀용
        registry.addEndpoint("/battle")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

}
