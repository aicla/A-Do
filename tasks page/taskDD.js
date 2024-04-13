import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

function createTaskElement(chosen) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("box");

    const nameBar = document.createElement("div");
    nameBar.classList.add("name-bar");
    nameBar.innerHTML = `<span class="title-input">${chosen}</span>`;

    taskElement.appendChild(nameBar);

    return taskElement;
}

function displayTask(chosen, sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Create the main task element
        const taskElement = createTaskElement(chosen);

        // Create additional elements and append them to the task element
        const taskStatus = document.createElement("div");
        taskStatus.textContent = chosen;

        const nameBar = document.createElement("div");
        nameBar.classList.add("name-bar");
        nameBar.innerHTML = `<span class="title-input">${chosen}</span>`;

        taskElement.appendChild(taskStatus);
        taskElement.appendChild(nameBar);

        // Append the new task element to the section
        section.appendChild(taskElement);
    } else {
        console.error(`Section ${sectionId} not found.`);
    }
}

function loadTasks(userId) {
    // Retrieve tasks from Firebase database
    const userTasksRef = ref(db, "users/" + userId + "/tasks/");
    get(userTasksRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const tasks = snapshot.val();
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
            }
        })
        .catch((error) => {
            console.error("Error loading tasks:", error);
        });
}
