import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"; 
import {
getAuth,  
createUserWithEmailAndPassword,
signInWithEmailAndPassword ,  
sendEmailVerification,   
sendPasswordResetEmail,  
updatePassword,   
signOut,  
onAuthStateChanged, 
GoogleAuthProvider, 
signInWithPopup

} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";   
import { getDatabase , ref, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js"; 
  import {   getFirestore,   doc,   setDoc,  serverTimestamp ,   getDoc,  updateDoc,  collection,  getDocs,  query,  onSnapshot,  deleteDoc,  where,  or,  and,  addDoc } 
  from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";  
 
  const firebaseConfig = {
    apiKey: "AIzaSyBBffIvxKtcfqmKxeJjatZ-D6sglDzTt9c",
    authDomain: "practice-project-e6923.firebaseapp.com",
    databaseURL: "https://practice-project-e6923-default-rtdb.firebaseio.com",
    projectId: "practice-project-e6923",
    storageBucket: "practice-project-e6923.firebasestorage.app",
    messagingSenderId: "258448520652",
    appId: "1:258448520652:web:c2a19fa188bc057010d969"
  };

  const app = initializeApp(firebaseConfig); 
  const auth = getAuth();
  const database = getDatabase(app);  
  const db = getFirestore(app); 
     
   
export{ 
auth, 
createUserWithEmailAndPassword, 
signInWithEmailAndPassword ,
sendEmailVerification, 
sendPasswordResetEmail,
updatePassword, 
signOut, 
onAuthStateChanged, 
GoogleAuthProvider,
signInWithPopup, 
ref,
set, 
database,
db,
doc,  
setDoc,
serverTimestamp, 
getDoc , 
updateDoc,
collection, 
getDocs,
query,
onSnapshot,
deleteDoc,
where, 
or, 
and,
addDoc  
} 