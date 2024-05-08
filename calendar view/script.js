import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function getDate(userId) {
  const day = ref(db, "users/" + userId + "/tasks/");
  onValue(day, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const taskArray = Object.values(data);
      displayDate(taskArray);
    } else {
      console.log("Huh?");
    }
  });
}

function displayDate(taskArray) {
  taskArray.forEach((tasks) => {
    console.log(`${tasks.title}-${tasks.date}-${tasks.notes}`);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    getDate(user.uid);
  } else {
    console.log("No user signed in.");
  }
});

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
  "December",
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
    lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
  }

  // Loop to add the dates of the current month
  for (let i = 1; i <= lastdate; i++) {
    // Check if the current date is today
    let isToday =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? "active"
        : "";
    lit += `<li class="${isToday}">${i}</li>`;
  }

  // Loop to add the first dates of the next month
  for (let i = dayend; i < 6; i++) {
    lit += `<li class="inactive">${i - dayend + 1}</li>`;
  }

  // Update the text of the current date element
  // with the formatted current month and year
  currdate.innerText = `${months[month]} ${year}`;

  // update the HTML of the dates element
  // with the generated calendar
  day.innerHTML = lit;
};
manipulate();

const regenerateCalendar = () => {
  manipulate();

  const dates = document.querySelectorAll(".calendar-dates li");

  dates.forEach((dateElement) => {
    dateElement.addEventListener("click", handleDateClick);
  });
};

const handleDateClick = async (event) => {
  const clickedDate = event.target.innerText;

  const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    clickedDate
  ).padStart(2, "0")}`;

  console.log(formattedDate);

  try {
    const tasks = await fetchTasks();

    const matchTasks = tasks.filter((task) => task.date === formattedDate);

    //display matched tasks
    displayMatch(matchTasks);
  } catch (error) {
    console.log("Error fetching tasks:", error);
  }
  ToMaking(formattedDate);
};

const fetchTasks = async () => {
  try {
    const userId = getCurrentUserId();
    const dayRef = ref(db, "users/" + userId + "/tasks/");
    const snapshot = await get(dayRef);
    const data = snapshot.val();

    if (data) {
      return Object.values(data);
    } else {
      console.log("No tasks found for the user.");
      return [];
    }
  } catch (error) {
    console.log("Error fetching tasks:", error);
    throw error; //
  }
};

const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    throw new Error("No user signed in.");
  }
};

// Function to display matched tasks
const displayMatch = (tasks) => {
  const subjectsContainer = document.querySelector(".subjects");
  subjectsContainer.innerHTML = "";

  if (tasks.length === 0) {
    const noTask = document.createElement("div");
    noTask.textContent = "No task due today.";
    subjectsContainer.appendChild(noTask);
  } else {
    tasks.forEach((task) => {
      const titleNotesContainer = document.createElement("div");

      const taskElement = document.createElement("div");
      taskElement.classList.add("subject-title");

      const dotElement = document.createElement("span");
      dotElement.classList.add("dot");
      taskElement.appendChild(dotElement);

      //title
      const titleElement = document.createElement("h3");
      titleElement.textContent = task.title;
      titleNotesContainer.appendChild(titleElement);

      // notes
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = task.notes;
      titleNotesContainer.appendChild(descriptionElement);

      taskElement.appendChild(titleNotesContainer);

      //three dots
      const moreVertElement = document.createElement("span");
      moreVertElement.classList.add("material-symbols-outlined");
      moreVertElement.textContent = " more_vert ";
      taskElement.appendChild(moreVertElement);

      subjectsContainer.appendChild(taskElement);
    });
  }
};
regenerateCalendar();

function threeDots() {
  const moreVertElement = document.createElement("span");
  moreVertElement.classList.add("material-symbols-outlined");
  moreVertElement.textContent = " more_vert ";
  taskElement.appendChild(moreVertElement);
}

//this is the part where i give up fooooooc
var add_task = document.getElementById("svg_btn");
add_task.addEventListener("click", ToMaking);

export function ToMaking(formattedDate) {
  const [year, month, day] = formattedDate.split("-");
  const formattedDated = `${String(day).padStart(2, "0")}-${String(
    month
  ).padStart(2, "0")}-${year}`;
  return formattedDated;
}

// Attach a click event listener to each icon
prenexIcons.forEach((icon) => {
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
      date = new Date();
    }
    regenerateCalendar();
  });
});

const dropdowns = document.querySelectorAll(".teams");

dropdowns.forEach((teams) => {
  const select = teams.querySelector(".select");
  const caret = teams.querySelector("#caret");
  const menu = teams.querySelector(".dropdown");
  const options = teams.querySelectorAll(".dropdown li");
  const selected = teams.querySelector(".selected");

  select.addEventListener("click", () => {
    menu.classList.toggle("menu-open");
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerText = option.innerText;
      menu.classList.remove("menu-open");
      options.forEach((option) => {
        option.classList.remove("chosen");
      });
      option.classList.add("chosen");
    });
  });
});
