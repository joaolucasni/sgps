import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDzMnV2dDiatT0bPfZJ341XnYgG00tklpo",
  authDomain: "projetosgps-bef72.firebaseapp.com",
  projectId: "projetosgps-bef72",
  storageBucket: "projetosgps-bef72.appspot.com",
  messagingSenderId: "410866829004",
  appId: "1:410866829004:web:ccc75e0c17b404d60fe469",
  measurementId: "G-63JK3H72BG"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, auth, database, storage, analytics, signInWithEmailAndPassword, createUserWithEmailAndPassword };
