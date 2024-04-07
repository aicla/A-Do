import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import firebaseConfig from "../home page/homepage.js";
import logoutButton from "../home page/homepage.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

function toggleMenu() {
  var menu = document.getElementById("menu");
  menu.classList.toggle("show");
}
