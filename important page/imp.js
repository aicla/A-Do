import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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
const db = getDatabase(app);

// Function to fetch important tasks data from Firebase
function fetchImportantTasks(userId) {
  const importantTasksRef = ref(db, "users/" + userId + "/important_tasks/");
  onValue(importantTasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Convert the object of tasks into an array
      const tasksArray = Object.values(data);
      // Display the important tasks on the page
      displayImportantTasks(tasksArray);
    } else {
      console.log("No important tasks found.");
    }
  });
}

function deleteItem(event) {
  // Get the parent box element of the delete button that was clicked
  const box = event.target.closest(".box");
  if (!box) {
    console.error("Box not found.");
    return;
  }

  // Get the unique ID of the task associated with this box
  const taskId = box.dataset.taskId;

  // Remove the box from the DOM
  box.remove();

  const userId = auth.currentUser.uid; // Get the current user's ID
  // Remove the corresponding task data from the database
  const userTasksRef = ref(db, "users/" + userId + "/important_tasks/" + taskId); // Reference to the task in the database
  remove(userTasksRef)
    .then(() => {
      console.log("Task deleted successfully from the database.");

      // Update the order of the remaining task boxes
      updateTaskBoxOrder();
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
}


// Function to update the order of task boxes
function updateTaskBoxOrder() {
  // Get all remaining task boxes
  const taskBoxes = document.querySelectorAll(".box");
  
  // Check if any task boxes are found
  if (taskBoxes.length === 0) {
    console.log("No task boxes found.");
    return; // Exit the function if no task boxes are found
  }

  // Update the dataset index for each box
  taskBoxes.forEach((box, index) => {
    box.dataset.index = index;
  });

  // Reorder the task boxes based on their dataset index
  const sortedTaskBoxes = Array.from(taskBoxes).sort((a, b) => a.dataset.index - b.dataset.index);
  const importantTasksContainer = document.getElementById("importantTasksContainer");
  importantTasksContainer.innerHTML = "";
  sortedTaskBoxes.forEach((box) => {
    importantTasksContainer.appendChild(box);
  });
}

// Function to display important tasks
function displayImportantTasks(tasks) {
  const importantTasksContainer = document.getElementById("importantTasksContainer");
  // Clear existing tasks
  importantTasksContainer.innerHTML = "";

  // Iterate over the tasks and create HTML elements for each task
  tasks.forEach((task, index) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("box");
    taskElement.dataset.index = index; // Set dataset index for reordering
    if (!task) {
      return; // Skip this iteration if the task is null or undefined
    }


    // Populate task data into the HTML elements
    taskElement.innerHTML = `
    <!-- Your task content here -->
    <div class="picture-placeholder"></div>
    <div class="text-placeholder top-left">
      <input type="text" class="text-input" value="${task.groupNumber}" />
    </div>
    <div class="text-placeholder top-right">
      <input type="text" class="text-input" value="${task.date}" />
    </div>
    <div class="trash-icon">
      <i class="fas fa-trash"></i>
    </div>
    <div class="text-placeholder bottom-left">
      <input type="text" class="text-input" value="${task.chosen}" />
    </div>
    <div class="text-placeholder bottom-right">
      <input type="text" class="text-input" value="${task.title}" />
    </div>
    `;

    // Attach taskId to the taskElement for reference when deleting
    taskElement.dataset.taskId = task.id;

    // Prepend the task element to the container
    importantTasksContainer.prepend(taskElement);

    // Attach deleteItem() function to the delete button
    const deleteButton = taskElement.querySelector(".trash-icon");
    deleteButton.addEventListener("click", deleteItem);
  });
}

// Monitor authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    fetchImportantTasks(user.uid);
  } else {
    // No user is signed in.
    console.log("No user signed in.");
  }
});

function toggleMenu() {
  var menu = document.getElementById("menu");
  menu.classList.toggle("show");
}
