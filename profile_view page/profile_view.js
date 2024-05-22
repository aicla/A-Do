import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
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
  auth.onAuthStateChanged((user) => {
    if (user) {
      loadTasks(user.uid);
    } else {
      console.error("No user is currently signed in.");
    }
  });

  const uid = localStorage.getItem("uid");
  const photoURL = localStorage.getItem("photoURL");
  const displayName = localStorage.getItem("displayName");

  const pfp = document.getElementById("pfp");
  if (pfp) {
    pfp.innerHTML = "";
    const img = document.createElement("img");
    img.src = photoURL;
    img.alt = "Profile Picture";
    img.style.width = "120px";
    img.style.height = "120px";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";
    pfp.appendChild(img);
  } else {
    console.error("Profile picture element not found");
  }

  const username = document.getElementById("username");
  if (username) {
    username.textContent = displayName;
  } else {
    console.error("Username element not found");
  }

  const uidElement = document.getElementById("uid");
  if (uidElement) {
    uidElement.textContent = uid;
  } else {
    console.error("UID element not found");
  }
});

function loadTasks(userId) {
  console.log("Loading tasks for user:", userId);
  const userTasksRef = ref(db, "users/" + userId + "/tasks/");
  get(userTasksRef).then((snapshot) => {
    if (snapshot.exists()) {
      const tasksObject = snapshot.val();
      const tasks = Object.keys(tasksObject).map((taskId) => ({
        id: taskId,
        ...tasksObject[taskId],
      }));
      console.log("Tasks data:", tasks);

      // Sort tasks by assignedTo value
      const sortedTasks = Object.values(tasks).sort((a, b) => {
        const assignedToA = a.assignedTo.trim().toLowerCase();
        const assignedToB = b.assignedTo.trim().toLowerCase();
        if (assignedToA < assignedToB) return -1;
        if (assignedToA > assignedToB) return 1;
        return 0;
      });
      console.log("Sorted tasks:", sortedTasks);

      // Count the number of tasks in each category
      const taskCounts = { todo: 0, inProgress: 0 };
      sortedTasks.forEach((task) => {
        if (task.assignedTo === "TO-DO") taskCounts.todo++;
        if (
          task.assignedTo === "in-progress" ||
          task.assignedTo === "IN-PROGRESS"
        )
          taskCounts.inProgress++;
      });

      console.log("Task counts:", taskCounts);

      // Create the chart
      createChart(taskCounts);
    }
  });
}

function createChart(taskCounts) {
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["To-Do", "In-Progress"],
      datasets: [
        {
          label: "Task Status",
          data: [taskCounts.todo, taskCounts.inProgress],
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: false,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
        },
      },
    },
  });
}
