// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfDBx-XRI_J9-dSZz7JyynkcTJUw80BGA",
  authDomain: "linkedin-d4294.firebaseapp.com",
  projectId: "linkedin-d4294",
  storageBucket: "linkedin-d4294.appspot.com",
  messagingSenderId: "679687899002",
  appId: "1:679687899002:web:cb98f31dbeb3565d9d78c3",
  measurementId: "G-HVCG44PDQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig;