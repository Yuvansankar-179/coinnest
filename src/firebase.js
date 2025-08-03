import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVipQhs0jAZ95q3rkpgL0ptKXsj_oD118",
  authDomain: "coinnest-b965c.firebaseapp.com",
  projectId: "coinnest-b965c",
  storageBucket: "coinnest-b965c.firebasestorage.app",
  messagingSenderId: "414496572681",
  appId: "1:414496572681:web:05614ed90ceade08c5ffd8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
