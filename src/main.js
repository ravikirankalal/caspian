import './style.css';
import { signInWithGoogle, logout, watchAuthState } from './auth';
import { auth } from './firebase';
document.querySelector('#app').innerHTML = `
  <div id="app">
    <h1>Caspian</h1>
    <p class="read-the-docs">
      Your Vite project is ready! Start editing to see changes.
    </p>
    <button id="login">Sign in with Google</button>
    <button id="logout" hidden>Logout</button>
    <div id="user" hidden>
      <img id="avatar" />
      <span id="username"></span>
    </div>
  </div>
`

const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
const userDiv = document.getElementById('user');
const avatarImg = document.getElementById('avatar');
const usernameSpan = document.getElementById('username');

loginButton.onclick = async () => {
  try {
    await signInWithGoogle();
  } catch (error) {
    console.error('Login failed:', error);
    // You could add user-facing error messaging here
  }
};

logoutButton.onclick = async () => {
  try {
    await logout();
  } catch (error) {
    console.error('Logout failed:', error);
    // You could add user-facing error messaging here
  }
};

// Function to update UI based on authentication state
function updateAuthUI(user) {
  // Defensive checks to ensure elements exist
  if (!loginButton || !logoutButton || !userDiv || !avatarImg || !usernameSpan) {
    console.warn('Authentication UI elements not found');
    return;
  }

  if (user) {
    // User is logged in - show #logout and #user, hide #login
    loginButton.hidden = true;
    logoutButton.hidden = false;
    userDiv.hidden = false;
    
    // Safely set user information with defensive checks
    avatarImg.src = user.photoURL || '';
    avatarImg.alt = user.displayName || 'User avatar';
    usernameSpan.textContent = user.displayName || user.email || 'Anonymous User';
  } else {
    // User is logged out - show #login, hide #logout and #user
    loginButton.hidden = false;
    logoutButton.hidden = true;
    userDiv.hidden = true;
    
    // Clear user information
    avatarImg.src = '';
    avatarImg.alt = '';
    usernameSpan.textContent = '';
  }
}

// Watch for authentication state changes
watchAuthState(user => {
  updateAuthUI(user);
});

// Handle page reloads - ensure persistent sessions work
// Firebase auth automatically restores the user session on page reload
// The onAuthStateChanged listener will be called with the current user state
document.addEventListener('DOMContentLoaded', () => {
  // Additional defensive check for page reload scenarios
  // This ensures UI is updated correctly even if elements are recreated
  setTimeout(() => {
    const currentUser = auth.currentUser;
    if (currentUser !== undefined) {
      updateAuthUI(currentUser);
    }
  }, 100);
});

console.log('Caspian project running with Vite');
