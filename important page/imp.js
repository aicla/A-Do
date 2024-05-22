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
      const tasksArray = Object.entries(data).map(([id, task]) => ({ id, ...task }));
      // Log all the important tasks and their IDs
      console.log("Important tasks:");
      tasksArray.forEach((task) => {
        console.log("Task ID:", task.id);
        console.log("Task:", task);
      });
      // Display the important tasks on the page
      displayImportantTasks(tasksArray);
    } else {
      console.log("No important tasks found.");
    }
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

    // Log the task ID
    console.log("Task ID:", task.id);

    // Populate task data into the HTML elements
    taskElement.innerHTML = `
    <!-- Your task content here -->
    <div class="star-button">
      <a class="important_button" id="kid_star_button_1">
        <span class="material-symbols-outlined" id="kid_star_icon_1">
          <style>
            #kid_star_button {
              font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
            }
            .filled {
              font-variation-settings: "FILL" 1;
            }
          </style>
          kid_star
        </span>
      </a>
    </div>
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

    // Set input fields as readOnly
    const inputFields = taskElement.querySelectorAll('input[type="text"]');
    inputFields.forEach((input) => {
      input.readOnly = true;
    });

    // Attach taskId to the taskElement for reference when deleting
    taskElement.dataset.taskId = task.id;
    console.log("Task ID attached to task element:", taskElement.dataset.taskId);


    // Attach deleteItem() function to the delete button
    const deleteButton = taskElement.querySelector(".trash-icon");
    deleteButton.addEventListener("click", () => deleteItem(taskElement.dataset.taskId));

    
    // Prepend the task element to the container
    importantTasksContainer.prepend(taskElement);
  });
}

function deleteItem(taskId) {
  console.log("Deleting task with ID:", taskId);

  const userId = auth.currentUser.uid;
  if (!userId) {
    console.error("User not authenticated.");
    return;
  }

  const userTasksRef = ref(db, "users/" + userId + "/important_tasks/" + taskId);

  remove(userTasksRef)
    .then(() => {
      console.log("Task deleted successfully from the database.");

      // Remove the task box from the UI
      const taskElement = document.querySelector(`.box[data-task-id="${taskId}"]`);
      if (taskElement) {
        taskElement.remove();

        // Ensure task box order update only after the task element is removed from the DOM
        updateTaskBoxOrder();
      } else {
        console.error("Task element not found in the UI.");
      }
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
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