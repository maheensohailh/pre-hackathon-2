import { auth, onAuthStateChanged, db, doc, getDoc } from "../firebase.config.js";

const username = document.getElementById("username");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html"; 
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      username.innerText = snap.data().name || "User";
    } else {
      username.innerText = "User";
    }
  } catch (error) {
    console.log(error);
  }
});
