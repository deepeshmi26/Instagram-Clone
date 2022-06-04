import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDDzPQPqRVKXY_Td872q9DVJhdlzy4hhpg",
  authDomain: "instagram-clone-f5ce0.firebaseapp.com",
  projectId: "instagram-clone-f5ce0",
  storageBucket: "instagram-clone-f5ce0.appspot.com",
  messagingSenderId: "447795024717",
  appId: "1:447795024717:web:5106d4b5375e2e9e8fdd04",
  measurementId: "G-KS991MV3XR",
};

const app = firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();