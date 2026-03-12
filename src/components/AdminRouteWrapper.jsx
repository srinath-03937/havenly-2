import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRouteWrapper = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If Super Admin tries to access regular admin routes, redirect to Super Admin panel
    if (user?.email === 'gajula@gmail.com' && user?.role === 'admin') {
      navigate('/admin/super-admin');
    }
  }, [user, navigate]);

  // If it's the Super Admin, don't render the children (they'll be redirected)
  if (user?.email === 'gajula@gmail.com' && user?.role === 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // For regular admins, render the children normally
  return children;
};

export default AdminRouteWrapper;
