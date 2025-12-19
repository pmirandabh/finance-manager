import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import UpdatePassword from '../components/UpdatePassword';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';

const AuthPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const { language, changeLanguage, t } = useLanguage();
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsUpdatingPassword(true);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="auth-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            position: 'relative'
        }}>
            {/* Language Selector */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <select
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        outline: 'none',
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <option value="pt-BR">🇧🇷 Português</option>
                    <option value="en-US">🇺🇸 English</option>
                </select>
            </div>

            <div className="auth-card glass-panel" style={{
                maxWidth: '500px',
                minWidth: '400px',
                width: '100%'
            }}>
                {isUpdatingPassword ? (
                    <UpdatePassword onPasswordUpdated={() => setIsUpdatingPassword(false)} />
                ) : isRegistering ? (
                    <Register onSwitchToLogin={() => setIsRegistering(false)} />
                ) : (
                    <Login onSwitchToRegister={() => setIsRegistering(true)} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;
