import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { 
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
  authDomain: "a-do-ff29e.firebaseapp.com",
  databaseURL: "https://a-do-ff29e-default-rtdb.firebaseio.com",
  projectId: "a-do-ff29e",
  storageBucket: "a-do-ff29e.appspot.com",
  messagingSenderId: "488739423620",
  appId: "1:488739423620:web:9bdc3605a45a3714b249d1"
};

// Import memberNames list
import { memberNames } from './add.js';

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const teamColRef = collection(db, 'teams');

//Save team
const saveTeam = document.querySelector("#saveTeam");
saveTeam.addEventListener("click", (e) => {
  e.preventDefault()

  const teamName = document.querySelector("#teamName").value;
  console.log("Edi wow", teamName, memberNames)
  
  addDoc(teamColRef, {
    teamName: teamName,
    teamMembers: memberNames
  })
  .then(() => {
    console.log(teamName, memberNames);
  })
});

