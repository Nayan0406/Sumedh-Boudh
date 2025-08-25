// Global variables
let isLoggedIn = false;
let currentPage = 'login';

// Session timeout variables
let sessionTimeout;
let warningTimeout;
let lastActivityTime = Date.now();
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before logout

// Activity tracking events
const activityEvents = ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'];

// Session management functions
function initializeSessionTracking() {
    if (!isLoggedIn) return;
    
    console.log('Session tracking initialized - 30 minute timeout');
    updateLastActivity();
    startSessionTimer();
    startSessionDisplay();
    
    // Add activity listeners
    activityEvents.forEach(event => {
        document.addEventListener(event, updateLastActivity, true);
    });
}

function startSessionDisplay() {
    // Show session timer
    const sessionTimer = document.getElementById('session-timer');
    if (sessionTimer) {
        sessionTimer.style.display = 'block';
    }
    
    // Update session countdown every second
    const updateDisplay = () => {
        if (!isLoggedIn) return;
        
        const elapsed = Date.now() - lastActivityTime;
        const remaining = SESSION_DURATION - elapsed;
        
        if (remaining <= 0) {
            return; // Will be handled by session expiry
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        const countdownElement = document.getElementById('session-countdown');
        if (countdownElement) {
            countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when less than 5 minutes remaining
            const sessionTimer = document.getElementById('session-timer');
            if (sessionTimer) {
                if (remaining < WARNING_TIME) {
                    sessionTimer.style.background = 'rgba(239, 68, 68, 0.1)';
                    sessionTimer.style.color = '#ef4444';
                } else {
                    sessionTimer.style.background = 'rgba(59, 130, 246, 0.1)';
                    sessionTimer.style.color = '#3b82f6';
                }
            }
        }
        
        // Continue updating if user is still logged in
        if (isLoggedIn) {
            setTimeout(updateDisplay, 1000);
        }
    };
    
    updateDisplay();
}

function updateLastActivity() {
    lastActivityTime = Date.now();
    
    // Clear existing timers
    if (sessionTimeout) clearTimeout(sessionTimeout);
    if (warningTimeout) clearTimeout(warningTimeout);
    
    // Only restart timers if user is logged in
    if (isLoggedIn) {
        startSessionTimer();
    }
}

function startSessionTimer() {
    // Set warning timer (25 minutes - 5 minutes before logout)
    warningTimeout = setTimeout(() => {
        showSessionWarning();
    }, SESSION_DURATION - WARNING_TIME);
    
    // Set logout timer (30 minutes)
    sessionTimeout = setTimeout(() => {
        handleSessionExpiry();
    }, SESSION_DURATION);
}

function showSessionWarning() {
    if (!isLoggedIn) return;
    
    const userChoice = confirm(
        'Your session will expire in 5 minutes due to inactivity.\n\n' +
        'Click "OK" to extend your session or "Cancel" to logout now.'
    );
    
    if (userChoice) {
        // User wants to extend session
        updateLastActivity();
        showToast('Session extended successfully', 'success');
    } else {
        // User chose to logout
        handleSessionExpiry();
    }
}

function handleSessionExpiry() {
    console.log('Session expired due to inactivity');
    
    // Clear activity listeners
    activityEvents.forEach(event => {
        document.removeEventListener(event, updateLastActivity, true);
    });
    
    // Clear timers
    if (sessionTimeout) clearTimeout(sessionTimeout);
    if (warningTimeout) clearTimeout(warningTimeout);
    
    // Clear session data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionStartTime');
    isLoggedIn = false;
    
    // Show session expired message
    showToast('Session expired due to inactivity. Please login again.', 'error');
    
    // Redirect to login page after short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function clearSessionTracking() {
    // Clear timers
    if (sessionTimeout) clearTimeout(sessionTimeout);
    if (warningTimeout) clearTimeout(warningTimeout);
    
    // Remove activity listeners
    activityEvents.forEach(event => {
        document.removeEventListener(event, updateLastActivity, true);
    });
    
    // Hide session timer
    const sessionTimer = document.getElementById('session-timer');
    if (sessionTimer) {
        sessionTimer.style.display = 'none';
    }
    
    console.log('Session tracking cleared');
}

// Page navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show requested page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
    }
    
    // Update navigation active state
    updateNavigation();
}

function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page link
    const activeLink = document.querySelector(`[onclick="showPage('${currentPage}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Authentication functions
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-btn');
    const messageDiv = document.getElementById('login-message');
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    messageDiv.style.display = 'none';
    try {
        const response = await fetch('https://sumedh-boudh-backend.vercel.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage('login-message', data.message || 'Login successful!', 'success');
            showToast('Login successful!', 'success');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('sessionStartTime', Date.now().toString());
            isLoggedIn = true;
            
            // Initialize session tracking
            initializeSessionTracking();
            
            // Redirect to dashboard after successful login
            window.location.href = 'dashboard.html';
        } else {
            showMessage('login-message', data.error || 'Login failed', 'error');
            showToast(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('login-message', 'Network error. Please try again.', 'error');
        showToast('Network error. Please try again.', 'error');
    } finally {
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
}

function showSidebarDashboard() {
    // Hide login/register pages
    const loginPage = document.getElementById('login-page');
    const registerPage = document.getElementById('register-page');
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'flex';
    if (loginPage) loginPage.style.display = 'none';
    if (registerPage) registerPage.style.display = 'none';
}

async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const registerBtn = document.getElementById('register-btn');
    const messageDiv = document.getElementById('register-message');
    
    // Show loading state
    registerBtn.textContent = 'Registering...';
    registerBtn.disabled = true;
    messageDiv.style.display = 'none';
    
    try {
        const response = await fetch('https://sumedh-boudh-backend.vercel.app/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success
            showMessage('register-message', data.message || 'Registration successful!', 'success');
            showToast('Registration successful!', 'success');
            
            // Clear form
            document.getElementById('reg-email').value = '';
            document.getElementById('reg-password').value = '';
            
            // Redirect to login page after short delay
            setTimeout(() => {
                showPage('login');
            }, 1500);
            
        } else {
            // Error
            showMessage('register-message', data.error || 'Registration failed', 'error');
            showToast(data.error || 'Registration failed', 'error');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('register-message', 'Network error. Please try again.', 'error');
        showToast('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        registerBtn.textContent = 'Register';
        registerBtn.disabled = false;
    }
}

// Blog functions
async function handleAddBlog(event) {
    event.preventDefault();
    
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    const author = document.getElementById('blog-author').value;
    const date = document.getElementById('blog-date').value;
    const addBlogBtn = document.getElementById('add-blog-btn');
    const messageDiv = document.getElementById('blog-message');
    
    // Show loading state
    addBlogBtn.textContent = 'Adding...';
    addBlogBtn.disabled = true;
    messageDiv.style.display = 'none';
    
    try {
        const response = await fetch('https://sumedh-boudh-backend.vercel.app/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, author, date })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success
            showMessage('blog-message', data.message || 'Blog added successfully!', 'success');
            showToast('Blog added successfully!', 'success');
            
            // Clear form
            document.getElementById('blog-title').value = '';
            document.getElementById('blog-content').value = '';
            document.getElementById('blog-author').value = '';
            document.getElementById('blog-date').value = '';
            
        } else {
            // Error
            showMessage('blog-message', data.error || 'Failed to add blog', 'error');
            showToast(data.error || 'Failed to add blog', 'error');
        }
        
    } catch (error) {
        console.error('Add blog error:', error);
        showMessage('blog-message', 'Network error. Please try again.', 'error');
        showToast('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        addBlogBtn.textContent = 'Add Blog';
        addBlogBtn.disabled = false;
    }
}

// Utility functions
function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

function showToast(message, type) {
    // Using Toastify library
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: type === 'success' ? "#10b981" : "#ef4444",
    }).showToast();
}

function logout() {
    // Clear session tracking
    clearSessionTracking();
    
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionStartTime');
    isLoggedIn = false;
    
    // Show logout message
    showToast('Logged out successfully', 'success');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Initialize the application
function initializeApp() {
    // Check if user is already logged in
    const savedLoginState = localStorage.getItem('isLoggedIn');
    const sessionStartTime = localStorage.getItem('sessionStartTime');
    
    if (savedLoginState === 'true' && sessionStartTime) {
        const sessionAge = Date.now() - parseInt(sessionStartTime);
        
        // Check if session is still valid (less than 30 minutes old)
        if (sessionAge < SESSION_DURATION) {
            isLoggedIn = true;
            console.log('Restoring existing session, age:', Math.round(sessionAge / 1000 / 60), 'minutes');
            
            // Initialize session tracking for existing session
            initializeSessionTracking();
            
            showPage('add-blog');
        } else {
            // Session expired, clear it
            console.log('Session expired, clearing...');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('sessionStartTime');
            showToast('Previous session expired. Please login again.', 'error');
            showPage('login');
        }
    } else {
        showPage('login');
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);