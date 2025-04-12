import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDbjYlTF7VaLzjwySSVjktoVhwXQ836nhU",
  authDomain: "streamline-cinemas.firebaseapp.com",
  projectId: "streamline-cinemas",
  storageBucket: "streamline-cinemas.firebasestorage.app",
  messagingSenderId: "692325065515",
  appId: "1:692325065515:web:b3ae60d627787eb3da1b6e",
  measurementId: "G-HZXBRZM9SR"
};
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

export { db, database };
