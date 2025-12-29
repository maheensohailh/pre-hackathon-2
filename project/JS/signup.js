import {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  setDoc,
  doc,
  db,
  serverTimestamp
} from "../firebase.config.js";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const pswdInput = document.getElementById("pswd");

  if (!nameInput || !emailInput || !pswdInput) {
    alert("Form fields missing");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      pswdInput.value
    );

    await setDoc(doc(db, "users", userCred.user.uid), {
      name: nameInput.value,
      email: emailInput.value,
      createdAt: serverTimestamp()
    });

    await sendEmailVerification(userCred.user);
    await signOut(auth);

    alert("Signup successful! Verify email then login.");
    window.location = "../index.html";

  } catch (err) {
    alert(err.message);
  }
});
