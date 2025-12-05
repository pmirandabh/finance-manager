import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, ADMIN_EMAIL } from '../supabaseClient';
import { errorHandler } from '../utils/errorHandler';
import { loggingService, LOG_CATEGORIES } from '../services/loggingService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const isCheckingLogin = React.useRef(false);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile(session.user.id);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // Skip if we're in the middle of checking login (to prevent race condition)
            if (isCheckingLogin.current) {
                return;
            }

            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile(session.user.id);
            } else {
                setProfile(null);
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Auto-logout logic
    useEffect(() => {
        if (!user) return;

        let logoutTimer;
        const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            if (logoutTimer) clearTimeout(logoutTimer);
            logoutTimer = setTimeout(async () => {
                await supabase.auth.signOut();
                setUser(null);
                setProfile(null);
                setIsAdmin(false);
                window.location.reload(); // Force reload to clear state
            }, TIMEOUT_DURATION);
        };

        // Events to listen for
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        // Setup listeners
        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        // Initial start
        resetTimer();

        // Cleanup
        return () => {
            if (logoutTimer) clearTimeout(logoutTimer);
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [user]);

    const loadProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            // Check if user is blocked
            if (data.is_active !== true) {
                // Store message for Login component to display
                localStorage.setItem('loginError', 'blocked');
                await supabase.auth.signOut();
                setUser(null);
                setProfile(null);
                setIsAdmin(false);
                return;
            }

            // Fallback to user metadata if name is missing in profile
            if (!data.name) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.user_metadata?.name) {
                    data.name = user.user_metadata.name;
                    // Background update to fix the profile table
                    supabase.from('profiles').update({ name: data.name }).eq('id', userId).then();
                }
            }

            setProfile(data);
            setIsAdmin(data?.email === ADMIN_EMAIL);
        } catch (error) {
            // Error loading profile - user will be logged out
        }
    };

    const register = async (email, password, name) => {
        try {
            // Primeiro, verificar se o email já existe
            const { data: existingUsers, error: checkError } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', email)
                .limit(1);

            if (existingUsers && existingUsers.length > 0) {
                throw new Error('Este email já está cadastrado');
            }

            // Register user with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        name: name,
                        full_name: name
                    }
                }
            });

            if (error) {
                // Tratar erro de email duplicado do Supabase
                if (error.message.includes('already registered') || error.message.includes('User already registered')) {
                    throw new Error('Este email já está cadastrado');
                }
                throw error;
            }

            // Create profile in profiles table
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            name: name,
                            email: email,
                            role: 'user',
                            is_active: true
                        }
                    ]);

                if (profileError && !profileError.message.includes('duplicate key')) {
                    console.error('Error creating profile:', profileError);
                }
            }

            return data;
        } catch (error) {
            // Use error handler for better messages
            const message = errorHandler.getErrorMessage(error, 'register');
            const enhancedError = new Error(message);
            enhancedError.originalError = error;
            throw enhancedError;
        }
    };

    const login = async (email, password) => {
        isCheckingLogin.current = true; // Prevent onAuthStateChange from interfering
        let authData = null;
        try {
            // Authenticate with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            authData = data;

            // IMMEDIATELY check if user is active before ANY state updates
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_active')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                console.error('Profile check error:', profileError);
            }

            // If user is blocked, sign out IMMEDIATELY and throw error
            if (!profile || profile.is_active !== true) {
                // Sign out synchronously
                await supabase.auth.signOut();
                isCheckingLogin.current = false; // Re-enable listener

                const blockError = new Error('Sua conta está bloqueada. Entre em contato com o administrador.');
                blockError.code = 'ACCOUNT_BLOCKED';
                throw blockError;
            }

            // Update last_login only if user is active
            await supabase
                .from('profiles')
                .update({ last_login: new Date().toISOString() })
                .eq('id', data.user.id);

            // Manually update state since we blocked the listener
            setUser(data.user);
            await loadProfile(data.user.id);
            isCheckingLogin.current = false; // Re-enable listener

            // Log successful login
            await loggingService.logEvent(LOG_CATEGORIES.AUTH, 'LOGIN', { email });

            return data;
        } catch (error) {
            isCheckingLogin.current = false; // Re-enable listener
            // If we authenticated but then found user is blocked, ensure logout
            if (authData && error.code === 'ACCOUNT_BLOCKED') {
                await supabase.auth.signOut();
                setUser(null);
                setProfile(null);
                setIsAdmin(false);
            }

            // Preserve ACCOUNT_BLOCKED code
            if (error.code === 'ACCOUNT_BLOCKED') {
                throw error; // Throw original error with code
            }

            // Use error handler for better messages
            const message = errorHandler.getErrorMessage(error, 'login');
            const enhancedError = new Error(message);
            enhancedError.originalError = error;
            enhancedError.code = error.code; // Preserve error code
            throw enhancedError;
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // Log logout
            if (user) {
                await loggingService.logEvent(LOG_CATEGORIES.AUTH, 'LOGOUT', { email: user.email });
            }

            setUser(null);
            setProfile(null);
            setIsAdmin(false);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });
            if (error) throw error;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    };

    const updatePassword = async (newPassword) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
        } catch (error) {
            console.error('Update password error:', error);
            throw error;
        }
    };

    const updateProfile = async (name, email, password) => {
        try {
            const updates = {};

            // Update name in profiles table
            if (name !== profile?.name) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ name })
                    .eq('id', user.id);

                if (profileError) throw profileError;
            }

            // Update email if changed (requires confirmation)
            if (email !== profile?.email) {
                updates.email = email;
            }

            // Update password if provided
            if (password) {
                updates.password = password;
            }

            // Update auth user if email or password changed
            if (Object.keys(updates).length > 0) {
                const { error: authError } = await supabase.auth.updateUser(updates);
                if (authError) throw authError;
            }

            // Reload profile to get updated data
            await loadProfile(user.id);

        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    const value = {
        user,
        profile,
        isAdmin,
        register,
        login,
        logout,
        resetPassword,
        updatePassword,
        updateProfile,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
