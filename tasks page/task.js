function loadTasks(userId) {
  // Retrieve tasks from Firebase database
  const userTasksRef = ref(db, "users/" + userId + "/tasks/");
  get(userTasksRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const tasks = snapshot.val();
        // Iterate through tasks and populate the dropdowns
        Object.values(tasks).forEach((task) => {
          if (task.assignedTo === "TO-DO") {
            addToDoTask(task);
          } else if (task.assignedTo === "IN PROGRESS") {
            addInProgressTask(task);
          }
        });
      } else {
        console.log("No tasks found for this user.");
      }
    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
    });
}

// Function to add task to TO-DO dropdown
function addToDoTask(task) {
  const todoDropdown = document.getElementById("todo-tasks-dropdown");
  const taskElement = createTaskElement(task);
  todoDropdown.appendChild(taskElement);
}

// Function to add task to IN PROGRESS dropdown
function addInProgressTask(task) {
  const inProgressDropdown = document.getElementById(
    "inprogress-tasks-dropdown"
  );
  const taskElement = createTaskElement(task);
  inProgressDropdown.appendChild(taskElement);
}

// Function to create task element
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");

  // Create and append other elements for the task
  const titleElement = document.createElement("div");
  titleElement.classList.add("task-title");
  titleElement.textContent = task.title;
  taskElement.appendChild(titleElement);

  // Similarly, create and append other elements like due date, description, etc.

  return taskElement;
}

function toggleMenu() {
  var menu = document.getElementById("menu");
  menu.classList.toggle("show");
}

function toggleOptions(optionClass) {
  var options = document.querySelector("." + optionClass);

  var isActive = options.classList.contains("active");

  var allOptions = document.querySelectorAll(".v-options, .v-opt2, .v-opt3");
  allOptions.forEach(function (option) {
    if (option !== options) {
      option.classList.remove("active");
    }
  });

  if (!isActive) {
    options.classList.add("active");
  } else {
    options.classList.remove("active");
  }
}

document
  .getElementById("kid_star_button")
  .addEventListener("click", function () {
    var icon = document.getElementById("kid_star_icon");
    if (icon.classList.contains("filled")) {
      icon.classList.remove("filled");
    } else {
      icon.classList.add("filled");
    }
  });

const dropdowns = document.querySelectorAll(".teams");

dropdowns.forEach((teams) => {
  const select = teams.querySelector(".select");
  const caret = teams.querySelector(".caret");
  const menu = teams.querySelector(".dropdown");
  const options = teams.querySelectorAll(".dropdown li");
  const selected = teams.querySelector(".selected");

  select.addEventListener("click", () => {
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open");
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerText = option.innerText;
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      options.forEach((option) => {
        option.classList.remove("chosen");
      });
      option.classList.add("chosen");
    });
  });
});

