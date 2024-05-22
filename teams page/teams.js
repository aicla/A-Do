// Import memberNames list
import { memberNames } from './add.js';

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
