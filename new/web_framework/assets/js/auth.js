// Authentication System

window.AuthSystem = {
    init() {
        this.setupForms();
        console.log('Authentication System Initialized');
    },
    
    setupForms() {
        // Registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration(registerForm);
            });
        }
        
        // Login form  
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }
    },
    
    handleRegistration(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const terms = formData.get('terms');
        
        // Basic validation
        if (!email || !password || !confirmPassword || !terms) {
            alert('Please fill in all fields and accept the terms.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
        
        // Simulate registration
        this.simulateAuth('Registration', email, () => {
            window.location.href = '../game/dashboard.html';
        });
    },
    
    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');
        
        // Basic validation
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        
        // Simulate login
        this.simulateAuth('Login', email, () => {
            window.location.href = '../game/dashboard.html';
        });
    },
    
    simulateAuth(action, email, successCallback) {
        // Show loading state
        const submitButton = document.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            console.log(`${action} attempt for:`, email);
            
            // Simulate success (in real app, this would be actual API call)
            localStorage.setItem('courierUser', JSON.stringify({
                email: email,
                loginTime: new Date().toISOString(),
                level: 60,
                paragonLevel: 40
            }));
            
            successCallback();
        }, 1500);
    },
    
    logout() {
        localStorage.removeItem('courierUser');
        window.location.href = '../index.html';
    },
    
    getCurrentUser() {
        const userData = localStorage.getItem('courierUser');
        return userData ? JSON.parse(userData) : null;
    },
    
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.AuthSystem.init();
});