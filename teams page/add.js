import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set
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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
const usersRef = ref(db, 'usernames');

// Global array to store the names of members added to the list
const memberNames = [];

document.addEventListener("DOMContentLoaded", function () {
    const suggestionBox = document.getElementById("suggestionBox");
    const memberListBox = document.getElementById("memberListBox");
    const memberInput = document.querySelector(".text-input");
    const buttonContainer = document.querySelector(".button-container");

    suggestionBox.style.display = "none";
    memberListBox.style.display = "none";

    function populateSuggestions(filteredNames) {
        suggestionBox.innerHTML = "";

        filteredNames.forEach(function (name) {
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = name;
            suggestionItem.classList.add("suggestion-item");

            suggestionItem.addEventListener("click", function () {
                if (!memberNames.includes(name)) {
                    memberNames.push(name);
                    updateMemberList();
                }
                memberInput.value = "";
                suggestionBox.style.display = "none";
            });

            suggestionBox.appendChild(suggestionItem);
        });

        const box2Rect = document.querySelector(".box2").getBoundingClientRect();
        suggestionBox.style.display = "block";
        suggestionBox.style.left = `${box2Rect.left}px`;
        suggestionBox.style.top = `${box2Rect.bottom}px`;
        suggestionBox.style.width = `${box2Rect.width}px`;
    }

    function updateMemberList() {
        memberListBox.innerHTML = "";

        memberNames.forEach(function (name) {
            const memberItem = document.createElement("div");
            memberItem.textContent = name;
            memberListBox.appendChild(memberItem);

            const line = document.createElement("div");
            line.classList.add("line");
            memberListBox.appendChild(line);
        });

        memberListBox.style.display = "block";
        adjustButtonContainerPosition();
    }

    function adjustButtonContainerPosition() {
        const box2Rect = document.querySelector(".box2").getBoundingClientRect();
        const memberListBoxHeight = memberListBox.offsetHeight;
        const buttonContainerHeight = buttonContainer.offsetHeight;

        let newTop = box2Rect.bottom + memberListBoxHeight + 20;

        const viewportHeight = window.innerHeight;
        const bottomMargin = 20;
        if (newTop + buttonContainerHeight > viewportHeight - bottomMargin) {
            newTop = viewportHeight - bottomMargin - buttonContainerHeight;
        }

        buttonContainer.style.top = `${newTop}px`;
    }

    memberInput.addEventListener("input", function () {
        const typedText = memberInput.value.trim().toLowerCase();

        if (typedText === "") {
            suggestionBox.style.display = "none";
            return;
        }

        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {
              const availableUserData = snapshot.val();
          
              // Get the current user using `onAuthStateChanged`
              onAuthStateChanged(auth, (user) => {
                if (user) {
                  const currentUsername = user.displayName || user.email; // Use display name or email
          
                  const filteredNames = [];
                  // Iterate through object properties (usernames)
                  for (const key in availableUserData) {
                    const username = availableUserData[key];
                    const typedText = memberInput.value.trim().toLowerCase(); // Get trimmed and lowercased typed text
                  
                    // Check if username (lowercase) includes the typed text (lowercase)
                    if (username.toLowerCase().includes(typedText) && username.toLowerCase() !== currentUsername.toLowerCase()) {
                      filteredNames.push(username);
                    }
                  }
                  
          
                  if (filteredNames.length > 0) {
                    populateSuggestions(filteredNames);
                  } else {
                    suggestionBox.style.display = "none";
                  }
                }
              });
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error("Error getting data:", error);
          });
          
          
          
    });
});

export { memberNames };