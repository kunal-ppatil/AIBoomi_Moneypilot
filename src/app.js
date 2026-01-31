
import './styles/main.css';
import './styles/hero.css';
import './styles/wizard.css';
import './styles/results.css';
import { initBackground } from './ui/background3d.js';
import { initWizard } from './ui/wizard.js';
import { authService } from './services/supabase.js';
import { validateConfig } from './config/env.js';

document.addEventListener('DOMContentLoaded', async () => {

    // Validate environment configuration
    if (!validateConfig()) {
        alert('Missing environment variables. Please check your .env file.');
        window.location.href = '/';
        return;
    }

    // 1. Init Background
    initBackground();

    // 2. Check Auth - Redirect if not logged in
    const user = await authService.getCurrentUser();
    if (!user) {
        alert('Please log in to access the app');
        window.location.href = '/';
        return;
    }

    // Display user email in header if element exists
    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl) {
        userEmailEl.textContent = user.email;
    }

    // 3. Init Theme Logic
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    themeBtn?.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        themeBtn.textContent = body.classList.contains('light-theme') ? '🌙' : '☀';
    });

    // 4. Logout Logic
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        const result = await authService.logout();
        if (result.success) {
            window.location.href = '/';
        } else {
            alert('Error logging out. Please try again.');
        }
    });

    // 5. Start App (Wizard)
    initWizard();
});
