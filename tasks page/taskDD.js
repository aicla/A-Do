import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

document.addEventListener("DOMContentLoaded", function () {
    // Add authentication state change listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            loadTasks(user.uid); // Pass the user's ID to loadTasks function
        } else {
            console.error("No user is currently signed in.");
        }
    });
});

function loadTasks(userId) {
    console.log("Loading tasks for user:", userId);
    // Retrieve tasks from Firebase database
    const userTasksRef = ref(db, "users/" + userId + "/tasks/");
    get(userTasksRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const tasks = snapshot.val();
                console.log("Tasks data:", tasks); // Log the tasks data
                // Sort tasks by assignedTo value
                const sortedTasks = Object.values(tasks).sort((a, b) => {
                    // Trim assignedTo values to remove leading and trailing spaces
                    const assignedToA = a.assignedTo.trim().toLowerCase();
                    const assignedToB = b.assignedTo.trim().toLowerCase();
                    if (assignedToA < assignedToB) return -1;
                    if (assignedToA > assignedToB) return 1;
                    return 0;
                });
                console.log("Sorted tasks:", sortedTasks);

                // Display tasks in the appropriate sections based on their status
                sortedTasks.forEach((task) => {
                    // Display only the chosen value of each task
                    console.log("Chosen value:", task.chosen);
                    // Determine the section to add the task based on its assignedTo value
                    switch (task.assignedTo.toLowerCase()) {
                        case 'to-do':
                            displayTask(task.chosen, "todo-section");
                            break;
                        case 'in-progress':
                            displayTask(task.chosen, "in-progress-section");
                            break;
                        case 'finished':
                            displayTask(task.chosen, "finished-section");
                            break;
                        case 'archive':
                            displayTask(task.chosen, "archive-section");
                            break;
                        default:
                            console.error(`Invalid task status: ${task.assignedTo}`);
                            break;
                    }
                });
            } else {
                console.log("No tasks found for this user.");
                // Remove the first inner-box if no tasks exist
                const todoSection = document.getElementById("todo-section");
                if (todoSection) {
                    const firstInnerBox = todoSection.closest('.inner-box');
                    if (firstInnerBox) {
                        firstInnerBox.remove();
                    }
                }
            }
        })
        .catch((error) => {
            console.error("Error loading tasks:", error);
        });
}


function displayTask(chosen, sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        if (chosen) {
            // Create a new inner-box for each task
            const taskElement = document.createElement("div");
            taskElement.classList.add("inner-box");

            // Create the star-button element
            const starButton = document.createElement("div");
            starButton.classList.add("star-button");
            starButton.innerHTML = `
                <a class="important_button" id="kid_star_button_1">
                <span class="material-symbols-outlined" id="kid_star_icon_1"
                    ><style>
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
            `;

            // Create the name-bar element and add the chosen text to it
            const nameBar = document.createElement("div");
            nameBar.classList.add("name-bar");
            nameBar.innerHTML = `<span class="title-input">${chosen}</span>`;

            // Create the caret element
            const caret = document.createElement("div");
            caret.classList.add("caret");

            // Create the dropdown element
            const dropdown = document.createElement("ul");
            dropdown.classList.add("dropdown");
            dropdown.innerHTML = `
                <li class="chosen">TO-DO</li>
                <li>IN-PROGRESS</li>
                <li>FINISHED</li>
                <li>ARCHIVE</li>
            `;

            // Append all elements to the taskElement
            taskElement.appendChild(starButton);
            taskElement.appendChild(nameBar);
            taskElement.appendChild(caret);
            taskElement.appendChild(dropdown);

            // Find the parent box element of the section
            const parentBox = section.closest('.box');
            if (parentBox) {
                // Append the taskElement to the parentBox
                parentBox.appendChild(taskElement);
                console.log("Task element appended to parent box:", taskElement);

                // Attach event listener to the caret of the new task element
                caret.addEventListener("click", () => {
                    caret.classList.toggle('caret-rotate');
                    dropdown.classList.toggle("menu-open");
                });
                
                 // Attach event listener to the star button of the new task element
                 starButton.querySelector('.important_button').addEventListener('click', function() {
                    const icon = starButton.querySelector('.material-symbols-outlined');
                    icon.classList.toggle('filled');
                });
                    
            } else {
                console.error("Parent box element not found.");
            }
        } else {
            console.error("Chosen value is empty or null.");
        }
    } else {
        console.error(`Section ${sectionId} not found.`);
    }
}