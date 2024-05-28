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

// Import memberNames list
import { memberNames } from './add.js';

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


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('teamContainer').innerHTML = ""; // Clear existing teams
  
  // Function to display a team
  function displayTeam(teamData, teamKey) {
    if (!teamData) {
      console.error("Team data is undefined for team key:", teamKey);
      return; // Exit the function if no data
    }

    const teamTemplate = document.getElementById('teamTemplate');
    const newTeam = teamTemplate.content.cloneNode(true);
    newTeam.querySelector('.teamName').textContent = teamData.teamName;
    newTeam.querySelector('.numMembers').textContent = `${teamData.members.length} members`;
    newTeam.querySelector('.teamLink').href = `teams_b.html?teamKey=${teamKey}`;

    const deleteButton = newTeam.querySelector('.trash-icon');
    deleteButton.addEventListener('click', () => {
      const confirmed = confirm("Are you sure you want to delete this team?");
      if (confirmed) {
        deleteTeam(teamKey); // Call function to delete team from database
      }
    });

    document.getElementById('teamContainer').appendChild(newTeam);
  }

  onValue(teamRef, (snapshot) => {
    const teamData = snapshot.val();
    document.getElementById('teamContainer').innerHTML = "";

    if (teamData) {
      // Loop through each team in the data
      for (const teamKey in teamData) {
        displayTeam(teamData[teamKey], teamKey);
      }
    } else {
      console.log("No teams found in the database");
    }
  });

  // Function to delete a team from Firebase
  function deleteTeam(teamKey) {
    const teamDeleteRef = ref(db, `teams/${teamKey}`);
    remove(teamDeleteRef)
      .then(() => {
        console.log("Team deleted successfully!");
        
        onValue(teamRef, (snapshot) => {
          const teamData = snapshot.val();
          document.getElementById('teamContainer').innerHTML = "";
      
          if (teamData) {
            // Loop through each team in the data
            for (const teamKey in teamData) {
              displayTeam(teamData[teamKey], teamKey);
            }
          } else {
            console.log("No teams found in the database");
          }
        });
      })
      .catch((error) => {
        console.error("Error deleting team:", error);
      });
  }
});



// Function to add a team to the Firebase Database
function addTeam(teamName, members) {
  const newTeamKey = push(teamRef).key; // Generate a unique key for the new team

  set(ref(db, `teams/${newTeamKey}`), {
    teamName: teamName,
    members: members,
  })
  .then(() => {
    console.log("Team created successfully!");
  })
  .catch((error) => {
    console.error("Error creating team:", error);
  });
}


// Save team
const saveTeam = document.querySelector("#saveTeam");
saveTeam.addEventListener("click", (e) => {
  e.preventDefault();

  const teamName = document.querySelector("#teamName").value;

  // Get current user using onAuthStateChanged (Promise approach)
  const currentUserPromise = new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    }, (error) => {
      reject(error);
    });
  });

  currentUserPromise.then((user) => {
    if (user) {
      memberNames.push(user.displayName || user.email);
    }
    addTeam(teamName, memberNames);
  }).catch((error) => {
    console.error("Error getting current user:", error);
  });

  window.location.href = 'teams.html';
});

