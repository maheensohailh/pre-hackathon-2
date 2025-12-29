import {
  auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "../firebase.config.js";

// LOGIN ////

document.getElementById("btn2")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pswd").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    if (!userCred.user.emailVerified) {
      alert("❌ Please verify your email first");
      return;
    }

    window.location.href = "./HTML/profile.html";
  } catch (e) {
    alert("Please Signup");
  }
});

// FORGOT PASSWORD

document.getElementById("forget-paswd")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;

  if (!email) return alert("Enter email first");

  await sendPasswordResetEmail(auth, email);
  alert("✅ Reset email sent");
});

// GOOGLE LOGIN

const provider = new GoogleAuthProvider();
document.getElementById("google-btn")?.addEventListener("click", async () => {
  await signInWithPopup(auth, provider);
  window.location.href = "../HTML/profile.html";
});

// //// logout ///

document.getElementById("logout-btn")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("✅ Logged out successfully");
    window.location.href = "../index.html"; 
  } catch (error) {
    alert(error.message);
  }
});