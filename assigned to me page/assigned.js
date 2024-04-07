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

function toggleOptions(optionClass) {
  var options = document.querySelector("." + optionClass);

  var isActive = options.classList.contains("active");

  var allOptions = document.querySelectorAll(".v-options");
  allOptions.forEach(function (option) {
    if (option !== options) {
      option.classList.remove("active");
    }
  });

  if (!isActive) {
    options.classList.add("active");
  } else {
    options.classList.remove("active");
  }
}

function selectOption(option) {
  var selectedOption = document.querySelector(".selected-option");
  selectedOption.textContent = option;
  toggleOptions("v-options");
}
