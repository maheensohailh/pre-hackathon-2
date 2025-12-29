import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc   
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBffIvxKtcfqmKxeJjatZ-D6sglDzTt9c",
  authDomain: "practice-project-e6923.firebaseapp.com",
  projectId: "practice-project-e6923",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc
};
