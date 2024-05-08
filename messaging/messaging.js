import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
  authDomain: "a-do-ff29e.firebaseapp.com",
  projectId: "a-do-ff29e",
  storageBucket: "a-do-ff29e.appspot.com",
  messagingSenderId: "488739423620",
  appId: "1:488739423620:web:9bdc3605a45a3714b249d1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// Send message functionality
document.getElementById("send-button").addEventListener("click", () => {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  if (message) {
    const messagesRef = ref(db, "messages");

    // Push the new message data to the "messages" node
    push(messagesRef, {
      text: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });

    messageInput.value = "";
  }
});

const messagesList = document.getElementById("messages-list");

onChildAdded(ref(db, "messages"), (snapshot) => {
  const message = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.innerText = message.text;
  messagesList.appendChild(messageElement);
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
