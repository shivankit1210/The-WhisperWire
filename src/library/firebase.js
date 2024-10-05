import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "the-whisperwire.firebaseapp.com",
  projectId: "the-whisperwire",
  storageBucket: "the-whisperwire.appspot.com",
  messagingSenderId: "1036967598577",
  appId: "1:1036967598577:web:2da71ba59f91c639b98c50"
};

const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const db =getFirestore();
export const storage= getStorage();