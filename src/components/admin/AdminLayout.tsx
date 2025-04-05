
import React from 'react';
import AdminSidebar from './AdminSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute requiresAdmin={true}>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
