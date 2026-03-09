import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const TabConflictAlert = ({ onRefresh }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth_logout') {
        setMessage('You have been logged out from another tab.');
        setShow(true);
      }
      // Remove auth_login conflict detection - allow different accounts in different tabs
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">Session Ended</h3>
            <p className="text-sm text-amber-700 mt-1">{message}</p>
            <div className="mt-3">
              <button
                onClick={onRefresh}
                className="inline-flex items-center px-3 py-1.5 border border-amber-300 shadow-sm text-xs font-medium rounded text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <RefreshCw size={12} className="mr-1" />
                Refresh Page
              </button>
            </div>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-amber-400 hover:text-amber-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabConflictAlert;
