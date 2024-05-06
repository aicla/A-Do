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
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import "https://code.jquery.com/ui/1.12.1/jquery-ui.js";

// Cloud Functions to handle user creation and email updates.
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.updateUserEmails = functions.auth.user().onCreate((user) => {
  const { uid, email } = user;
  return admin.database().ref(`userEmails/${uid}`).set(email);
});

exports.updateUserEmailsOnEmailUpdate = functions.auth.user().onUpdate((change) => {
  const { uid, email } = change.after;
  return admin.database().ref(`userEmails/${uid}`).set(email);
});


document.addEventListener("DOMContentLoaded", function () {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
    authDomain: "a-do-ff29e.firebaseapp.com",
    databaseURL: "https://a-do-ff29e-default-rtdb.firebaseio.com",
    projectId: "a-do-ff29e",
    storageBucket: "a-do-ff29e.appspot.com",
    messagingSenderId: "488739423620",
    appId: "1:488739423620:web:9bdc3605a45a3714b249d1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase();

  // Initialize jQuery UI Autocomplete
  function initAutocomplete(availableMembers) {
      $("#teamMembers").autocomplete({
          source: availableMembers,
          select: function(event, ui) {
              const selectedEmail = ui.item.value;
              addMember(selectedEmail);
              // Clear input after selecting an email
              $(this).val('');
              return false; // Prevent the input field from being populated with the selected value
          }
      });
  }

  // Retrieve available members from Firebase
  function getAvailableMembers() {
      const membersRef = ref(db, "members");

      once(membersRef, "value", (snapshot) => {
          const members = snapshot.val();
          if (members) {
              const availableMembers = Object.keys(members); // Assuming email addresses are stored as keys
              initAutocomplete(availableMembers);
          }
      });
  }

  // Call the function to retrieve available members when the page loads
  getAvailableMembers();

  const saveButton = document.getElementById("saveTeam");
if (saveButton) {
    saveButton.addEventListener("click", () => {
        const user = auth.currentUser;
        if (user) {
            // Check if teamName is not empty
            const teamName = document.querySelector("#teamName").value.trim();
            if (teamName === "") {
                // Display an alert to the user for empty team name
                alert("Please enter a team name.");
                return; // Exit the function early
            }

            // Check if teamMembers is not empty
            const teamMembers = document.querySelector("#teamMembers").value.trim();
            if (teamMembers === "") {
                // Display an alert to the user for empty team members
                alert("Please enter team members.");
                return; // Exit the function early
            }

            // User is logged in and input data is valid, proceed to save team
            saveTeam(user.uid);
        } else {
            // User is not logged in, handle accordingly
            console.error("User is not logged in.");
        }
    });
} else {
    console.error("Save button not found");
}

});

// Function to save team
function saveTeam(userId) {
  // Retrieve input values
  const teamName = document.querySelector("#teamName").value;
  const members = document.querySelector("#teamMembers").value;
  // Construct team object
  const team = {
      teamName: teamName,
      members: members
  };

  // Save team object to Firebase database under the user's ID
  const userTeamsRef = ref(db, "users/" + userId + "/teams/"); // Get reference to the teams node
  const newTeamRef = push(userTeamsRef); // Create a new child location with a unique key
  set(newTeamRef, team) // Set the value of the new child location to the team object
      .then(() => {
          // Display toast message
          showToast("Team saved successfully!");

          // Redirect to another page after saving the team
          window.location.href = "teams_b.html";
      })
      .catch((error) => {
          console.error("Error saving team:", error);
      });
}
