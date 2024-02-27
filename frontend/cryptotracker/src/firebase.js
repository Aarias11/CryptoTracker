
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDoc, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import for Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJA4Aldo1UZGBpOJxuLsGnanfHL8nvkKQ",
  authDomain: "cryptotracker-bf76c.firebaseapp.com",
  projectId: "cryptotracker-bf76c",
  storageBucket: "cryptotracker-bf76c.appspot.com",
  messagingSenderId: "399803161725",
  appId: "1:399803161725:web:4c33fe3786eeb48187e514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

export { auth, db, storage, doc, setDoc, deleteDoc, collection, getDoc, getDocs, addDoc };
