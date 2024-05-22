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
  const displayName = localStorage.getItem("displayName");
  const msgBtn = document.getElementById("msgBtn");
  const messageContent = document.querySelector(".message-2 #message-content");
  const messagePreview1 = document.querySelector(".message-preview-1");
  const messagePreview2 = document.querySelector(".message-preview-2");
  const rightBox1 = document.querySelector(".right-box-1");
  const rightBox2 = document.querySelector(".right-box-2");
  const message2 = document.querySelector(".message-2");

  // Initially hide message-2
  if (message2) {
    message2.classList.add("hidden");
  }

  // Function to show rightBox1 and hide rightBox2
  function showMessagePreview1() {
    rightBox1.style.display = "block";
    rightBox2.style.display = "none";
  }

  // Function to show rightBox2 and hide rightBox1
  function showMessagePreview2() {
    rightBox1.style.display = "none";
    rightBox2.style.display = "block";
  }

  // Initially show rightBox1 and hide rightBox2
  showMessagePreview1();

  // Event listener for messagePreview1
  messagePreview1.addEventListener("click", function () {
    showMessagePreview1();
  });

  // Event listener for messagePreview2
  messagePreview2.addEventListener("click", function () {
    showMessagePreview2();
  });

  // Function to apply flex and space-between styles to user-info
  function applyFlexStyles() {
    const userInfo = document.querySelector(".message-2 .user-info");
    if (userInfo) {
      userInfo.style.display = "flex";
      userInfo.style.justifyContent = "space-between";
    }
  }

  if (msgBtn && messageContent) {
    msgBtn.addEventListener("click", function () {
      const msgTxt = document.getElementById("msgTxt").value;
      messageContent.textContent = msgTxt;
      message2.classList.remove("hidden");
      message2.classList.add("visible"); // Show message-2 when the message is sent
      applyFlexStyles(); // Reapply flex styles after updating message content
    });
  } else {
    console.error("Message button, message content, or message time element not found");
  }

  // Apply flex styles when the page loads
  applyFlexStyles();

  const usernames = document.querySelectorAll(".message-2 #username, .message-3 #username, .message-4 #username");
  usernames.forEach((username) => {
    username.textContent = displayName;
  });
});