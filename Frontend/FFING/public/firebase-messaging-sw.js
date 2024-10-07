importScripts("https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js");

// Firebase 구성 객체를 사용해 Firebase를 초기화합니다.
const firebaseConfig = {
  apiKey: "AIzaSyAARBiN91sAOuOWcXLvWdy7yVjPs5LDPFo",
  authDomain: "ffing-9c142.firebaseapp.com",
  projectId: "ffing-9c142",
  storageBucket: "ffing-9c142.appspot.com",
  messagingSenderId: "288287873787",
  appId: "1:288287873787:web:ed19eb9f0b101bf3b12e5e",
  measurementId: "G-1KYWB1FN61",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // 원하는 아이콘으로 변경
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
