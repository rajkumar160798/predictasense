import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDoQFuY4wFgqRGX3cX7ghwWsRJb58ksmIM",
    authDomain: "predictasense.firebaseapp.com",
    projectId: "predictasense",
    storageBucket: "predictasense.firebasestorage.app",
    messagingSenderId: "463485542917",
    appId: "1:463485542917:web:f42910182e54058b30326c"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
