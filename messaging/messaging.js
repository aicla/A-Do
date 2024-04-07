import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

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
