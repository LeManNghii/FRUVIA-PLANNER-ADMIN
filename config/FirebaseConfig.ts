// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUk8k32EvrmAI6PijofeHq1u6V_uquKY0",
  authDomain: "native-a57e4.firebaseapp.com",
  projectId: "native-a57e4",
  storageBucket: "native-a57e4.firebasestorage.app",
  messagingSenderId: "697323710011",
  appId: "1:697323710011:web:f3ddf394c356dba1cb9e1e",
  measurementId: "G-52Q5203G4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);