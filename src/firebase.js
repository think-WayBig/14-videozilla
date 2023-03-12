import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"  
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBbVYnYUdYhgvUwDvxYk8IOtzIab_N6e04",
  authDomain: "upload-files-19cb6.firebaseapp.com",
  projectId: "upload-files-19cb6",
  storageBucket: "upload-files-19cb6.appspot.com",
  messagingSenderId: "866696124781",
  appId: "1:866696124781:web:f320cc5c8d9cd4683de264"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
export const storage = getStorage(app);
export default db;