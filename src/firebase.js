import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoz3OqRUQUwrLvNVb3ohNQuPEUaHBfxvM",
  authDomain: "balaji-rishi.firebaseapp.com",
  projectId: "balaji-rishi",
  storageBucket: "balaji-rishi.firebasestorage.app",
  messagingSenderId: "325988048469",
  appId: "1:325988048469:web:c210a421f51d4641123edc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
