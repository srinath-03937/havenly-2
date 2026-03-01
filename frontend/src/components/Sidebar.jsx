import { useState } from 'react';
import { Menu, X, LogOut, Home, Users, AlertCircle, FileText, DollarSign, Bell, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { label: 'Dashboard', icon: Home, path: '/admin' },
    { label: 'Rooms', icon: Users, path: '/admin/rooms' },
    { label: 'Complaints', icon: AlertCircle, path: '/admin/complaints' },
    { label: 'Transactions', icon: DollarSign, path: '/admin/transactions' },
    { label: 'Notices', icon: FileText, path: '/admin/notices' }
  ];

  const studentLinks = [
    { label: 'Dashboard', icon: Home, path: '/student' },
    { label: 'Rooms', icon: Building2, path: '/student/rooms' },
    { label: 'Payments', icon: DollarSign, path: '/student/payments' },
    { label: 'Complaints', icon: AlertCircle, path: '/student/complaints' },
    { label: 'Notices', icon: FileText, path: '/student/notices' }
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    setIsOpen(false);
    // Close mobile menu after navigation
    if (window.innerWidth < 768) {
      document.body.style.overflow = 'auto';
    }
  };

  const toggleMenu = () => {
    // Desktop: sidebar is always visible, no toggle needed
    if (window.innerWidth >= 768) {
      return;
    }

    setIsOpen((prev) => {
      const next = !prev;
      // Prevent body scroll when menu is open on mobile
      document.body.style.overflow = next ? 'hidden' : 'auto';
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMenu}
        className="fixed-mobile z-50 bg-indigo-600 text-white p-3 rounded-lg shadow-lg md:hidden"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="nav-mobile md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`nav-sidebar-mobile ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:z-auto md:h-full md:w-64 md:overflow-y-auto md:flex-shrink-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-indigo-400">Havenly</h1>
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-indigo-300 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6 p-4 bg-slate-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-indigo-300 text-sm capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(link.path)
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'hover:bg-slate-800 text-slate-100 hover:text-white'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`flex-shrink-0 ${
                    isActive(link.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span className="font-medium">{link.label}</span>
                {isActive(link.path) && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 text-white font-medium group"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Footer Info */}
        <div className="mt-6 pt-4 border-t border-slate-700 md:hidden">
          <div className="text-center text-slate-400 text-xs">
            <p>Havenly Hostel Management</p>
            <p className="mt-1">Version 1.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
