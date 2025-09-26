// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAG46eGfa1e53b2mdvdVoKqJ5F8KNH5KNc",
  authDomain: "fir-init-functions-a2c26.firebaseapp.com",
  projectId: "fir-init-functions-a2c26",
  storageBucket: "fir-init-functions-a2c26.firebasestorage.app",
  messagingSenderId: "210841521220",
  appId: "1:210841521220:web:32bc8ec55323153871c011",
  measurementId: "G-2HQWC4VN0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
