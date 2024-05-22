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

// Function to render teams on the page
function renderTeams() {
    const teamContainer = document.getElementById('teamContainer');
    teamContainer.innerHTML = ''; // Clear previous content
    Object.keys(teamList).forEach(teamKey => {
        const teamData = teamList[teamKey];
        const teamTemplate = document.getElementById('teamTemplate');
        const teamElement = teamTemplate.content.cloneNode(true);
        teamElement.querySelector('.teamName').textContent = teamData.teamName;
        teamElement.querySelector('.numMembers').textContent = teamData.members.length + ' members';
        teamContainer.appendChild(teamElement);
    });
}

// Initial render
renderTeams();
