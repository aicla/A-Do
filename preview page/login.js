import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
  authDomain: "a-do-ff29e.firebaseapp.com",
  databaseURL: "https://a-do-ff29e-default-rtdb.firebaseio.com",
  projectId: "a-do-ff29e",
  storageBucket: "a-do-ff29e.appspot.com",
  messagingSenderId: "488739423620",
  appId: "1:488739423620:web:9bdc3605a45a3714b249d1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

// Google sign in
const googleSignInBtn = document.getElementById("googleSign");

googleSignInBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // User successfully signed in.
      const user = result.user;
      const uid = user.uid;
      const photoURL = user.photoURL;
      const displayName = user.displayName;

      localStorage.setItem("uid", uid);
      localStorage.setItem("photoURL", photoURL);
      localStorage.setItem("displayName", displayName);

      window.location.href = "../home page/homepage.html";
    })
    .catch((error) => {
      console.error(error);
    });
});
