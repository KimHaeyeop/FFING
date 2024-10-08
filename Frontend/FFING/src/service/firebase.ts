import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "../api/AxiosConfig";

interface FirebaseMessage {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
  data?: {
    [key: string]: string;
  };
}

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FCM_API_KEY,
  authDomain: import.meta.env.VITE_APP_FCM_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FCM_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FCM_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FCM_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FCM_APP_ID,
  measurementId: import.meta.env.VITE_APP_FCM_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

class NotificationPermissionHandler {
  private permissionState: NotificationPermission;
  private lastChecked: number;

  constructor() {
    this.permissionState = Notification.permission;
    this.lastChecked = Date.now();
  }

  async checkAndRequestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("이 브라우저는 알림을 지원하지 않습니다.");
      return false;
    }

    if (this.permissionState === "granted") {
      return true;
    }

    if (this.permissionState === "denied") {
      this.showManualSettingsGuide();
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionState = permission;
      if (permission === "granted") {
        console.log("알림 권한이 허용되었습니다.");
        return true;
      } else {
        console.log("알림 권한이 거부되었습니다.");
        this.showManualSettingsGuide();
        return false;
      }
    } catch (error) {
      console.error("알림 권한 요청 중 오류 발생:", error);
      return false;
    }
  }

  showManualSettingsGuide() {
    alert(
      "브라우저 설정에서 알림을 수동으로 활성화해주세요. 설정 > 개인정보 및 보안 > 사이트 설정 > 알림"
    );
  }

  explainNotificationImportance() {
    alert(
      "알림을 활성화하면 중요한 업데이트와 메시지를 실시간으로 받아볼 수 있습니다."
    );
  }

  offerAlternativeCommunication() {
    console.log("대체 통신 방법을 제공하는 UI를 표시합니다.");
    // 여기에 이메일 알림 등록 로직을 추가할 수 있습니다.
  }

  async periodicPermissionCheck() {
    const now = Date.now();
    if (now - this.lastChecked > 24 * 60 * 60 * 1000) {
      // 하루에 한 번 확인
      this.lastChecked = now;
      await this.checkAndRequestPermission();
    }
  }
}

const notificationHandler = new NotificationPermissionHandler();

export const requestPermissionAndGetToken = async (
  userId: number
): Promise<string | undefined> => {
  try {
    const isPermissionGranted =
      await notificationHandler.checkAndRequestPermission();
    if (isPermissionGranted) {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FCM_KEY,
      });
      if (token) {
        console.log("FCM Token:", token);
        await sendTokenToServer(userId, token);
        return token;
      } else {
        alert("토큰을 생성할 수 없습니다. 권한을 허용해주세요.");
      }
    } else {
      notificationHandler.explainNotificationImportance();
      notificationHandler.offerAlternativeCommunication();
    }
  } catch (err) {
    console.error("토큰 얻기 오류", err);
    throw err;
  }
};

export const sendTokenToServer = async (
  userId: number,
  token: string
): Promise<void> => {
  try {
    await axios.post(`/fcm/register/${userId}`, token);
    console.log("Token sent to server successfully");
  } catch (err) {
    console.error("Failed to send token to server:", err);
  }
};

export const setupMessageListener = () => {
  onMessage(messaging, (payload: FirebaseMessage) => {
    console.log("Message received. ", payload);

    if (payload.notification) {
      const notificationTitle =
        payload.notification.title || "New Notification";
      const notificationOptions: NotificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
      };

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(notificationTitle, notificationOptions);
      } else {
        console.log(
          "Notification not shown:",
          notificationTitle,
          notificationOptions
        );
      }
    }

    updateUI(payload);
  });
};

const updateUI = (payload: FirebaseMessage) => {
  console.log("Updating UI with new message", payload);

  if (payload.notification) {
    const messageElement = document.getElementById("latest-message");
    if (messageElement) {
      messageElement.textContent =
        payload.notification.body || "New message received";
    }
  }

  if (payload.data) {
    Object.entries(payload.data).forEach(([key, value]) => {
      const element = document.getElementById(`data-${key}`);
      if (element) {
        element.textContent = value;
      }
    });
  }
};

// 서비스 워커 등록
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// 앱 초기화 시 메시지 리스너 설정
setupMessageListener();

// 주기적으로 알림 권한 확인
setInterval(() => {
  notificationHandler.periodicPermissionCheck();
}, 24 * 60 * 60 * 1000); // 매일 확인

// 앱 시작 시 초기화 함수 (필요한 경우 호출)
export const initializeNotifications = async (userId: number) => {
  try {
    const token = await requestPermissionAndGetToken(userId);
    if (token) {
      console.log("Notification system initialized successfully");
    } else {
      console.log("Failed to initialize notification system");
    }
  } catch (error) {
    console.error("Error initializing notification system:", error);
  }
};
