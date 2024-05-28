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
  update,
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
    saveButton.addEventListener("click", async () => {
      const user = auth.currentUser;
      if (user) {
        // User is logged in, proceed to save or update task
        const isImportant = document
          .getElementById("kid_star_icon")
          .classList.contains("filled");

        const urlParams = new URLSearchParams(window.location.search);
        const taskId = urlParams.get("taskId");
        if (taskId) {
          // If taskId is present, update the existing task
          await updateTask(user.uid, taskId, isImportant);
        } else {
          // If taskId is not present, create a new task
          const newTaskId = saveTask(user.uid, isImportant);
          window.location.href = `../tasks page/task.html?taskId=${newTaskId}`;
          saveTask(user.uid, isImportant);
        }
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
function loadTasks(userId) {
  // Your logic to load tasks
}

// Function to save a new task
function saveTask(userId, isImportant) {
  // Retrieve input values
  const title = document.querySelector(".title-input").value;
  const date = document.querySelector(".date-input").value;
  const time = document.querySelector(".time-input").value;
  const chosen = document.querySelector(".chosen").textContent;
  const assignedToInput = document.querySelector(".assigned-to-input");
  const notes = document.querySelector(".notes-input").value;

  if (!title || !date || !time || !chosen || !notes || !assignedToInput.value) {
    showToast("Please fill in all required fields.", true); // Red toast for error
    return;
  }

  // Construct task object
  const task = {
    title,
    date,
    time,
    chosen,
    assignedTo: assignedToInput.value,
    notes,
    createdAt: new Date().getTime(),
  };

  // Save task object to Firebase database under the user's ID
  const userTasksRef = ref(
    db,
    `users/${userId}${isImportant ? "/important_tasks/" : "/tasks/"}`
  );
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

// Function to update an existing task
async function updateTask(userId, taskId, isImportant) {
  // Retrieve input values
  const title = document.querySelector(".title-input").value;
  const date = document.querySelector(".date-input").value;
  const time = document.querySelector(".time-input").value;
  const chosen = document.querySelector(".chosen").textContent;
  const assignedToInput = document.querySelector(".assigned-to-input");
  const notes = document.querySelector(".notes-input").value;

  if (!title || !date || !time || !chosen || !notes || !assignedToInput.value) {
    showToast("Please fill in all required fields.", true); // Red toast for error
    return;
  }

  // Construct task object
  const task = {
    title,
    date,
    time,
    chosen,
    assignedTo: assignedToInput.value,
    notes,
    updatedAt: new Date().getTime(),
  };

  try {
    const taskRef = ref(db, `users/${userId}/tasks/${taskId}`);
    await update(taskRef, task);
    showToast("Task updated successfully!", false); // Green toast for success
    console.log("Task updated successfully");
  } catch (error) {
    showToast("Error updating task: " + error, true); // Red toast for error
    console.error("Error updating task:", error);
  }
}

// Function to display toast message
function showToast(message, isError) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.classList.add(isError ? "toast-danger" : "toast-success");
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000); // Remove toast after 3 seconds
}

// Populate form fields when editing a task
document.addEventListener("DOMContentLoaded", (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("taskId");
  const taskTitle = urlParams.get("taskTitle");
  const taskNotes = urlParams.get("taskNotes");
  const taskDate = urlParams.get("taskDate");
  const taskAssignedTo = urlParams.get("taskAssignedTo");

  console.log("taskId: ", taskId);

  const titleInput = document.getElementById("taskTitle");
  const notesInput = document.getElementById("taskNotes");
  const dateInput = document.getElementById("taskDate");
  const assignedToInput = document.getElementById("taskAssignedTo");

  // Populate input fields with task details
  titleInput.value = taskTitle || "";
  notesInput.value = taskNotes || "";
  dateInput.value = taskDate || "";
  assignedToInput.value = taskAssignedTo || "";

  const saveButton = document.getElementById("saveButton");
  saveButton.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const notes = notesInput.value.trim();
    const date = dateInput.value.trim();
    const assignedTo = assignedToInput.value.trim();

    if (taskId) {
      // If taskId is present, update the existing task
      try {
        console.log("Updating task with ID: ", taskId);
        const userId = getCurrentUserId();
        const taskRef = ref(db, `users/${userId}/tasks/${taskId}`);
        await update(taskRef, { title, notes, date, assignedTo });
        console.log("Task updated successfully");
        // Redirect to task.html after updating the task
        // window.location.href = '../tasks page/task.html';
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      // If taskId is not present and user is not signed in, show error toast
      // showToast('User not signed in. Please sign in to create a new task.', true);
    }
  });
});

// Define getCurrentUserId function
function getCurrentUserId() {
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    console.log("No user signed in.");
    throw new Error("No user signed in.");
  }
}
