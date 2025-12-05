import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { validatePassword } from '../utils/passwordValidator';
import { validators } from '../utils/validators';
import toast from 'react-hot-toast';

const ProfileEditModal = ({ isOpen, onClose }) => {
    const { profile, updateProfile, user } = useAuth();
    const { t, language, changeLanguage, currency, changeCurrency } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordFeedback, setPasswordFeedback] = useState({ isValid: false, strength: 0, feedback: '' });

    // Pre-fill form when modal opens or profile changes
    useEffect(() => {
        if (isOpen && profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setError('');
            setSuccess('');
        }
    }, [isOpen, profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'newPassword') {
            setPasswordFeedback(validatePassword(value));
        }

        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate name
        const nameValidation = validators.validateUserName(formData.name);
        if (!nameValidation.isValid) {
            toast.error(nameValidation.error);
            return;
        }

        if (!formData.email.trim()) {
            toast.error(t('profile.emailRequired'));
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error(t('profile.emailInvalid'));
            return;
        }

        // Se está tentando alterar a senha
        if (formData.newPassword) {
            if (!formData.currentPassword) {
                toast.error(t('profile.currentPasswordRequired'));
                return;
            }

            if (!passwordFeedback.isValid) {
                toast.error(passwordFeedback.feedback || t('profile.passwordWeak'));
                return;
            }

            if (formData.newPassword !== formData.confirmNewPassword) {
                toast.error(t('profile.passwordsDoNotMatch'));
                return;
            }
        }

        // Sempre pedir senha atual para salvar qualquer alteração
        if (!formData.currentPassword) {
            toast.error(t('profile.currentPasswordRequiredToSave'));
            return;
        }

        setIsLoading(true);
        try {
            // Verificar senha atual fazendo login
            const { supabase } = await import('../supabaseClient');
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: formData.currentPassword
            });

            if (authError) {
                throw new Error(t('profile.currentPasswordIncorrect'));
            }

            // Atualizar perfil
            await updateProfile(
                formData.name,
                formData.email,
                formData.newPassword || null
            );

            if (formData.email !== profile?.email) {
                toast.success(t('profile.updateSuccessEmail'));
            } else {
                toast.success(t('profile.updateSuccess'));
            }

            // Limpar senhas
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setPasswordFeedback({ isValid: false, strength: 0, feedback: '' });

            // Fechar modal após 1.5 segundos
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.message || t('profile.updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '500px', maxWidth: '95%', padding: '25px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                        {t('profile.editProfile')}
                    </h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: '1.2rem' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>{t('profile.name')}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder={t('profile.namePlaceholder')}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('profile.email')}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder={t('common.emailPlaceholder')}
                            disabled={isLoading}
                        />
                        {formData.email !== profile?.email && (
                            <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '5px', display: 'block' }}>
                                ⚠️ {t('profile.emailChangeWarning')}
                            </small>
                        )}
                    </div>

                    {/* Seção de Preferências (Idioma e Moeda) */}
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        marginTop: '20px',
                        paddingTop: '20px'
                    }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: 'var(--text-secondary)' }}>
                            {t('profile.preferences')}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label>{t('profile.language')}</label>
                                <select
                                    value={language}
                                    onChange={(e) => changeLanguage(e.target.value)}
                                    className="form-control"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="pt-BR">🇧🇷 Português</option>
                                    <option value="en-US">🇺🇸 English</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{t('profile.currency')}</label>
                                <select
                                    value={currency}
                                    onChange={(e) => changeCurrency(e.target.value)}
                                    className="form-control"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="BRL">R$ (BRL)</option>
                                    <option value="USD">$ (USD)</option>
                                    <option value="GBP">£ (GBP)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        marginTop: '20px',
                        paddingTop: '20px'
                    }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: 'var(--text-secondary)' }}>
                            {t('profile.changePassword')}
                        </h3>

                        <div className="form-group">
                            <label>{t('profile.newPassword')}</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={t('profile.newPasswordPlaceholder')}
                                disabled={isLoading}
                                style={{
                                    border: formData.newPassword ? `1px solid ${passwordFeedback.isValid ? 'var(--secondary-color)' : 'var(--error-color)'}` : undefined
                                }}
                            />
                            {formData.newPassword && (
                                <div style={{ marginTop: '5px' }}>
                                    <div style={{ display: 'flex', gap: '5px', height: '4px', marginTop: '5px' }}>
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

                        {formData.newPassword && (
                            <div className="form-group">
                                <label>{t('profile.confirmNewPassword')}</label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder={t('profile.confirmNewPasswordPlaceholder')}
                                    disabled={isLoading}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        marginTop: '20px',
                        paddingTop: '20px'
                    }}>
                        <div className="form-group">
                            <label>{t('profile.currentPassword')} ({t('common.required')})</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={t('profile.currentPasswordPlaceholder')}
                                disabled={isLoading}
                            />
                            <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '5px', display: 'block' }}>
                                {t('profile.currentPasswordHelp')}
                            </small>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={isLoading}
                            style={{ flex: 1 }}
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            style={{ flex: 1 }}
                        >
                            {isLoading ? t('common.saving') : t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
