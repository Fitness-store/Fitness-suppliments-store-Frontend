import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/useAdminAuth';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
