import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  remove,
  push,
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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function loadTasks(userId) {
  console.log("Loading tasks for user:", userId);
  const userTasksRef = ref(db, "users/" + userId + "/tasks/");
  get(userTasksRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const tasksObject = snapshot.val();
        const tasks = Object.keys(tasksObject).map((taskId) => ({
          id: taskId,
          ...tasksObject[taskId],
        }));
        console.log("Tasks data:", tasks);
        const sortedTasks = tasks.sort((a, b) => {
          const assignedToA = a.assignedTo.trim().toLowerCase();
          const assignedToB = b.assignedTo.trim().toLowerCase();
          if (assignedToA < assignedToB) return -1;
          if (assignedToA > assignedToB) return 1;
          return 0;
        });
        console.log("Sorted tasks:", sortedTasks);

        sortedTasks.forEach((task) => {
          console.log("Task ID:", task.id);
        });

        sortedTasks.forEach((task) => {
          console.log("Chosen value:", task.title);
          switch (task.assignedTo.toLowerCase()) {
            case "to-do":
              displayTask(userId, task, "todo-section");
              break;
            case "in-progress":
              displayTask(userId, task, "in-progress-section");
              break;
            case "finished":
              displayTask(userId, task, "finished-section");
              break;
            case "archive":
              displayTask(userId, task, "archive-section");
              break;
            default:
              console.error(`Invalid task status: ${task.assignedTo}`);
              break;
          }
        });
      } else {
        console.log("No tasks found for this user.");
        clearEmptySections();
      }
    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
    });
}

function clearEmptySections() {
  const sections = ["todo-section", "in-progress-section", "finished-section"];
  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const firstInnerBox = section.closest(".inner-box");
      if (firstInnerBox) {
        firstInnerBox.remove();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadTasks(user.uid);
    } else {
      console.error("No user is currently signed in.");
    }
  });

  const tasks = document.querySelectorAll(".inner-box");
  tasks.forEach((task) => {
    task.addEventListener("click", function (event) {
      if (
        !event.target.classList.contains("dropdown") &&
        !event.target.closest(".dropdown")
      ) {
        showModal(task);
      }
    });
  });

  const editTaskBtn = document.getElementById("editTaskBtn");
  editTaskBtn.addEventListener("click", async function () {
    console.log("Edit task clicked");
  });

  const deleteTaskBtn = document.getElementById("deleteTaskBtn");
  deleteTaskBtn.addEventListener("click", function () {
    const taskId = getSelectedTaskId();
    if (taskId) {
      handleDelete(taskId);
    } else {
      console.error("No task selected for deletion.");
    }
  });
});

function displayTask(userId, task, sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    if (task && task.title) {
      const taskElement = document.createElement("div");
      taskElement.classList.add("inner-box");
      taskElement.id = `task_${task.id}`;

      const starButton = document.createElement("div");
      starButton.classList.add("star-button");
      starButton.innerHTML = `
        <a class="important_button" id="kid_star_button_${task.id}">
          <span class="material-symbols-outlined" id="kid_star_icon_${task.id}">
            <style>
              #kid_star_button_${task.id} {
                font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
              }
              .filled {
                font-variation-settings: "FILL" 1;
              }
            </style>
            kid_star
          </span>
        </a>
      `;

      const nameBar = document.createElement("div");
      nameBar.classList.add("name-bar");
      nameBar.innerHTML = `<span class="title-input">${task.title}</span>`;

      const caret = document.createElement("div");
      caret.classList.add("caret");

      const dropdown = document.createElement("ul");
      dropdown.classList.add("dropdown");
      dropdown.innerHTML = `
                <li class="chosen">${task.assignedTo}</li>
                <li>TO-DO</li>
                <li>IN-PROGRESS</li>
                <li>FINISHED</li>
                <li>ARCHIVE</li>
            `;

      const dropdownOptions = getDropdownOptions(task.assignedTo);
      dropdown.innerHTML = dropdownOptions;

      task.dropdown = dropdown;
      // Append dropdown to taskElement
      taskElement.appendChild(dropdown);

      taskElement.appendChild(starButton);
      taskElement.appendChild(nameBar);
      taskElement.appendChild(caret);
      taskElement.appendChild(dropdown);

      const parentBox = section.closest(".box");
      if (parentBox) {
        parentBox.appendChild(taskElement);

        caret.addEventListener("click", () => {
          caret.classList.toggle("caret-rotate");
          dropdown.classList.toggle("menu-open");
        });

        attachDropdownEventListeners(userId, task, dropdown);

        starButton
          .querySelector(".important_button")
          .addEventListener("click", function () {
            const icon = starButton.querySelector(".material-symbols-outlined");
            icon.classList.toggle("filled");
            if (icon.classList.contains("filled")) {
              moveTaskToImportant(userId, task.id);
            }
          });

        taskElement.addEventListener("click", function (e) {
          if (!e.target.closest(".caret") && !e.target.closest(".dropdown")) {
            showModal(task);
          }
        });
      }
    }
  }
}

function showModal(task) {
  const modal = document.getElementById("taskModal");
  const closeBtn = document.querySelector(".close");

  document.getElementById("modalTitle").textContent = task.title;
  document.getElementById("modalAssignedTo").textContent = getStatusLabel(
    task.assignedTo
  );
  document.getElementById("modalDate").textContent = task.date;
  document.getElementById("modalTime").textContent = task.time;
  document.getElementById("modalNotes").textContent = task.notes;

  const createdAtDate = new Date(task.createdAt);
  const createdAtFormatted = createdAtDate.toLocaleString();

  document.getElementById("modalCreatedAt").textContent = createdAtFormatted;

  modal.style.display = "block";

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function attachDropdownEventListeners(userId, task, dropdown) {
  dropdown.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const newStatus = item.textContent.trim().toLowerCase();
      if (newStatus !== task.assignedTo.toLowerCase()) {
        task.assignedTo = newStatus;
        updateTaskStatus(userId, task.id, newStatus);
        moveTaskToSection(userId, task, newStatus);
      }
    });
  });
}

function moveTaskToImportant(userId, taskId) {
  const taskRef = ref(db, `users/${userId}/tasks/${taskId}`);
  const importantTasksRef = ref(
    db,
    `users/${userId}/important_tasks/${taskId}`
  );
  get(taskRef)
    .then((snapshot) => {
      const taskData = snapshot.val();
      if (taskData) {
        // Set the task data in the "important_tasks" node in Firebase
        set(importantTasksRef, taskData)
          .then(() => {
            console.log(
              "Task moved to important tasks successfully in Firebase."
            );
            // Remove the task data from the "tasks" node
            remove(ref(db, `users/${userId}/tasks/${taskId}`))
              .then(() => {
                console.log(
                  "Task removed from tasks node in Firebase:",
                  taskId
                );
                // Remove the task element from the UI
                const taskElement = document.getElementById(`task_${taskId}`);
                if (taskElement) {
                  taskElement.remove();
                  console.log("Task element removed from UI:", taskId);
                } else {
                  console.error("Task element not found in UI:", taskId);
                }
              })
              .catch((error) => {
                console.error(
                  "Error removing task from tasks node in Firebase:",
                  error
                );
              });
          })
          .catch((error) => {
            console.error(
              "Error moving task to important tasks in Firebase:",
              error
            );
          });
      } else {
        console.error("Task data not found.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving task data:", error);
    });
}

function updateTaskStatus(userId, taskId, newStatus) {
  // Update the task status in Firebase database
  console.log("Updating task status in Firebase:", taskId, newStatus);
  const taskRef = ref(db, `users/${userId}/tasks/${taskId}`);
  const updates = {};
  updates["assignedTo"] = newStatus;
  update(taskRef, updates)
    .then(() => {
      console.log("Task status updated successfully in Firebase.");
    })
    .catch((error) => {
      console.error("Error updating task status in Firebase:", error);
    });
}

function moveTaskToSection(userId, task, newStatus) {
  // Get the section corresponding to the new status
  const sectionId = getStatusSectionId(newStatus);
  const section = document.getElementById(sectionId);
  if (section) {
    // Find the task element
    const taskElement = document.getElementById(`task_${task.id}`);
    if (taskElement) {
      if (newStatus === "archive") {
        // Remove the task element from the display
        taskElement.remove();
        console.log("Task archived:", task.id);
        // Move the task to the "archive" section in Firebase
        archiveTask(userId, task.id);
      } else {
        // Find the parent box element of the section
        const parentBox = section.closest(".box");
        if (parentBox) {
          // Remove the task element from its current parent
          taskElement.remove();
          // Append the task element to the parent box
          parentBox.appendChild(taskElement);
          console.log("Task moved to section:", sectionId);
          // Update the task's assignedTo property
          task.assignedTo = newStatus;
          // Update the dropdown content
          const dropdownOptions = getDropdownOptions(newStatus);
          task.dropdown.innerHTML = dropdownOptions;
          // Close the dropdown menu
          closeDropdown(task);
          // Re-attach event listeners to the dropdown menu items
          attachDropdownEventListeners(userId, task, task.dropdown);
        } else {
          console.error("Parent box element not found.");
        }
      }
    } else {
      console.error("Task element not found.");
    }
  } else {
    console.error(`Section ${sectionId} not found.`);
  }
}

function archiveTask(userId, taskId) {
  // Construct the reference to the task in the database
  const taskRef = `users/${userId}/tasks/${taskId}`;
  get(ref(db, taskRef))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const taskData = snapshot.val();
        // Push the task to the "archiveTasks" node
        const archiveTasksRef = ref(
          db,
          `users/${userId}/archiveTasks/${taskId}`
        );
        set(archiveTasksRef, taskData)
          .then(() => {
            console.log("Task archived in Firebase:", taskId);
            // Remove the task from its current location
            remove(ref(db, taskRef))
              .then(() => {
                console.log("Task removed from its original location:", taskId);
              })
              .catch((error) => {
                console.error(
                  "Error removing task from original location:",
                  error
                );
              });
          })
          .catch((error) => {
            console.error("Error archiving task in Firebase:", error);
          });
      } else {
        console.error("Task does not exist:", taskId);
      }
    })
    .catch((error) => {
      console.error("Error retrieving task data:", error);
    });
}

function closeDropdown(task) {
  // Find the dropdown element associated with the task
  const dropdown = task.dropdown;
  if (dropdown) {
    // Remove the "menu-open" class to close the dropdown
    dropdown.classList.remove("menu-open");
    // Find the caret element and remove the "caret-rotate" class
    const caret = dropdown.previousElementSibling;
    if (caret) {
      caret.classList.remove("caret-rotate");
    }
  }
}

function getStatusSectionId(status) {
  switch (status) {
    case "to-do":
      return "todo-section";
    case "in-progress":
      return "in-progress-section";
    case "finished":
      return "finished-section";
    case "archive":
      return "archive-section";
    default:
      console.error(`Invalid status: ${status}`);
      return null;
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "TO-DO" || "to-do":
      return "TO-DO";
    case "in-progress":
      return "IN-PROGRESS";
    case "finished":
      return "FINISHED";
    default:
      return "UNKNOWN"; // Handle unknown status
  }
}

// Function to generate dropdown options based on task status
function getDropdownOptions(currentStatus) {
  const statuses = ["TO-DO", "IN-PROGRESS", "FINISHED", "ARCHIVE"];
  const options = statuses.map((status) => {
    if (status !== currentStatus.toUpperCase()) {
      return `<li>${status}</li>`;
    }
    return `<li class="chosen">${status}</li>`;
  });
  return options.join("");
}
