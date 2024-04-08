import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
  authDomain: "a-do-ff29e.firebaseapp.com",
  databaseURL: "https://a-do-ff29e-default-rtdb.firebaseio.com",
  projectId: "a-do-ff29e",
  storageBucket: "a-do-ff29e.appspot.com",
  messagingSenderId: "488739423620",
  appId: "1:488739423620:web:9bdc3605a45a3714b249d1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Sign out");
      window.location.href = "../preview page/login.html";
    })
    .catch((error) => {
      console.error("Sign-out error:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Handle authentication state changes
  auth.onAuthStateChanged((user) => {
    console.log("Current user:", user);
    if (user) {
      // User is logged in, proceed to load tasks or perform other actions
      loadTasks(user.uid);
    } else {
      // User is not logged in, handle accordingly (redirect to login page, etc.)
      console.log("User is not logged in.");
    }
  });

  const saveButton = document.getElementById("saveButton");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const user = auth.currentUser;
      if (user) {
        // User is logged in, proceed to save task
        saveTask(user.uid);
      } else {
        // User is not logged in, handle accordingly
        console.error("User is not logged in.");
      }
    });
  } else {
    console.error("Save button not found");
  }
});

// Function to load tasks
function loadTasks(userId) {
  // Implement loading tasks logic here
}

// Function to save task
function saveTask(userId) {
  // Retrieve input values
  const title = document.querySelector(".title-input").value;
  const date = document.querySelector(".date-input").value;
  const time = document.querySelector(".time-input").value;
  //const assignedTo = document.querySelector(".assigned-to-input").value;
  const notes = document.querySelector(".notes-input").value;

  // Construct task object
  const task = {
    title: title,
    date: date,
    time: time,
    //assignedTo: assignedTo,
    notes: notes,
  };

  // Save task object to Firebase database under the user's ID
  const userTasksRef = ref(db, "users/" + userId + "/tasks/"); // Get reference to the tasks node
  const newTaskRef = push(userTasksRef); // Create a new child location with a unique key
  set(newTaskRef, task) // Set the value of the new child location to the task object
    .then(() => {
      // Display toast message
      showToast("Task saved successfully!");

      // Redirect or perform any other action after saving the task
    })
    .catch((error) => {
      console.error("Error saving task:", error);
    });
}

// Function to display toast message
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000); // Remove toast after 3 seconds
}
