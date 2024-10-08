// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js"
);

// Firebase 설정 객체 (firebase.ts와 동일한 값 사용)
const firebaseConfig = {
  apiKey: "AIzaSyAARBiN91sAOuOWcXLvWdy7yVjPs5LDPFo",
  authDomain: "ffing-9c142.firebaseapp.com",
  projectId: "ffing-9c142",
  storageBucket: "ffing-9c142.appspot.com",
  messagingSenderId: "288287873787",
  appId: "1:288287873787:web:ed19eb9f0b101bf3b12e5e",
  measurementId: "G-1KYWB1FN61",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const { title, body } = payload.notification;
  const options = {
    body: body,
    icon: "./logo.png",
    badge: "./logo.png",
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});

self.addEventListener("notificationclick", (event) => {
  const urlToOpen = new URL(`http://localhost:5173`);

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        let foundWindowClient = null;

        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];

          if (client.url.includes("localhost:5173") && "focus" in client) {
            foundWindowClient = client;
            break;
          }
        }

        if (foundWindowClient) {
          return foundWindowClient.focus().then((focusedClient) => {
            if ("navigate" in focusedClient) {
              focusedClient.postMessage(urlToOpen.href);
            }
          });
        } else if (clients.openWindow) {
          return clients.openWindow(urlToOpen.href);
        }
      })
  );
});
