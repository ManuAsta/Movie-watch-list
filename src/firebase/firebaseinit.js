// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyC2oeyKRBvb7V5blk6D035EJ6Qe-Lb7FPM",
  authDomain: "movies-watchlist-d630e.firebaseapp.com",
  projectId: "movies-watchlist-d630e",
  storageBucket: "movies-watchlist-d630e.appspot.com",
  messagingSenderId: "275393760735",
  appId: "1:275393760735:web:35d453c0e4f1fe6f41086a"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const storage=getStorage(app);

