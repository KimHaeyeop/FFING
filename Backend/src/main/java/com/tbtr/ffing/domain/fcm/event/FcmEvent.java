package com.tbtr.ffing.domain.fcm.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class FcmEvent extends ApplicationEvent {
    private final String title;
    private final String message;
    private final String fcmToken;

    public FcmEvent(Object source, final String title, final String message,
                    final String fcmToken) {
        super(source);
        this.title = title;
        this.message = message;
        this.fcmToken = fcmToken;
    }
}