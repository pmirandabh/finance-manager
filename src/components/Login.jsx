import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = ({ onSwitchToRegister }) => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Forgot Password State
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetStatus, setResetStatus] = useState({ type: '', message: '' });

    const { login, resetPassword } = useAuth();

    // Check for blocked user message on mount
    useEffect(() => {
        const loginError = localStorage.getItem('loginError');
        if (loginError === 'blocked') {
            setError('🚫 ' + t('auth.loginError')); // Melhorar mensagem de bloqueio se tiver chave específica
            localStorage.removeItem('loginError');
        }
    }, [t]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setResetStatus({ type: 'error', message: t('profile.emailRequired') });
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(resetEmail);
            setResetStatus({
                type: 'success',
                message: '✅ ' + t('auth.registerSuccess') // Reusing success message or create specific one
            });
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetStatus({ type: '', message: '' });
                setResetEmail('');
            }, 3000);
        } catch (err) {
            console.error(err);
            setResetStatus({ type: 'error', message: t('common.error') });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError(t('common.required'));
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            console.error('Login error:', err);
            setError(t('auth.loginError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <h1 style={{
                fontSize: '2rem',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            }}>
                <span style={{ fontSize: '2.2rem', color: '#03DAC6' }}>$</span>
                Saldo+ v1.0
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 30px 0', fontSize: '0.95rem', textAlign: 'center' }}>
                {t('menu.subtitle')}
            </p>

            {error && (
                <div style={{
                    background: 'rgba(207, 102, 121, 0.1)',
                    border: '1px solid rgba(207, 102, 121, 0.3)',
                    color: '#CF6679',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#E0E0E0' }}>
                        {t('auth.email')}
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        placeholder={t('common.emailPlaceholder')}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '1.05rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#E0E0E0' }}>
                        {t('auth.password')}
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="******"
                            style={{
                                width: '100%',
                                padding: '14px',
                                paddingRight: '45px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: '1.05rem',
                                boxSizing: 'border-box'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px',
                                transition: 'color 0.2s',
                                zIndex: 10
                            }}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {t('auth.forgotPassword')}
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    style={{
                        marginTop: '10px',
                        width: '100%',
                        justifyContent: 'center',
                        padding: '14px',
                        fontSize: '1.05rem',
                        fontWeight: '600'
                    }}
                >
                    {isLoading ? t('common.loading') : t('auth.login')}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {t('auth.noAccount')}{' '}
                <button onClick={onSwitchToRegister} className="link-button">
                    {t('auth.register')}
                </button>
            </p>

            {/* Footer */}
            <div style={{
                marginTop: '30px',
                paddingTop: '15px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem'
            }}>
                Desenvolvido por Paulo Miranda
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '30px', position: 'relative' }}>
                        <button
                            onClick={() => setShowForgotPassword(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>

                        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>{t('auth.forgotPassword')}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', textAlign: 'center' }}>
                            {t('profile.emailRequired')}
                        </p>

                        {resetStatus.message && (
                            <div style={{
                                padding: '10px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                textAlign: 'center',
                                background: resetStatus.type === 'error' ? 'rgba(207, 102, 121, 0.1)' : 'rgba(3, 218, 198, 0.1)',
                                color: resetStatus.type === 'error' ? '#CF6679' : '#03DAC6',
                                border: `1px solid ${resetStatus.type === 'error' ? 'rgba(207, 102, 121, 0.3)' : 'rgba(3, 218, 198, 0.3)'}`
                            }}>
                                {resetStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleResetPassword}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#E0E0E0' }}>{t('auth.email')}</label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="form-input"
                                    placeholder={t('common.emailPlaceholder')}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading}
                                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                            >
                                {isLoading ? t('common.loading') : t('common.confirm')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
