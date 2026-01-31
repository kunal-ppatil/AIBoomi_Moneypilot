import './styles/hero.css';
import { initBackground } from './ui/background3d.js';
import { authService } from './services/supabase.js';
import { validateConfig } from './config/env.js';

// Initialize Layout
document.addEventListener('DOMContentLoaded', async () => {
    // Validate environment configuration
    if (!validateConfig()) {
        alert('Missing environment variables. Please check your .env file.');
        return;
    }

    // Initialize modules
    initBackground();

    // --- Theme Toggler ---
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    themeBtn?.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        themeBtn.textContent = isLight ? '🌙' : '☀';
    });

    // --- Showcase Modal Logic ---
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close-btn');

    document.querySelectorAll('.showcase-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modal.classList.add('open');
        });
    });

    modalClose?.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    // --- Auth State & Logic ---
    let currentUser = await authService.getCurrentUser();
    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-close-btn');
    const authForm = document.getElementById('auth-form');
    const authToggle = document.getElementById('toggle-auth-mode');
    const authTitle = document.getElementById('auth-title');
    const authSubmit = document.getElementById('auth-submit-btn');
    const emailInput = authForm?.querySelector('input[type="email"]');
    const passInput = authForm?.querySelector('input[type="password"]');

    let isLoginMode = true;

    // Toggle Login/Signup
    authToggle?.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        authTitle.innerText = isLoginMode ? 'Welcome Back' : 'Create Account';
        authSubmit.innerText = isLoginMode ? 'Log In' : 'Sign Up';
        authToggle.innerText = isLoginMode ? 'Sign up' : 'Log in';
        if (authForm) authForm.reset();
    });

    // Handle Auth Submit
    authForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput?.value;
        const password = passInput?.value;
        const btnText = authSubmit.innerText;

        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Password strength check
        if (password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        authSubmit.innerText = 'Processing...';
        authSubmit.disabled = true;

        try {
            let result;
            if (isLoginMode) {
                result = await authService.signIn(email, password);
            } else {
                result = await authService.signUp(email, password);
            }

            if (result.success) {
                // Success! Redirect to app page
                window.location.href = '/app.html';
            } else {
                alert(result.error || 'Authentication failed. Please try again.');
                authSubmit.innerText = btnText;
                authSubmit.disabled = false;
            }
        } catch (error) {
            console.error('Auth error:', error);
            alert('An error occurred. Please try again.');
            authSubmit.innerText = btnText;
            authSubmit.disabled = false;
        }
    });

    authClose?.addEventListener('click', () => authModal.classList.remove('open'));

    // Close modal on outside click
    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.remove('open');
    });

    // --- Navigation Guard ---
    // "Start Planning" button
    document.getElementById('hero-start-btn')?.addEventListener('click', async () => {
        currentUser = await authService.getCurrentUser();
        if (currentUser) {
            window.location.href = '/app.html';
        } else {
            authModal.classList.add('open');
        }
    });

    // Wire up "Log in" link in header
    const loginLink = document.getElementById('header-login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = true;
            authTitle.innerText = 'Welcome Back';
            authSubmit.innerText = 'Log In';
            authToggle.innerText = 'Sign up';
            authModal.classList.add('open');
        });
    }

    // Wire up "Sign up" button in header
    const signupBtn = document.getElementById('header-signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = false;
            authTitle.innerText = 'Create Account';
            authSubmit.innerText = 'Sign Up';
            authToggle.innerText = 'Log in';
            authModal.classList.add('open');
        });
    }

    // If user is already logged in, show different header state
    if (currentUser) {
        const headerNav = document.querySelector('.header-nav');
        if (headerNav) {
            headerNav.innerHTML = `
                <span style="color: var(--text-secondary);">Welcome, ${currentUser.email}</span>
                <a href="/app.html" class="btn btn-primary">Go to App</a>
            `;
        }
    }
});
