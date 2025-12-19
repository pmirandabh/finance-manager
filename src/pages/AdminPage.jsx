import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <div style={{ color: 'white', padding: '20px' }}>Acesso não autorizado.</div>;
    }

    return <AdminDashboard />;
};

export default AdminPage;
