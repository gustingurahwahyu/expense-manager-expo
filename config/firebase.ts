import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// TODO: Ganti dengan konfigurasi Firebase Anda dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCcyvvjEx_VJRa2L7GbkYf9S8riAlH4vLw",
  authDomain: "expense-manager-expo.firebaseapp.com",
  projectId: "expense-manager-expo",
  storageBucket: "expense-manager-expo.firebasestorage.app",
  messagingSenderId: "678071717279",
  appId: "1:678071717279:web:1c5e1320a1c1b6997541aa",
  measurementId: "G-VX7WGDFJHD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
