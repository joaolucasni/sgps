import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAK2tcKc4IiFnnIO4wmXV3cdx9SUrOVlXo",
  authDomain: "sgps-76f89.firebaseapp.com",
  databaseURL: "https://sgps-76f89-default-rtdb.firebaseio.com",
  projectId: "sgps-76f89",
  storageBucket: "sgps-76f89.appspot.com",
  messagingSenderId: "246812535737",
  appId: "1:246812535737:web:036e197246776355146468",
  measurementId: "G-4Z1TZM4938"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, auth, database, storage, analytics, signInWithEmailAndPassword, createUserWithEmailAndPassword };
