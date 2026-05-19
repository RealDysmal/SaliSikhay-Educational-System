// Initialize our simulated database in localStorage
let usersDatabase = JSON.parse(localStorage.getItem('usersDB')) || [];

// --- UTILITY: Password Visibility Toggle ---
function setupPasswordToggle(toggleId, inputId) {
    const toggleBtn = document.getElementById(toggleId);
    const passwordInput = document.getElementById(inputId);

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function() {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }
}

// Set up toggles for whatever page we are on
setupPasswordToggle('toggle-login-password', 'login-password');
setupPasswordToggle('toggle-reg-password', 'reg-password');


// --- REGISTRATION LOGIC ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page reload
        
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const errorMsg = document.getElementById('reg-error');

        // Validation: Password length
        if (password.length < 8) {
            errorMsg.textContent = "Password must be at least 8 characters long.";
            return;
        }

        // Validation: Check if username already exists
        const userExists = usersDatabase.some(user => user.username === username);
        if (userExists) {
            errorMsg.textContent = "Username already exists. Please choose another.";
            return;
        }

        // Add to database
        usersDatabase.push({ username: username, email: email, password: password });
        localStorage.setItem('usersDB', JSON.stringify(usersDatabase));

        // Clear errors and redirect
        errorMsg.style.color = 'green';
        errorMsg.textContent = "Registration successful! Redirecting...";
        
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to login page
        }, 1500);
    });
}


// --- LOGIN LOGIC ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page reload

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorMsg = document.getElementById('login-error');

        // Check if user exists and password matches
        const user = usersDatabase.find(u => u.username === username && u.password === password);

        if (user) {
            // Save active session
            localStorage.setItem('currentUser', username);
            window.location.href = 'dashboard.html'; // Redirect to logged in page
        } else {
            errorMsg.textContent = "Invalid username or password.";
        }
    });
}


// --- DASHBOARD LOGIC (Logged In Page) ---
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    const currentUser = localStorage.getItem('currentUser');
    
    // Safety check: if accessed without logging in, boot them out
    if (!currentUser) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('welcome-message').textContent = `Welcome, ${currentUser}! You are safely logged in.`;
    }

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser'); // End session
        window.location.href = 'index.html';    // Go back to login
    });
}