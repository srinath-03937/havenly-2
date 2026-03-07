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
    return null;
  }

  // For regular admins, render the children normally
  return children;
};

export default AdminRouteWrapper;
