/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyC98Sgqe_JTdWt9PXB5oaNsmD9aUFakEgo",
  authDomain: "ai-3d-scanning.firebaseapp.com",
  projectId: "ai-3d-scanning",
  storageBucket: "ai-3d-scanning.appspot.com",
  messagingSenderId: "662482395801",
  appId: "1:662482395801:web:f910b703a44a4588f1ce08",
  measurementId: "G-X3KS58GML6",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// ✅ Disable the system notification completely
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received (suppressed):", payload);
  // ❌ DO NOT call self.registration.showNotification()
  // Let React handle it with toast notifications only.
});
