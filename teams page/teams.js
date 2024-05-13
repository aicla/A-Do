import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
  authDomain: "a-do-ff29e.firebaseapp.com",
  databaseURL: "https://a-do-ff29e-default-rtdb.firebaseio.com",
  projectId: "a-do-ff29e",
  storageBucket: "a-do-ff29e.appspot.com",
  messagingSenderId: "488739423620",
  appId: "1:488739423620:web:9bdc3605a45a3714b249d1",
};

// Import memberNames list
import { memberNames } from './add.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

document.addEventListener("DOMContentLoaded", function () {
    const saveTeam = document.querySelector("#saveTeam");
    saveTeam.addEventListener("click", function () {
        // Get team name and members
        const teamName = document.querySelector("#teamName").value;
        console.log(teamName, memberNames);
        // Check if memberNames[] exist on firestore db (users)
        // If memberNames[] exist, get that/those user(s), save the "teamName" and that/those user(s) in the "teams" collection in firestore
          // If memberNames[] or some of the memberNames[indexes] don't exist, remove that/those memberNames[indexes] from the list, save only those that match in db
            // Show an alert/prompt saying that/those memberNames[indexes] don't exist
          // Close and reset the add.html
          // Open teams_b.html with the created team information
    })
});

