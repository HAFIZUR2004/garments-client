// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0w9tcRzX1EsX5tBg2tSj6p78wToEeK5s",
  authDomain: "garmentspro-9850d.firebaseapp.com",
  projectId: "garmentspro-9850d",
  storageBucket: "garmentspro-9850d.firebasestorage.app",
  messagingSenderId: "811417211428",
  appId: "1:811417211428:web:e6a75b09938016e0bebeb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ এখানে export করা হয়েছে

export default app;