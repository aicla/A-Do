import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
    authDomain: "a-do-ff29e.firebaseapp.com",
    databaseURL: "https://a-do-ff29e-default-rtdb.firebaseio.com",
    projectId: "a-do-ff29e",
    storageBucket: "a-do-ff29e.appspot.com",
    messagingSenderId: "488739423620",
    appId: "1:488739423620:web:9bdc3605a45a3714b249d1"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

function loadTasks(userId) {
    const userTasksRef = ref(db, 'users/' + userId + '/tasks/');
    // Listen for data changes on the user's tasks
    onValue(userTasksRef, (snapshot) => {
        const tasks = snapshot.val();
        console.log("Retrieved tasks:", tasks); // Check if tasks are retrieved
        if (tasks) {
            // Process retrieved tasks and display on the calendar
            displayTasksOnCalendar(tasks);
        }
    });
}

function displayTasksOnCalendar(tasks) {
    console.log("Tasks from database:", tasks); // Log tasks retrieved from the database

    // Iterate over the tasks and add them to the calendar
    Object.values(tasks).forEach(task => {
        // Extract task properties like title, date, etc.
        const { title, date, notes, time } = task;
        console.log("Task:", title, date, notes, time); // Log each task's title and date

        // Find the date cell corresponding to the task's date
        const dateCell = document.querySelector(`.calendar-dates .active[data-date="${date}"]`);
        if (dateCell) {
            // Append task information to the date cell
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.textContent = title; // You can display other task details as needed
            taskElement.setAttribute('data-task-date', date); // Set data attribute for task date
            dateCell.appendChild(taskElement);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const user = auth.currentUser;
    console.log("Current user:", user); // Check if the current user is retrieved
    if (user) {
        loadTasks(user.uid);
    }
});

// Function to handle authentication state changes
function handleAuthStateChange() {
    auth.onAuthStateChanged((user) => {
        console.log("Current user:", user);
        if (user) {
            loadTasks(user.uid); // Load tasks if user is signed in
        } else {
            // Handle case where user is not signed in
            console.log("User is not signed in.");
        }
    });
}

// Call handleAuthStateChange() to start listening for authentication state changes
handleAuthStateChange();

function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("show");
}

function deleteItem() {
    var box = document.querySelector(".box");
    box.remove();
}

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");

const currdate = document.querySelector(".calendar-current-date");

const prenexIcons = document.querySelectorAll(".calendar-navigation span");

// Array of month names
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// Function to generate the calendar
const manipulate = () => {

    // Get the first day of the month
    let dayone = new Date(year, month, 1).getDay();

    // Get the last date of the month
    let lastdate = new Date(year, month + 1, 0).getDate();

    // Get the day of the last date of the month
    let dayend = new Date(year, month, lastdate).getDay();

    // Get the last date of the previous month
    let monthlastdate = new Date(year, month, 0).getDate();

    // Variable to store the generated calendar HTML
    let lit = "";

    // Loop to add the last dates of the previous month
    for (let i = dayone; i > 0; i--) {
        lit +=
            `<li class="inactive">${monthlastdate - i + 1}</li>`;
    }

    // Loop to add the dates of the current month
    for (let i = 1; i <= lastdate; i++) {

        // Check if the current date is today
        let isToday = i === date.getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear() ?
            "active" :
            "";
        lit += `<li class="${isToday}">${i}</li>`;
    }

    // Loop to add the first dates of the next month
    for (let i = dayend; i < 6; i++) {
        lit += `<li class="inactive">${i - dayend + 1}</li>`
    }

    // Update the text of the current date element 
    // with the formatted current month and year
    currdate.innerText = `${months[month]} ${year}`;

    // update the HTML of the dates element 
    // with the generated calendar
    day.innerHTML = lit;
}

manipulate();

// Attach a click event listener to each icon
prenexIcons.forEach(icon => {

    // When an icon is clicked
    icon.addEventListener("click", () => {

        // Check if the icon is "calendar-prev"
        // or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        // Check if the month is out of range
        if (month < 0 || month > 11) {

            // Set the date to the first day of the 
            // month with the new year
            date = new Date(year, month, new Date().getDate());

            // Set the year to the new year
            year = date.getFullYear();

            // Set the month to the new month
            month = date.getMonth();
        } else {

            // Set the date to the current date
            date = new Date();
        }

        // Call the manipulate function to 
        // update the calendar display
        manipulate();
    });
});

// Function to handle click event on date cell and display tasks for the selected date
function handleDateCellClick(selectedDate) {
    const selectedDateStr = selectedDate.toISOString().slice(0, 10); // Convert selected date to string
    const tasksOnSelectedDate = document.querySelectorAll(`.task[data-task-date="${selectedDateStr}"]`);
    // Hide all task containers first
    document.querySelectorAll('.task').forEach(task => {
        task.style.display = 'none';
    });
    // Display tasks for the selected date
    tasksOnSelectedDate.forEach(task => {
        task.style.display = 'block';
    });
}

manipulate();

// Attach a click event listener to each icon
prenexIcons.forEach(icon => {

    // When an icon is clicked
    icon.addEventListener("click", () => {

        // Check if the icon is "calendar-prev"
        // or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        // Check if the month is out of range
        if (month < 0 || month > 11) {

            // Set the date to the first day of the 
            // month with the new year
            date = new Date(year, month, new Date().getDate());

            // Set the year to the new year
            year = date.getFullYear();

            // Set the month to the new month
            month = date.getMonth();
        } else {

            // Set the date to the current date
            date = new Date();
        }

        // Call the manipulate function to 
        // update the calendar display
        manipulate();
    });
});