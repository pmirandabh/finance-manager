import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Preencha todos os campos');
            return;
        }

        setIsLoading(true);
        try {
            await login(username, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'var(--bg-color)',
            padding: '15px'
        }}>
            <div className="auth-card glass-panel" style={{
                width: '100%',
                maxWidth: '380px',
                padding: '30px',
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <div className="auth-header" style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <h1 style={{
                        fontSize: '1.6rem',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '1.8rem', color: '#03DAC6' }}>$</span>
                        Saldo+ v1.0
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>Gestão Pessoal Financeira</p>
                    <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '0.7rem', opacity: 0.7 }}>Desenvolvido por Paulo Miranda</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label>Usuário</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Digite seu usuário"
                            autoFocus
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label>Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="auth-footer">
                        <p>
                            Não tem uma conta?{' '}
                            <button
                                type="button"
                                className="link-button"
                                onClick={onSwitchToRegister}
                            >
                                Cadastre-se
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
