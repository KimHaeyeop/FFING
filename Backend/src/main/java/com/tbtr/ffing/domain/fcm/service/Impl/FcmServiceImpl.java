package com.tbtr.ffing.domain.fcm.service.Impl;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.tbtr.ffing.domain.fcm.entity.Fcm;
import com.tbtr.ffing.domain.fcm.repository.FcmRepository;
import com.tbtr.ffing.domain.fcm.service.FcmService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class FcmServiceImpl implements FcmService {
    private final FirebaseMessaging firebaseMessaging;
    private final FcmRepository fcmRepository;
    private final UserRepository userRepository;

    @Override
    public void sendNotification(final String title, final String body, final String token) throws FirebaseMessagingException {
        Message message = Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .setToken(token)
                .build();

        try {
            String response = firebaseMessaging.send(message);
            log.info("===메세지 전송===");
            log.info("Successfully sent message: {}", response);
        } catch (FirebaseMessagingException e) {
            log.info("===메세지 전송 실패ㅠㅠ");
            log.error("Failed to send FCM message. Error: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public String saveToken(final Long userId, final String encodedToken) {
        // URL 디코딩
        String decodedToken = URLDecoder.decode(encodedToken, StandardCharsets.UTF_8);

        // 불필요한 '=' 제거
        String cleanToken = decodedToken.endsWith("=") ? decodedToken.substring(0, decodedToken.length() - 1) : decodedToken;

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + userId));

        Fcm fcm = fcmRepository.findByUser(user);
        if (fcm == null) {
            fcm = Fcm.builder()
                    .fcmToken(cleanToken)
                    .user(user)
                    .build();
        } else {
            fcm.setFcmToken(cleanToken);
        }

        System.out.println(fcm.getFcmToken());

        fcmRepository.save(fcm);
        return cleanToken; // 정제된 토큰 반환
    }
}
