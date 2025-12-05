import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UpdatePassword = ({ onPasswordUpdated }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { updatePassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não conferem');
            return;
        }

        setIsLoading(true);
        try {
            await updatePassword(password);
            onPasswordUpdated();
        } catch (err) {
            console.error('Error updating password:', err);
            setError('Erro ao atualizar senha. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{
                fontSize: '1.6rem',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
            }}>
                <span style={{ fontSize: '1.8rem', color: '#03DAC6' }}>$</span>
                Nova Senha
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 25px 0', fontSize: '0.85rem', textAlign: 'center' }}>
                Defina sua nova senha de acesso
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
                        Nova Senha
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        placeholder={t('auth.passwordPlaceholder')}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#E0E0E0' }}>
                        Confirmar Nova Senha
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input"
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    style={{
                        marginTop: '15px',
                        width: '100%',
                        justifyContent: 'center',
                        padding: '12px',
                        fontSize: '1rem',
                        fontWeight: '600'
                    }}
                >
                    {isLoading ? 'Atualizar Senha' : 'Salvar Nova Senha'}
                </button>
            </form>
        </div>
    );
};

export default UpdatePassword;
