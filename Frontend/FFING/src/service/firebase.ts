import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "../api/AxiosConfig";

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

export const initializeFirebaseMessaging = async (userId: number) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FCM_KEY,
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);
        await sendTokenToServer(userId, currentToken);
      } else {
        console.log(
          "토큰 등록이 불가능 합니다. 생성하려면 권한을 허용해주세요"
        );
      }
    } else if (permission === "denied") {
      console.log(
        "web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요"
      );
    }
  } catch (err) {
    console.error("An error occurred while retrieving token: ", err);
  }
};

// 포그라운드 메시지 수신
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
});

export const sendTokenToServer = async (
  userId: number,
  token: string
): Promise<void> => {
  try {
    await axios.post(`/fcm/register/${userId}`, { token });
    console.log("Token sent to server successfully");
  } catch (err) {
    console.error("Failed to send token to server:", err);
    throw err; // 에러를 상위로 전파하여 호출자가 처리할 수 있게 합니다.
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
