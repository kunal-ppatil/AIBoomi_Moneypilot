
/**
 * Local Storage Service
 * Simulates a backend database using browser's localStorage.
 * Keys:
 *  - 'moneypilot_users': JSON object { email: { password, id, name } }
 *  - 'moneypilot_data_<id>': JSON object { personal, goals, preferences }
 *  - 'moneypilot_session': Current logged in user ID
 */

const STORAGE_KEYS = {
    USERS: 'moneypilot_users',
    SESSION: 'moneypilot_session'
};

function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
}

function getDataKey(userId) {
    return `moneypilot_data_${userId}`;
}

export const authService = {
    signUp: (email, password) => {
        const users = getUsers();
        if (users[email]) {
            return { success: false, error: 'User already exists' };
        }

        const newUser = {
            id: 'user_' + Date.now(),
            email,
            password, // In real app, hash this!
            createdAt: new Date().toISOString()
        };

        users[email] = newUser;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        // Auto login
        localStorage.setItem(STORAGE_KEYS.SESSION, newUser.id);
        return { success: true, user: newUser };
    },

    signIn: (email, password) => {
        const users = getUsers();
        const user = users[email];

        if (!user || user.password !== password) {
            return { success: false, error: 'Invalid credentials' };
        }

        localStorage.setItem(STORAGE_KEYS.SESSION, user.id);
        return { success: true, user };
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    },

    getCurrentUser: () => {
        const uid = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (!uid) return null;

        const users = getUsers();
        // Find user by ID (inefficient but fine for mock)
        return Object.values(users).find(u => u.id === uid) || null;
    }
};

export const dataService = {
    savePlan: (data) => {
        const user = authService.getCurrentUser();
        if (!user) return false;

        localStorage.setItem(getDataKey(user.id), JSON.stringify(data));
        return true;
    },

    getPlan: () => {
        const user = authService.getCurrentUser();
        if (!user) return null;

        return JSON.parse(localStorage.getItem(getDataKey(user.id))) || null;
    }
};
