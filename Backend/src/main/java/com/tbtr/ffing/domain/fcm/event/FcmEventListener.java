package com.tbtr.ffing.domain.fcm.event;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.tbtr.ffing.domain.fcm.service.FcmService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor

public class FcmEventListener {
    private final FcmService fcmService;

    @EventListener
    public void handleFcmNotificationEvent(FcmEvent event) throws FirebaseMessagingException {
        // FCM 메시지 전송
        fcmService.sendNotification(event.getTitle(), event.getMessage(), event.getFcmToken());
    }
}
