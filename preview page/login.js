import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// 1. Firebase Initialization
const firebaseConfig = {
  apiKey: "AIzaSyDTeKSFZF9qGWCJqHXev9Yj2Man36IDgx4",
  authDomain: "a-do-ff29e.firebaseapp.com",
  databaseURL: "https://a-do-ff29e-default-rtdb.firebaseio.com",
  projectId: "a-do-ff29e",
  storageBucket: "a-do-ff29e.appspot.com",
  messagingSenderId: "488739423620",
  appId: "1:488739423620:web:9bdc3605a45a3714b249d1"
};

const app = initializeApp(firebaseConfig);

// 2. Auth Initialization
const auth = getAuth(app);

// 3. Firestore Operations
const firestoreDB = getFirestore(app);
const usersCollection = collection(firestoreDB, 'users');

function getUsersFromFirestore() {
  getDocs(usersCollection)
    .then((snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      console.log(users);
    })
    .catch(err => {
      console.log(err.message);
    });
}

function saveUserToFirestore(uid, displayName, email) {
  const userDocRef = doc(usersCollection, uid);
  return setDoc(userDocRef, {
    displayName: displayName,
    email: email
  });
}

// 4. Realtime Database Operations
const realtimeDB = getDatabase(app);

function saveUserToRealtimeDatabase(uid, displayName, email) {
  const userRef = ref(realtimeDB, 'users/' + uid);
  return set(userRef, {
    displayName: displayName,
    email: email
  });
}

// 5. Google Sign-In
const googleSignInBtn = document.getElementById("googleSign");

googleSignInBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // User successfully signed in.
      const user = result.user;
      const uid = user.uid;
      const email = user.email;
      const displayName = user.displayName;
      const photoURL = user.photoURL;

      localStorage.setItem("uid", uid);
      localStorage.setItem("photoURL", photoURL);
      localStorage.setItem("displayName", displayName);

      // Save user information to Firestore
      saveUserToFirestore(uid, displayName, email)
        .then(() => {
          console.log("User successfully saved to Firestore:", displayName, email);
        })
        .catch(err => {
          console.error("Error saving user to Firestore:", err);
        });

      // Save user information to Realtime Database
      saveUserToRealtimeDatabase(uid, displayName, email)
        .then(() => {
          console.log("User successfully saved to Realtime Database:", displayName, email);
        })
        .catch(err => {
          console.error("Error saving user to Realtime Database:", err);
        });

      window.location.href = "../home page/homepage.html";
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
    });
});

// Call function to fetch users from Firestore
getUsersFromFirestore();
