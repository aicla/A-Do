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

// Logout functionality
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

// Listen for changes in the user's authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user.displayName);
    // Save user's display name to Firebase Database
    saveDisplayNameToDatabase(user.uid, user.displayName);
    // Load tasks for the signed-in user
    loadTasks(user.uid);
    loadArchiveTasks(user.uid);
    displayCurrentDate();
    // Update profile view
    displayUserName(user);
  } else {
    // No user is signed in
    console.log("No user is signed in");
    // Clear profile view
    clearProfileView();
  }
});


// Function to save user's display name to Firebase Database
function saveDisplayNameToDatabase(userId, displayName) {
  const displayNameRef = ref(db, `usernames/${userId}`);
  set(displayNameRef, displayName)
    .then(() => {
      console.log("Display name saved to database");
    })
    .catch((error) => {
      console.error("Error saving display name:", error);
    });
}


function loadTasks(userId) {
  // Retrieve tasks from Firebase database
  const userTasksRef = ref(db, "users/" + userId + "/tasks/");
  get(userTasksRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const tasks = snapshot.val();
        console.log("Regular tasks: ", tasks);
        displayRegularTasks(tasks);
        displayDueTasks(tasks, {});
      } else {
        console.log("No tasks found for this user.");
      }
    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
    });
}

function loadArchiveTasks(userId) {
  // Retrieve tasks from Firebase database
  const archiveTasksRef = ref(db, "users/" + userId + "/archiveTasks/");
  get(archiveTasksRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const tasks = snapshot.val();
        console.log("Archive Tasks: ", tasks);
        displayArchiveTasks(tasks);
        displayDueTasks({}, tasks);
      } else {
        console.log("No archive tasks found for this user.");
      }
    })
    .catch((error) => {
      console.error("Error loading archive tasks:", error);
    });
}

function displayRegularTasks(tasks) {
  const todoContainer = document.getElementById("todo");
  const inProgressContainer = document.getElementById("inprogress");

  // Clear existing tasks
  todoContainer.innerHTML = "<h2>TO DO</h2>";
  inProgressContainer.innerHTML = "<h2>IN PROGRESS</h2>";

  Object.values(tasks).forEach((task) => {
    const taskElement = document.createElement("h3");
    taskElement.textContent = task.title || ""; // Assuming each task has a 'title' property

    switch (task.assignedTo.toUpperCase()) {
      case "TO-DO":
        todoContainer.appendChild(taskElement);
        break;
      case "IN-PROGRESS":
        inProgressContainer.appendChild(taskElement);
        break;
      default:
        console.warn(`Unknown assignedTo value: ${task.assignedTo}`);
        break;
    }
  });
}

function displayArchiveTasks(tasks) {
  const archiveContainer = document.getElementById("archive");

  // Clear existing tasks
  archiveContainer.innerHTML = "<h2>ARCHIVE</h2>";

  Object.values(tasks).forEach((task) => {
    const taskElement = document.createElement("h3");
    taskElement.textContent = task.title || ""; // Assuming each task has a 'title' property

    archiveContainer.appendChild(taskElement);
  });
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Adjust format if needed
}

function displayDueTasks(regularTasks, archiveTasks) {
  const dueContainer = document.querySelector(".due");
  const dueHeader = dueContainer.querySelector(".due_header");
  const dueDate = dueContainer.querySelector("#currentDate");

  // Clear existing due tasks
  dueHeader.nextSibling?.remove();
  dueDate.nextSibling?.remove();

  const currentDate = getCurrentDate();
  let tasksDueToday = false;

  // Combine regular and archive tasks into a single array
  const allTasks = [];

  // Add regular tasks to allTasks array
  Object.values(regularTasks).forEach((task) => {
    allTasks.push(task);
  });

  // Add archive tasks to allTasks array
  Object.values(archiveTasks).forEach((task) => {
    allTasks.push(task);
  });

  console.log("All Tasks:", allTasks); // Log all tasks

  allTasks.forEach((task) => {
    if (task.date === currentDate) {
      const taskElement = document.createElement("h3");
      taskElement.textContent = task.title || ""; // Assuming each task has a 'title' property
      dueContainer.appendChild(taskElement);
      tasksDueToday = true;
    }
  });

  /*if (!tasksDueToday) {
    const noTasksElement = document.createElement("h3");
    noTasksElement.textContent = "No tasks due today.";
    dueContainer.appendChild(noTasksElement);
  }*/
}

function displayCurrentDate() {
  const currentDateElement = document.getElementById("currentDate");
  currentDateElement.textContent = getCurrentDate();
}
