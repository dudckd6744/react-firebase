import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCq4sPM1FMM_86kTXPm_qm9FrN48389zjY",
    authDomain: "react-firebase-chat-f1dc4.firebaseapp.com",
    projectId: "react-firebase-chat-f1dc4",
    storageBucket: "react-firebase-chat-f1dc4.appspot.com",
    messagingSenderId: "405204916546",
    appId: "1:405204916546:web:210483022901cd1d26d0db",
    measurementId: "G-0S2BRC2GNP"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
export default firebase;