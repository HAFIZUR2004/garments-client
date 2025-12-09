// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcvBenlckXSnicLn1rmFi__Woz3ibF33s",
  authDomain: "garments-5f176.firebaseapp.com",
  projectId: "garments-5f176",
  storageBucket: "garments-5f176.firebasestorage.app",
  messagingSenderId: "431390340546",
  appId: "1:431390340546:web:55d09f94ecd115f85c925b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ এখানে export করা হয়েছে

export default app;