// Global variables
let isLoggedIn = false;
let currentPage = 'login';

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
        const response = await fetch('http://localhost:5000/login', {
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
            isLoggedIn = true;
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
        const response = await fetch('http://localhost:5000/register', {
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
        const response = await fetch('http://localhost:5000/blog', {
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
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
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
    if (savedLoginState === 'true') {
        isLoggedIn = true;
        showPage('add-blog');
    } else {
        showPage('login');
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);