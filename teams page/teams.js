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
  const teamSection = document.querySelector(".team");
  console.log(teamList); // for testing
  if (Object.keys(teamList).length > 0) {
    teamSection.style.display = "block";
    renderTeams(); // Render all teams initially
  } else {
    teamSection.style.display = "none";
  }
});

// Render all teams
function renderTeams() {
  const teamSection = document.querySelector(".team");
  teamSection.innerHTML = ""; // Clear existing teams
  Object.keys(teamList).forEach(teamKey => {
    const team = teamList[teamKey];
    const teamTemplate = document.getElementById('teamTemplate');
    const newTeam = teamTemplate.content.cloneNode(true);
    newTeam.querySelector('.teamName').textContent = team.teamName;
    newTeam.querySelector('.numMembers').textContent = team.members.length;
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
  renderTeams(); // Render all teams
  console.log(teamList); // for testing
  window.location.href = 'teams.html';
});
