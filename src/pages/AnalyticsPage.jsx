import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Analytics from '../components/Analytics';

const AnalyticsPage = () => {
    const { transactions, categories } = useOutletContext();
    return <Analytics transactions={transactions} categories={categories} />;
};

export default AnalyticsPage;
