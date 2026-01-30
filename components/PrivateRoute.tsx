import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const PrivateRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return user ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
