/*import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("User is signed out");
  } else {
    console.log("User is signed in");
  }
});
*/
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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("User is signed out");
    window.location.href = "../preview page/login.html"; // Redirect to login if not signed in
  } else {
    console.log("User is signed in");
    loadTasks(user.uid);
  }
});
function loadTasks(userId) {
  // Retrieve tasks from Firebase database
  const userTasksRef = ref(db, "users/" + userId + "/tasks/");
  get(userTasksRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const tasks = snapshot.val();
        displayTasks(tasks);
      } else {
        console.log("No tasks found for this user.");
      }
    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
    });
}

function addToDoTask(task) {
  const todoContainer = document.getElementById("todo");
  const taskElement = document.createElement("div");
  taskElement.textContent = task.title;
  todoContainer.appendChild(taskElement);
}

function addInProgressTask(task) {
  const inProgressContainer = document.getElementById("inprogress");
  const taskElement = document.createElement("div");
  taskElement.textContent = task.title;
  inProgressContainer.appendChild(taskElement);
}

function displayTasks(tasks) {
  const todoContainer = document.getElementById("todo");
  const inProgressContainer = document.getElementById("inprogress");
  const finishedContainer = document.getElementById("finished");

  // Clear existing tasks
  todoContainer.innerHTML = "<h2>TO DO</h2>";
  inProgressContainer.innerHTML = "<h2>IN PROGRESS</h2>";
  finishedContainer.innerHTML = "<h2>FINISHED</h2>";

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
      case "FINISHED":
        finishedContainer.appendChild(taskElement);
        break;
      default:
        console.warn(`Unknown assignedTo value: ${task.assignedTo}`);
        break;
    }
  });
}

