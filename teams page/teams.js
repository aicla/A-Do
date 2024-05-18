import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { 
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
  authDomain: "a-do-ff29e.firebaseapp.com",
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
const db = getFirestore(app);
const teamColRef = collection(db, 'teams');
const teamDocRef = doc(teamColRef);

document.addEventListener("DOMContentLoaded", function () {
    const saveTeam = document.querySelector("#saveTeam");
    saveTeam.addEventListener("click", function () {
        // Get team name and members
        const teamName = document.querySelector("#teamName").value;
        console.log(teamName, memberNames);

        // Save Team to db


        // Redirect to teams_b.html after saving the names
        window.location.href = "teams_b.html";
    })
});

