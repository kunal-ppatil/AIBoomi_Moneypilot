import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Initialize Supabase client
export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

/**
 * Supabase Authentication Service
 * Handles user authentication with Supabase Auth
 */
export const authService = {
    /**
     * Sign up a new user
     */
    async signUp(email, password) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Sign in an existing user
     */
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Sign out the current user
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get the current user
     */
    async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    /**
     * Get the current session
     */
    async getSession() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
};

/**
 * Supabase Data Service
 * Handles user financial data storage and retrieval
 */
export const dataService = {
    /**
     * Save user's financial plan
     */
    async savePlan(data) {
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                console.error('Save failed: User not authenticated');
                return { success: false, error: 'User not authenticated' };
            }

            console.log('Saving plan for user:', user.id);
            console.log('Data to save:', data);

            const { error } = await supabase
                .from('financial_plans')
                .upsert({
                    user_id: user.id,
                    personal: data.personal,
                    goals: data.goals,
                    preferences: data.preferences,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'  // Specify which column to use for conflict resolution
                });

            if (error) {
                console.error('Supabase save error:', error);
                return { success: false, error: error.message };
            }

            console.log('Plan saved successfully');
            return { success: true };
        } catch (error) {
            console.error('Exception during save:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get user's financial plan
     */
    async getPlan() {
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                return { success: false, error: 'User not authenticated', data: null };
            }

            const { data, error } = await supabase
                .from('financial_plans')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                return { success: false, error: error.message, data: null };
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message, data: null };
        }
    },

    /**
     * Save calculation results
     */
    async saveResults(results) {
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                return { success: false, error: 'User not authenticated' };
            }

            const { error } = await supabase
                .from('calculation_results')
                .upsert({
                    user_id: user.id,
                    results: results,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'  // Specify which column to use for conflict resolution
                });

            if (error) {
                console.error('Error saving results:', error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get calculation results
     */
    async getResults() {
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                return { success: false, error: 'User not authenticated', data: null };
            }

            const { data, error } = await supabase
                .from('calculation_results')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                return { success: false, error: error.message, data: null };
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message, data: null };
        }
    }
};
