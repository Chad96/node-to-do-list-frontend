// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5JqBUR0IO7PnomT6JX2YamWVzNQ8VuiY",
  authDomain: "capaciti-todoapp.firebaseapp.com",
  projectId: "capaciti-todoapp",
  storageBucket: "capaciti-todoapp.appspot.com",
  messagingSenderId: "119973465942",
  appId: "1:119973465942:web:fe3c5bf7945883e3a550f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Register User
window.registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', userCredential.user);
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Registration Error:', error.message);
    alert(error.message);
  }
};

// Login User
window.loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
    localStorage.setItem('userId', userCredential.user.uid);
    window.location.href = 'todo.html';
  } catch (error) {
    console.error('Login Error:', error.message);
    alert(error.message);
  }
};

// Logout User
window.logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout Error:', error.message);
  }
};

// Check Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is logged in:', user.uid);
    localStorage.setItem('userId', user.uid);
  } else {
    console.log('User is logged out');
    localStorage.removeItem('userId');
  }
});