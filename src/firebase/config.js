// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQchWgaKSWbA6tutX0BUraxxF106AtI-w",
  authDomain: "schoolmanage-8bca8.firebaseapp.com",
  projectId: "schoolmanage-8bca8",
  storageBucket: "schoolmanage-8bca8.firebasestorage.app",
  messagingSenderId: "575256618149",
  appId: "1:575256618149:web:24113727f6393ad42e994c",
  measurementId: "G-KL7QMV83NC",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
