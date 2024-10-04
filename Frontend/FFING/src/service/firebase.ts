import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "../api/axiosConfig";

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

export const requestPermissionAndGetToken = async (
  userId: number
): Promise<string | undefined> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FCM_KEY,
      });
      if (token) {
        console.log("FCM Token:", token);
        await sendTokenToServer(userId, token);
        return token;
      } else {
        alert(
          "Unable to register token. Please allow permissions to generate."
        );
      }
    } else if (permission === "denied") {
      alert(
        "Web push permission has been blocked. Please allow permissions to receive notifications."
      );
    }
  } catch (err) {
    console.error("Error obtaining token", err);
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

    // payload.notification이 존재하는지 확인
    if (payload.notification) {
      const notificationTitle =
        payload.notification.title || "New Notification";
      const notificationOptions: NotificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        // 필요한 경우 추가 옵션을 여기에 포함시킬 수 있습니다.
      };

      // 브라우저 알림 표시
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

    // UI 업데이트
    updateUI(payload);
  });
};

// updateUI 함수의 타입을 명확히 지정
const updateUI = (payload: FirebaseMessage) => {
  console.log("Updating UI with new message", payload);

  // 예시: 알림 메시지를 UI에 표시
  if (payload.notification) {
    const messageElement = document.getElementById("latest-message");
    if (messageElement) {
      messageElement.textContent =
        payload.notification.body || "New message received";
    }
  }

  // 예시: 데이터 필드를 사용하여 UI 업데이트
  if (payload.data) {
    Object.entries(payload.data).forEach(([key, value]) => {
      const element = document.getElementById(`data-${key}`);
      if (element) {
        element.textContent = value;
      }
    });
  }

  // 여기에 추가적인 UI 업데이트 로직을 구현할 수 있습니다.
};

// 서비스 워커 등록 (public 폴더에 firebase-messaging-sw.js 파일 필요)
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
