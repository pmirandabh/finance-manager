import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileSettings = ({ user }) => {
    const { updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.name || user?.name || '',
        email: user?.email || ''
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleSave = async () => {
        try {
            // Aqui você implementaria a lógica de atualização
            toast.success('Perfil atualizado com sucesso!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Erro ao atualizar perfil');
        }
    };

    return (
        <div className="glass-panel card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>👤 Perfil do Usuário</h2>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        ✏️ Editar
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                {/* Nome */}
                <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        style={{ opacity: isEditing ? 1 : 0.7 }}
                    />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        disabled
                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                    <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        O email não pode ser alterado por questões de segurança
                    </small>
                </div>

                {/* Senha */}
                <div className="form-group">
                    <label>Senha</label>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowPasswordModal(true)}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        🔒 Alterar Senha
                    </button>
                </div>

                {/* Data de Cadastro */}
                <div className="form-group">
                    <label>Membro desde</label>
                    <input
                        type="text"
                        className="form-control"
                        value={user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                        disabled
                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                </div>

                {/* Botões de ação */}
                {isEditing && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            style={{ flex: 1 }}
                        >
                            💾 Salvar Alterações
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: user?.user_metadata?.name || user?.name || '',
                                    email: user?.email || ''
                                });
                            }}
                            style={{ flex: 1 }}
                        >
                            ❌ Cancelar
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de Senha (placeholder) */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '30px' }}>
                        <h2 style={{ marginTop: 0 }}>🔒 Alterar Senha</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Funcionalidade em desenvolvimento...
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowPasswordModal(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
