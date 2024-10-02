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
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class FcmServiceImpl implements FcmService {
    private final FirebaseMessaging firebaseMessaging;
    private final FcmRepository fcmRepository;
    private final UserRepository userRepository;

    @Override
    public void sendNotification(final String title, final String body, final String token) throws
            FirebaseMessagingException {
        Message message = Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .setToken(token)
                .build();
        firebaseMessaging.send(message);
    }

    @Override
    public void saveToken(final Long userId, final String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + userId));
        Fcm fcm = fcmRepository.findByUser(user);
        if (fcm == null) {
            fcm = Fcm.builder()
                    .fcmToken(token)
                    .user(user)
                    .build();
        }
        fcm.setFcmToken(token);

        fcmRepository.save(fcm);
    }
}
