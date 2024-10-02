import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "../api/axiosConfig";

const firebaseConfig = {
  apiKey: "AIzaSyAARBiN91sAOuOWcXLvWdy7yVjPs5LDPFo",
  authDomain: "ffing-9c142.firebaseapp.com",
  projectId: "ffing-9c142",
  storageBucket: "ffing-9c142.appspot.com",
  messagingSenderId: "288287873787",
  appId: "1:288287873787:web:ed19eb9f0b101bf3b12e5e",
  measurementId: "G-1KYWB1FN61",
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
        // Send token to backend
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

onMessage(messaging, (payload) => {
  // Handle received message while app is running
  console.log("Message received. ", payload);
});

// This function might need to be adjusted based on your backend implementation
// export const getNoti = async (userRoomId: number): Promise<any> => {
//   const { data } = await axios.get("/noti", {
//     params: { userRoomId },
//   });
//   return data;
// };
