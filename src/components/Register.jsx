import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { validatePassword } from '../utils/passwordValidator';
import toast from 'react-hot-toast';

const Register = ({ onSwitchToLogin }) => {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordFeedback, setPasswordFeedback] = useState({ isValid: false, strength: 0, feedback: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordFeedback(validatePassword(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error(t('common.required'));
            return;
        }

        if (!passwordFeedback.isValid) {
            toast.error(passwordFeedback.feedback || t('auth.passwordTooShort'));
            return;
        }

        setIsLoading(true);
        try {
            await register(email, password, name);
            toast.success(t('auth.registerSuccess'));
            setName('');
            setEmail('');
            setPassword('');
            setPasswordFeedback({ isValid: false, strength: 0, feedback: '' });

            // Optional: Switch to login automatically or let user click
        } catch (err) {
            console.error('Registration error:', err);
            toast.error(t('auth.registerError'));
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#E0E0E0' }}>
                        {t('auth.name')}
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        placeholder={t('profile.namePlaceholder')}
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
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-input"
                        placeholder="******"
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: `1px solid ${password ? (passwordFeedback.isValid ? 'var(--secondary-color)' : 'var(--error-color)') : 'rgba(255,255,255,0.1)'}`,
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '1.05rem',
                            boxSizing: 'border-box'
                        }}
                    />
                    {password && (
                        <div style={{ marginTop: '5px', width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', gap: '5px', height: '4px', marginTop: '5px', width: '100%' }}>
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1,
                                            borderRadius: '2px',
                                            background: i < passwordFeedback.strength
                                                ? (passwordFeedback.strength < 3 ? 'var(--error-color)' : passwordFeedback.strength < 5 ? '#ffd700' : 'var(--secondary-color)')
                                                : 'rgba(255,255,255,0.1)'
                                        }}
                                    />
                                ))}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: passwordFeedback.isValid ? 'var(--secondary-color)' : 'var(--error-color)', marginTop: '4px' }}>
                                {passwordFeedback.feedback}
                            </div>
                        </div>
                    )}
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
                    {isLoading ? t('common.loading') : t('auth.register')}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('auth.haveAccount')} </span>
                <button
                    onClick={onSwitchToLogin}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {t('auth.login')}
                </button>
            </div>
        </div>
    );
};

export default Register;
