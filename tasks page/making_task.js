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
  get,
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

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
        const isImportant = document
          .getElementById("kid_star_icon")
          .classList.contains("filled");
        saveTask(user.uid, isImportant);
      } else {
        // User is not logged in, handle accordingly
        console.error("User is not logged in.");
      }
    });
  } else {
    console.error("Save button not found");
  }

  console.log("DOM content loaded");
  const assignedToOptions = document.querySelectorAll(".clickable-text");
  console.log("Clickable text elements:", assignedToOptions);

  assignedToOptions.forEach((option) => {
    option.addEventListener("click", () => {
      console.log("Click event triggered");
      const selectedAssignedTo = option.getAttribute("data-value");
      console.log("Selected assigned to:", selectedAssignedTo);

      const assignedToInput = document.querySelector(".assigned-to-input");
      if (assignedToInput) {
        assignedToInput.value = selectedAssignedTo;
      } else {
        console.error("Assigned to input element not found.");
      }
    });
  });
});

// Function to load tasks
function loadTasks(userId) {}

// Function to save task
function saveTask(userId, isImportant) {
  // Retrieve input values
  const title = document.querySelector(".title-input").value;
  const date = document.querySelector(".date-input").value;
  const time = document.querySelector(".time-input").value;
  const chosen = document.querySelector(".chosen").textContent; // get the selected subject
  const assignedToInput = document.querySelector(".assigned-to-input");
  if (!assignedToInput) {
      console.error("Assigned-to input element not found.");
      return;
  }

  const assignedTo = assignedToInput ? assignedToInput.value : "";
  const notes = document.querySelector(".notes-input").value;

  if (!title || !date || !time || !chosen || !notes) {
      showToast("Please fill in all required fields.", true); // Red toast for error
      return; // Exit the function early if any field is empty
  }

  // Construct task object
  const task = {
      title: title,
      date: date,
      time: time,
      chosen: chosen,
      assignedTo: assignedTo,
      notes: notes,
  };

  // Save task object to Firebase database under the user's ID
  const userTasksRef = ref(db, "users/" + userId + (isImportant ? "/important_tasks/" : "/tasks/")); // Determine the path based on importance
  const newTaskRef = push(userTasksRef); // Create a new child location with a unique key
  set(newTaskRef, task)
      .then(() => {
          showToast("Task saved successfully!", false); // Green toast for success
          if (isImportant) {
              console.log("Task saved as important task successfully!");
          }
      })
      .catch((error) => {
          showToast("Error saving task: " + error, true); // Red toast for error
      });
}



// Function to display toast message
function showToast(message, isError) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  if (isError) {
    toast.classList.add("toast-danger");
  } else {
    toast.classList.add("toast-success");
  }
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000); // Remove toast after 3 seconds
}
