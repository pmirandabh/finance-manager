import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { loggingService, LOG_CATEGORIES, LOG_LEVELS } from '../services/loggingService';
import AuditLogs from './AuditLogs';

// Inline style to fix btn-ghost color
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  .btn-ghost {
    background: transparent !important;
    color: var(--text-secondary) !important;
    border: none !important;
    font-size: 0.9rem !important;
  }
  .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.05) !important;
    color: var(--text-primary) !important;
  }
`;
if (!document.getElementById('btn-ghost-fix')) {
    styleTag.id = 'btn-ghost-fix';
    document.head.appendChild(styleTag);
}

const AdminDashboard = () => {
    const { t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, blocked: 0, unconfirmed: 0 });
    const { user } = useAuth();

    // New state for improvements
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'blocked'
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmModal, setConfirmModal] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'logs'
    const [logsCache, setLogsCache] = useState(null); // Cache for logs
    const USERS_PER_PAGE = 20;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // Fetch all profiles (requires RLS policy)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setUsers(data);

            // Calculate stats (treat null as inactive)
            const total = data.length;
            const active = data.filter(u => u.is_active === true).length;
            const blocked = data.filter(u => u.is_active === false).length;
            const unconfirmed = data.filter(u => u.email_confirmed_at === null).length;

            setStats({ total, active, blocked, unconfirmed });
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(t('admin.updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlockClick = (user) => {
        setConfirmModal({
            user,
            action: user.is_active === true ? 'bloquear' : 'desbloquear'
        });
    };

    const confirmAction = async () => {
        const { user: targetUser, action } = confirmModal;
        setConfirmModal(null);

        try {
            // Optimistic update
            setUsers(users.map(u =>
                u.id === targetUser.id ? { ...u, is_active: !targetUser.is_active } : u
            ));

            const { error } = await supabase
                .from('profiles')
                .update({ is_active: !targetUser.is_active })
                .eq('id', targetUser.id);

            if (error) throw error;

            // Update stats
            setStats(prev => ({
                ...prev,
                active: !targetUser.is_active ? prev.active + 1 : prev.active - 1,
                blocked: !targetUser.is_active ? prev.blocked - 1 : prev.blocked + 1
            }));

            toast.success(action === 'bloquear' ? t('admin.blockSuccess') : t('admin.unblockSuccess'));

            // Log admin action
            await loggingService.logEvent(
                LOG_CATEGORIES.ADMIN,
                'BLOCK_USER',
                {
                    target_user_id: targetUser.id,
                    target_email: targetUser.email,
                    action: action
                },
                LOG_LEVELS.WARN
            );

        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(t('admin.updateError'));
            // Revert optimistic update
            fetchUsers();
        }
    };

    const handleResendConfirmation = async (userEmail) => {
        try {
            // This would require backend implementation
            toast.success(`${t('admin.resendSuccess')} ${userEmail}`);
        } catch (error) {
            toast.error(t('admin.resendError'));
        }
    };

    // Filter and search logic
    const filteredUsers = useMemo(() => {
        let filtered = users;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter === 'active') {
            filtered = filtered.filter(u => u.is_active === true);
        } else if (statusFilter === 'blocked') {
            filtered = filtered.filter(u => u.is_active === false);
        }

        return filtered;
    }, [users, searchTerm, statusFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const formatDate = (dateString) => {
        if (!dateString) return t('admin.never');
        return new Date(dateString).toLocaleString('pt-BR');
    };

    return (
        <div className="admin-dashboard fade-in">


            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                <div className="glass-panel card" style={{ textAlign: 'center', padding: '20px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>{t('admin.totalUsers')}</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.total}</div>
                </div>
                <div className="glass-panel card" style={{ textAlign: 'center', padding: '20px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>{t('admin.activeUsers')}</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#03DAC6' }}>{stats.active}</div>
                </div>
                <div className="glass-panel card" style={{ textAlign: 'center', padding: '20px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>{t('admin.blockedUsers')}</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#CF6679' }}>{stats.blocked}</div>
                </div>
                <div className="glass-panel card" style={{ textAlign: 'center', padding: '20px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>{t('admin.unconfirmedEmail')}</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FFA726' }}>{stats.unconfirmed}</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <button
                    className={`btn btn-ghost ${activeTab === 'users' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('users')}
                    style={{
                        borderBottom: activeTab === 'users' ? '2px solid var(--primary-color)' : 'none',
                        borderRadius: '0',
                        padding: '10px 20px',
                        color: activeTab === 'users' ? 'var(--primary-color)' : 'var(--text-secondary)'
                    }}
                >
                    👥 {t('admin.usersTab')}
                </button>
                <button
                    className={`btn btn-ghost ${activeTab === 'logs' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('logs')}
                    style={{
                        borderBottom: activeTab === 'logs' ? '2px solid var(--primary-color)' : 'none',
                        borderRadius: '0',
                        padding: '10px 20px',
                        color: activeTab === 'logs' ? 'var(--primary-color)' : 'var(--text-secondary)'
                    }}
                >
                    📜 {t('admin.logsTab')}
                </button>
            </div>

            {activeTab === 'logs' ? (
                <AuditLogs cache={logsCache} onCacheUpdate={setLogsCache} />
            ) : (
                /* Users Table */
                <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('admin.manageUsers')}</h2>
                        <button onClick={fetchUsers} className="btn btn-ghost" title={t('admin.refresh')}>
                            🔄 {t('admin.refresh')}
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`🔍 ${t('admin.searchPlaceholder')}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ flex: '1', minWidth: '250px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setStatusFilter('all')}
                                style={{ padding: '8px 16px' }}
                            >
                                {t('admin.all')} ({users.length})
                            </button>
                            <button
                                className={`btn ${statusFilter === 'active' ? 'btn-success' : 'btn-ghost'}`}
                                onClick={() => setStatusFilter('active')}
                                style={{ padding: '8px 16px' }}
                            >
                                {t('admin.active')} ({stats.active})
                            </button>
                            <button
                                className={`btn ${statusFilter === 'blocked' ? 'btn-danger' : 'btn-ghost'}`}
                                onClick={() => setStatusFilter('blocked')}
                                style={{ padding: '8px 16px' }}
                            >
                                {t('admin.blocked')} ({stats.blocked})
                            </button>
                        </div>
                    </div>

                    {/* Results info */}
                    <div style={{ marginBottom: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {t('admin.showing')} {paginatedUsers.length > 0 ? (currentPage - 1) * USERS_PER_PAGE + 1 : 0} - {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} {t('admin.of')} {filteredUsers.length} {t('admin.users')}
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>{t('admin.loading')}</div>
                    ) : paginatedUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            {t('admin.noUsers')}
                        </div>
                    ) : (
                        <>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '15px', color: 'var(--text-secondary)' }}>{t('admin.user')}</th>
                                        <th style={{ textAlign: 'left', padding: '15px', color: 'var(--text-secondary)' }}>{t('admin.email')}</th>
                                        <th style={{ textAlign: 'left', padding: '15px', color: 'var(--text-secondary)' }}>{t('admin.registered')}</th>
                                        <th style={{ textAlign: 'left', padding: '15px', color: 'var(--text-secondary)' }}>{t('admin.lastAccess')}</th>
                                        <th style={{ textAlign: 'center', padding: '15px', color: 'var(--text-secondary)' }}>{t('admin.status')}</th>
                                        <th style={{ textAlign: 'center', padding: '15px', color: 'var(--text-secondary)' }}>{t('admin.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{u.name || t('admin.noName')}</div>
                                                <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
                                                    {u.email === user.email && <span style={{ fontSize: '0.7rem', background: 'rgba(187, 134, 252, 0.2)', color: '#BB86FC', padding: '2px 6px', borderRadius: '4px' }}>{t('admin.you')}</span>}
                                                    {u.email_confirmed_at === null && (
                                                        <span style={{ fontSize: '0.7rem', background: 'rgba(255, 167, 38, 0.2)', color: '#FFA726', padding: '2px 6px', borderRadius: '4px' }}>
                                                            ⚠️ {t('admin.emailNotConfirmed')}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{u.email}</td>
                                            <td style={{ padding: '15px', fontSize: '0.9rem' }}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                                            <td style={{ padding: '15px', fontSize: '0.9rem' }}>{formatDate(u.last_login)}</td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    background: u.is_active === true ? 'rgba(3, 218, 198, 0.1)' : 'rgba(207, 102, 121, 0.1)',
                                                    color: u.is_active === true ? '#03DAC6' : '#CF6679',
                                                    border: `1px solid ${u.is_active === true ? 'rgba(3, 218, 198, 0.3)' : 'rgba(207, 102, 121, 0.3)'}`
                                                }}>
                                                    {u.is_active === true ? t('admin.statusActive') : t('admin.statusBlocked')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                    {u.email !== user.email && (
                                                        <button
                                                            onClick={() => handleBlockClick(u)}
                                                            className={`btn ${u.is_active === true ? 'btn-danger' : 'btn-success'}`}
                                                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                        >
                                                            {u.is_active === true ? `🚫 ${t('admin.block')}` : `✅ ${t('admin.unblock')}`}
                                                        </button>
                                                    )}
                                                    {u.email_confirmed_at === null && (
                                                        <button
                                                            onClick={() => handleResendConfirmation(u.email)}
                                                            className="btn btn-ghost"
                                                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                            title={t('admin.resendConfirmation')}
                                                        >
                                                            📧
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        style={{ padding: '8px 16px' }}
                                    >
                                        ← {t('admin.previous')}
                                    </button>
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        {t('admin.page')} {currentPage} {t('admin.of')} {totalPages}
                                    </span>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        style={{ padding: '8px 16px' }}
                                    >
                                        {t('admin.next')} →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="modal-overlay" onClick={() => setConfirmModal(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '30px' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{t('admin.confirmAction')}</h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: '25px' }}>
                            {t('admin.confirmMessage')} <strong style={{ color: confirmModal.action === 'bloquear' ? '#CF6679' : '#03DAC6' }}>{confirmModal.action === 'bloquear' ? t('admin.confirmBlock') : t('admin.confirmUnblock')}</strong> {t('admin.theUser')}
                        </p>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{confirmModal.user.name}</div>
                            <div style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>{confirmModal.user.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary" onClick={() => setConfirmModal(null)}>
                                {t('admin.cancel')}
                            </button>
                            <button
                                className={`btn ${confirmModal.action === 'bloquear' ? 'btn-danger' : 'btn-success'}`}
                                onClick={confirmAction}
                            >
                                {confirmModal.action === 'bloquear' ? t('admin.confirmBlockAction') : t('admin.confirmUnblockAction')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
