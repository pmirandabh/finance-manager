import React, { useState, useEffect } from 'react';
import { loggingService, LOG_CATEGORIES } from '../services/loggingService';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const AuditLogs = ({ cache, onCacheUpdate }) => {
    const { t } = useLanguage();
    const [logs, setLogs] = useState(cache?.logs || []);
    const [isLoading, setIsLoading] = useState(!cache);
    const [page, setPage] = useState(cache?.page || 1);
    const [totalLogs, setTotalLogs] = useState(cache?.totalLogs || 0);
    const [filters, setFilters] = useState(cache?.filters || { category: 'all', period: 'all', search: '' });
    const [searchInput, setSearchInput] = useState('');

    const LOGS_PER_PAGE = 50;

    useEffect(() => {
        // Only fetch if we don't have cache or filters/page changed
        if (!cache || cache.page !== page ||
            cache.filters.category !== filters.category ||
            cache.filters.period !== filters.period ||
            cache.filters.search !== filters.search) {
            fetchLogs();
        }
    }, [page, filters]);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            // Fetch all logs with category filter
            const categoryFilter = filters.category === 'all' ? {} : { category: filters.category };
            const { data: allLogs } = await loggingService.getLogs(categoryFilter, 1, 10000);

            // Apply period filter
            let filteredLogs = allLogs;
            if (filters.period !== 'all') {
                const now = new Date();
                let cutoffDate;

                switch (filters.period) {
                    case '1h':
                        cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
                        break;
                    case 'today':
                        cutoffDate = new Date(now.setHours(0, 0, 0, 0));
                        break;
                    case '7d':
                        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case '30d':
                        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                }

                if (cutoffDate) {
                    filteredLogs = filteredLogs.filter(log => new Date(log.created_at) >= cutoffDate);
                }
            }

            // Apply search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredLogs = filteredLogs.filter(log =>
                    log.description?.toLowerCase().includes(searchLower) ||
                    log.action?.toLowerCase().includes(searchLower) ||
                    log.user_id?.toLowerCase().includes(searchLower)
                );
            }

            // Paginate
            const totalCount = filteredLogs.length;
            const startIndex = (page - 1) * LOGS_PER_PAGE;
            const paginatedLogs = filteredLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);

            setLogs(paginatedLogs);
            setTotalLogs(totalCount);

            // Update cache in parent
            onCacheUpdate({
                logs: paginatedLogs,
                totalLogs: totalCount,
                page,
                filters
            });
        } catch (error) {
            toast.error(t('auditLogs.errorLoading'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (value) => {
        setFilters(prev => ({ ...prev, category: value }));
        setPage(1);
    };

    const handlePeriodChange = (value) => {
        setFilters(prev => ({ ...prev, period: value }));
        setPage(1);
    };

    const handleSearchChange = (value) => {
        setSearchInput(value);
        // Debounce search
        const timeoutId = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: value }));
            setPage(1);
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    const totalPages = Math.ceil(totalLogs / LOGS_PER_PAGE);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'AUTH': return '🔐';
            case 'FINANCE': return '💰';
            case 'ADMIN': return '🛡️';
            case 'DATA': return '📊';
            default: return '📋';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'AUTH': return '#03DAC6';
            case 'FINANCE': return '#FFA726';
            case 'ADMIN': return '#CF6679';
            case 'DATA': return '#BB86FC';
            default: return 'var(--text-secondary)';
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'ERROR':
            case 'CRITICAL': return '#CF6679';
            case 'WARN': return '#FFA726';
            default: return '#03DAC6';
        }
    };

    return (
        <div className="audit-logs fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>📜 {t('auditLogs.title')}</h2>
                <button onClick={fetchLogs} className="btn btn-ghost" title={t('auditLogs.refresh')}>
                    🔄 {t('auditLogs.refresh')}
                </button>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder={`🔍 ${t('auditLogs.searchPlaceholder')}`}
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    style={{ width: '100%', maxWidth: '600px' }}
                />
            </div>

            {/* Period Filter */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '5px' }}>📅 {t('auditLogs.period')}</span>
                <button
                    className={`btn ${filters.period === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handlePeriodChange('all')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    {t('auditLogs.all')}
                </button>
                <button
                    className={`btn ${filters.period === '1h' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handlePeriodChange('1h')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    {t('auditLogs.lastHour')}
                </button>
                <button
                    className={`btn ${filters.period === 'today' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handlePeriodChange('today')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    {t('auditLogs.today')}
                </button>
                <button
                    className={`btn ${filters.period === '7d' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handlePeriodChange('7d')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    {t('auditLogs.last7Days')}
                </button>
                <button
                    className={`btn ${filters.period === '30d' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handlePeriodChange('30d')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    {t('auditLogs.last30Days')}
                </button>
            </div>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '5px' }}>🏷️ {t('auditLogs.category')}</span>
                <button
                    className={`btn ${filters.category === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleCategoryChange('all')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    📋 {t('auditLogs.allCategories')}
                </button>
                <button
                    className={`btn ${filters.category === 'FINANCE' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleCategoryChange('FINANCE')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    💰 {t('auditLogs.finance')}
                </button>
                <button
                    className={`btn ${filters.category === 'AUTH' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleCategoryChange('AUTH')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    🔐 {t('auditLogs.security')}
                </button>
                <button
                    className={`btn ${filters.category === 'ADMIN' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleCategoryChange('ADMIN')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    🛡️ {t('auditLogs.admin')}
                </button>
                <button
                    className={`btn ${filters.category === 'DATA' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleCategoryChange('DATA')}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    📊 {t('auditLogs.data')}
                </button>
            </div>

            {/* Table */}
            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>{t('auditLogs.loading')}</div>
                ) : logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        {t('auditLogs.noLogs')}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ textAlign: 'left', padding: '12px 15px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('auditLogs.dateTime')}</th>
                                <th style={{ textAlign: 'center', padding: '12px 15px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('auditLogs.categoryColumn')}</th>
                                <th style={{ textAlign: 'left', padding: '12px 15px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('auditLogs.description')}</th>
                                <th style={{ textAlign: 'left', padding: '12px 15px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('auditLogs.user')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '12px 15px', fontSize: '0.85rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                                        {new Date(log.created_at).toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            background: `${getCategoryColor(log.category)}20`,
                                            color: getCategoryColor(log.category),
                                            border: `1px solid ${getCategoryColor(log.category)}40`,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            {getCategoryIcon(log.category)} {log.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 15px', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {log.level === 'WARN' && <span style={{ color: getLevelColor(log.level) }}>⚠️</span>}
                                            {(log.level === 'ERROR' || log.level === 'CRITICAL') && <span style={{ color: getLevelColor(log.level) }}>❌</span>}
                                            <span>{log.description || log.action}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {log.user_id ? `${t('auditLogs.user')} ${log.user_id.substring(0, 8)}...` : t('auditLogs.system')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ padding: '8px 16px' }}
                    >
                        ← {t('auditLogs.previous')}
                    </button>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {t('auditLogs.page')} {page} {t('auditLogs.of')} {totalPages}
                    </span>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{ padding: '8px 16px' }}
                    >
                        {t('auditLogs.next')} →
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;
