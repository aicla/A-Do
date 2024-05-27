import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";


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

// Logout button functionality
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

function sendMessage(messageText) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const messageData = {
      text: messageText,
      sender: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email
      },
      timestamp: new Date().getTime() // or use firebase.database.ServerValue.TIMESTAMP
    };
    const messagesRef = ref(db, 'messages');
    push(messagesRef, messageData)
      .then((newMessageRef) => {
        console.log("Message sent with ID:", newMessageRef.key);
        console.log("Message data:", messageData);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  } else {
    console.error("No user signed in.");
  }
}

// Function to load messages
function loadMessages() {
    console.log("Loading messages...");
    const messagesRef = ref(db, 'messages');
    onValue(messagesRef, (snapshot) => {
      const messageBox = document.querySelector('.message-box');
      messageBox.innerHTML = ''; // Clear existing messages before loading new ones
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        console.log("Loaded message:", message); // Debug log
        // Display the message
        displayMessage(message, messageBox);
      });
    });
  }

function displayMessage(message, messageBox) {
  const messageHTML = `
    <div class="message">
      <div class="user">
        <span id="icon" class="material-symbols-outlined"></span>
      </div>
      <div class="message-container">
        <h2 id="username">${message.sender.displayName}</h2>
        <h4 id="message-time">${new Date(message.timestamp).toLocaleString()}</h4>
        <h4 id="message-content">${message.text}</h4>
      </div>
    </div>
  `;

  // Append the new message to the message box
  messageBox.innerHTML += messageHTML;
}

// Event listener for sending a message
document.getElementById('msgBtn').addEventListener('click', function() {
  const messageInput = document.getElementById('msgTxt');
  const messageText = messageInput.value;
  if (messageText.trim() !== '') {
    sendMessage(messageText);
    messageInput.value = '';
  }
});

// Load messages when the page is loaded
window.onload = function() {
  loadMessages();
};