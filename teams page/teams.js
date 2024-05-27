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

let teamList = JSON.parse(localStorage.getItem('teamList')) || {};
let teamKey = Object.keys(teamList).length;

// Function to add a team to the teamList
function addTeam(teamKey, teamName, members) {
  teamList[teamKey] = {
    teamName: teamName,
    members: members
  };
  // Save teamList to local storage
  localStorage.setItem('teamList', JSON.stringify(teamList));
}

// Function to delete a team from the teamList
function deleteTeam(key) {
  // Delete the team from the teamList
  delete teamList[key];

  // Reassign the keys of the remaining teams
  const updatedTeamList = {};
  let newKey = 1;

  for (const oldKey in teamList) {
    if (teamList.hasOwnProperty(oldKey)) {
      updatedTeamList[newKey] = teamList[oldKey];
      newKey++;
    }
  }

  teamList = updatedTeamList;
  teamKey = Object.keys(teamList).length;

  // Save the updated teamList to local storage
  localStorage.setItem('teamList', JSON.stringify(teamList));

  // Re-render teams
  renderTeams();
}

document.addEventListener("DOMContentLoaded", function () {
  if (Object.keys(teamList).length > 0) {
    renderTeams(); // Render all teams initially
  } else {
    const teamSection = document.getElementById("teamContainer");
    teamSection.style.display = "none";
  }
});

// Render all teams
function renderTeams() {
  const teamSection = document.getElementById("teamContainer");
  teamSection.innerHTML = ""; // Clear existing teams
  Object.keys(teamList).forEach(teamKey => {
    const team = teamList[teamKey];
    const teamTemplate = document.getElementById('teamTemplate');
    const newTeam = teamTemplate.content.cloneNode(true);
    newTeam.querySelector('.teamName').textContent = team.teamName;
    newTeam.querySelector('.numMembers').textContent = `${team.members.length} members`;

    // Update the link with the teamKey
    newTeam.querySelector('.teamLink').href = `teams_b.html?teamKey=${teamKey}`;

    // Add event listener for delete button
    const deleteButton = newTeam.querySelector('.trash-icon');
    deleteButton.addEventListener('click', () => {
      const confirmed = confirm("Are you sure you want to delete this team?");
      if (confirmed) {
        deleteTeam(teamKey);
      }
    });

    teamSection.appendChild(newTeam);
  });
}

// Save team
const saveTeam = document.querySelector("#saveTeam");
saveTeam.addEventListener("click", (e) => {
  e.preventDefault();

  const teamName = document.querySelector("#teamName").value;
  teamKey += 1;
  addTeam(teamKey, teamName, memberNames);
  window.location.href = 'teams.html';
});