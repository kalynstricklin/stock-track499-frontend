// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // For Firestore database
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBeDsKwvP8SbwhwUjVmHnPidW2LxLqOWsg",
  authDomain: "stock-track499.firebaseapp.com",
  projectId: "stock-track499",
  storageBucket: "stock-track499.appspot.com",
  messagingSenderId: "1087349742937",
  appId: "1:1087349742937:web:c2469041ea35a95d164048",
  measurementId: "G-0ZBL0Z29BP"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


// Export Firestore database
const db = getFirestore(firebaseApp);

// export Firebase Auth
const auth = getAuth(firebaseApp);

export { firebaseApp, db, auth };






//{
//
//   "hosting": {
//
//     "site": "",
//
//     "public": "public",
//
//     ...
//
//   }
//
// }
//firebase deploy --only hosting: