// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyC98Sgqe_JTdWt9PXB5oaNsmD9aUFakEgo',
  authDomain: 'ai-3d-scanning.firebaseapp.com',
  projectId: 'ai-3d-scanning',
  storageBucket: 'ai-3d-scanning.firebasestorage.app',
  messagingSenderId: '662482395801',
  appId: '1:662482395801:web:f910b703a44a4588f1ce08',
  measurementId: 'G-X3KS58GML6',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 🔹 Request Permission
export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        'BOU5C5tz_IZrKxNVrkDS40TfzmbJZX2OFPjoimXxx9SdoCvZsLzncmsDqLdbA9Tk9fv4lO_Ssx4ONi-ovdBygaA',
    });

    if (token) {
      // ✅ Sirf console me token check karo
      console.log('✅ FCM Token:', token);
    } else {
      console.warn('⚠️ FCM token generate nahi hua.');
    }
  } catch (error) {
    console.error('Permission denied ya error aayi:', error);
  }
};

// 🔹 Foreground Messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      const { title, body } = payload?.notification || {};

      console.log('📩 Foreground message received:', payload);

      if (title) {
        fetch(`${baseURL}/notifications`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('🔔 API Response:', data);
          })
          .catch((err) => console.error('API call error:', err));
      } else {
        console.log('⚠️ No title ');
      }

      resolve(payload);
    });
  });
