// Environment configuration
export const config = {
    gemini: {
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    },
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    }
};

// Validate configuration
export function validateConfig() {
    const missing = [];

    if (!config.gemini.apiKey) missing.push('VITE_GEMINI_API_KEY');
    if (!config.supabase.url) missing.push('VITE_SUPABASE_URL');
    if (!config.supabase.anonKey) missing.push('VITE_SUPABASE_ANON_KEY');

    if (missing.length > 0) {
        console.error('Missing environment variables:', missing.join(', '));
        return false;
    }

    return true;
}
