import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
  authDomain: "a-do-ff29e.firebaseapp.com",
  databaseURL: "https://a-do-ff29e-default-rtdb.firebaseio.com",
  projectId: "a-do-ff29e",
  storageBucket: "a-do-ff29e.appspot.com",
  messagingSenderId: "488739423620",
  appId: "1:488739423620:web:9bdc3605a45a3714b249d1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Sign out");
      window.location.href = "../preview page/login.html";
    })
    .catch((error) => {
      console.error("Sign-out error:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const uid = localStorage.getItem("uid");
  const photoURL = localStorage.getItem("photoURL");
  const displayName = localStorage.getItem("displayName");

  const pfp = document.getElementById("pfp");
  if (pfp) {
    pfp.innerHTML = "";
    const img = document.createElement("img");
    img.src = photoURL;
    img.alt = "Profile Picture";

    // eto na max w and h, kasi lalabo
    img.style.width = "120px";
    img.style.height = "120px";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";
    pfp.appendChild(img);
  } else {
    console.error("Profile picture element not found");
  }

  const username = document.getElementById("username");
  if (username) {
    username.textContent = displayName;
  } else {
    console.error("Username element not found");
  }

  const uidElement = document.getElementById("uid");
  if (uidElement) {
    uidElement.textContent = uid;
  } else {
    console.error("UID element not found");
  }
});
