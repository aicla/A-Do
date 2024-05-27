import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Global array to store the names of members added to the list
let memberNames = [];

// List of available users to suggest from
const availableUsersRef = ref(db, 'usernames');

// Retrieve member names from Firebase and update memberNames array
onValue(availableUsersRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    memberNames = Object.values(data);
  }
});

// Event listener to execute when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Your existing code...
});

// Event listener for save button click
document.querySelector("#saveTeam").addEventListener("click", (e) => {
    e.preventDefault();
    const teamName = document.querySelector("#teamName").value;
    const selectedMembers = document.querySelector(".text-input").value;
    const membersArray = selectedMembers.split(",").map(member => member.trim());
    saveTeamToFirebase(teamName, membersArray);
    // Optionally, you can also save the team to local storage if needed
  });
  
  // Function to save the team to Firebase
  function saveTeamToFirebase(teamName, members) {
    const newTeamRef = push(ref(db, 'teams'));
    set(newTeamRef, {
      teamName: teamName,
      members: members
    });
  }
  
