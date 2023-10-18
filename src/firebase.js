// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realtor-app-42d8c.firebaseapp.com",
  projectId: "realtor-app-42d8c",
  storageBucket: "realtor-app-42d8c.appspot.com",
  messagingSenderId: "916075451037",
  appId: "1:916075451037:web:17de96611be1d131b3ba74",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
