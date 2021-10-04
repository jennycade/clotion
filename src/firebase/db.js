// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "clotion-5e4b4.firebaseapp.com",
  projectId: "clotion-5e4b4",
  storageBucket: "clotion-5e4b4.appspot.com",
  messagingSenderId: "671732556068",
  appId: "1:671732556068:web:71ddeb20626a92bb3713b1",
  measurementId: "G-D4LMDNPNEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();


export { app, analytics, db, auth };