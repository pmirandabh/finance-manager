import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const MonthFilter = ({ currentMonth, onMonthChange }) => {
    const { t } = useLanguage();
    const formatMonth = (date) => {
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    const goToPreviousMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        onMonthChange(newDate);
    };

    const goToNextMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        onMonthChange(newDate);
    };

    const goToCurrentMonth = () => {
        onMonthChange(new Date());
    };

    const isCurrentMonth = () => {
        const now = new Date();
        return currentMonth.getMonth() === now.getMonth() &&
            currentMonth.getFullYear() === now.getFullYear();
    };

    return (
        <div className="month-filter" style={{ padding: '10px 20px', marginBottom: '20px' }}>
            <button className="btn btn-secondary btn-sm" onClick={goToPreviousMonth} style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                <span className="desktop-text">{t('monthFilter.previous')}</span>
                <span className="mobile-icon">◀</span>
            </button>
            <div className="month-display">
                <span className="month-name" style={{ fontSize: '1.2rem' }}>{formatMonth(currentMonth)}</span>
                {!isCurrentMonth() && (
                    <button className="btn-link" onClick={goToCurrentMonth} style={{ fontSize: '0.8rem' }}>
                        {t('monthFilter.backToToday')}
                    </button>
                )}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={goToNextMonth} style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                <span className="desktop-text">{t('monthFilter.next')}</span>
                <span className="mobile-icon">▶</span>
            </button>
        </div>
    );
};

export default MonthFilter;
