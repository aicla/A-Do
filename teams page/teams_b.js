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
  set,
  onValue,
  remove,
  push
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
const teamRef = ref(db, `teams`); // Reference to the 'teams' node

document.addEventListener("DOMContentLoaded", function () {
    const membersButton = document.querySelector(".members");

    if (membersButton) {
      membersButton.addEventListener("click", function () {
        const urlParams = new URLSearchParams(window.location.search);
        const teamKey = urlParams.get('teamKey');
        if (teamKey) {
          window.location.href = `members.html?teamKey=${teamKey}`;
        } else {
          console.error("teamKey not found in URL parameters");
        }
      });
    } else {
      console.error("Members button element not found");
    }

    // Fetch team data and update the team name placeholder
    const urlParams = new URLSearchParams(window.location.search);
    const teamKey = urlParams.get('teamKey');

    if (teamKey) {
      // Fetch team data from database using teamKey
      const teamRef = ref(getDatabase(), `teams/${teamKey}`);
      get(teamRef)
        .then((snapshot) => {
          const teamData = snapshot.val();
          if (teamData) {
            document.getElementById("teamNamePlaceholder").textContent = teamData.teamName;
            window.team = teamData; // Set team data in a global variable
          } else {
            console.error("Team not found in the database for key:", teamKey);
          }
        })
        .catch((error) => {
          console.error("Error fetching team data:", error);
        });

    } else {
      console.error("teamKey not found in URL parameters");
    }

    const photoURL = localStorage.getItem("photoURL");
    const profileIcon = document.getElementById("pfp");

    if (profileIcon) {
      const img = document.createElement("img");
      img.src = photoURL;
      img.alt = "Profile Picture";
      img.style.width = "24px";
      img.style.height = "24px";
      img.style.borderRadius = "50px";
      profileIcon.appendChild(img);

      profileIcon.addEventListener("click", function () {
        window.location.href = "../profile_view page/profile_view.html";
      });
    } else {
      console.error("Profile icon element not found");
    }

    const messageIcon = document.getElementById("message");
    if (messageIcon) {
      messageIcon.addEventListener("click", function () {
        window.location.href = "../messaging/messaging.html";
      });
    } else {
      console.error("Message icon element not found");
    }
});