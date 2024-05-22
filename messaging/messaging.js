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
  const messageContent2 = document.querySelector(".message-2 #message-content");
  const messageContent3 = document.querySelector(".message-3 #message-content");
  const messagePreview1 = document.querySelector(".message-preview-1");
  const messagePreview2 = document.querySelector(".message-preview-2");
  const rightBox1 = document.querySelector(".right-box-1");
  const rightBox2 = document.querySelector(".right-box-2");
  const message2 = document.querySelector(".message-2");
  const message3 = document.querySelector(".message-3");
  const searchForm = document.getElementById("search-form");
  const searchBar = document.getElementById("search-bar");

  // Initially hide message-2 and message-3
  if (message2) {
      message2.classList.add("hidden");
  }
  if (message3) {
      message3.classList.add("hidden");
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
      const userInfos = document.querySelectorAll(".message-2 .user-info, .message-3 .user-info");
      userInfos.forEach(userInfo => {
          if (userInfo) {
              userInfo.style.display = "flex";
              userInfo.style.justifyContent = "space-between";
          }
      });
  }

  if (msgBtn && messageContent2 && messageContent3) {
    msgBtn.addEventListener("click", function () {
        const msgTxt = document.getElementById("msgTxt");
        const inputValue = msgTxt.value; // Store the current value before clearing
        if (message2.classList.contains("hidden")) {
            messageContent2.textContent = inputValue;
            message2.classList.remove("hidden");
            message2.classList.add("visible");
        } else if (message3.classList.contains("hidden")) {
            messageContent3.textContent = inputValue;
            message3.classList.remove("hidden");
            message3.classList.add("visible");
        }
        applyFlexStyles(); // Reapply flex styles after updating message content

        // Clear the msgTxt input field after processing
        msgTxt.value = "";
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

  // Search functionality
  searchBar.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
          event.preventDefault();
          const searchTerm = searchBar.value.toLowerCase();
          const messagePreviews = document.querySelectorAll(".left-box a");

          messagePreviews.forEach(preview => {
              const h2Text = preview.querySelector("h2").textContent.toLowerCase();
              if (h2Text.includes(searchTerm)) {
                  preview.style.display = "block";
              } else {
                  preview.style.display = "none";
              }
          });
      }
  });
});

