import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsGQ0Mt7GdP30fyD3F5Tis8lGoEsJZUsU",
  authDomain: "notion-clone-376ed.firebaseapp.com",
  projectId: "notion-clone-376ed",
  storageBucket: "notion-clone-376ed.firebasestorage.app",
  messagingSenderId: "819119421250",
  appId: "1:819119421250:web:23c87d51da1134c5d9fadb",
  measurementId: "G-EJ9L1DXXWQ",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
export { db };
