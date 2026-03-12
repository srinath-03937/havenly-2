// Utility to migrate from localStorage to sessionStorage for tab-specific auth
export const migrateAuthToSessionStorage = () => {
  try {
    // Check if there's existing localStorage auth data
    const localToken = localStorage.getItem('token');
    const localUser = localStorage.getItem('user');
    
    if (localToken && localUser) {
      // Clear localStorage to prevent cross-tab issues
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Store in sessionStorage for current tab
      sessionStorage.setItem('token', localToken);
      sessionStorage.setItem('user', localUser);
      
      console.log('Migrated auth from localStorage to sessionStorage');
    }
    
    // Clear only logout auth event data (keep login events for future use)
    localStorage.removeItem('auth_logout');
  } catch (error) {
    console.error('Error migrating auth data:', error);
  }
};

// Utility to clear all auth data across all storage
export const clearAllAuthData = () => {
  // Clear sessionStorage (current tab)
  sessionStorage.clear();
  
  // Clear localStorage (cross-tab events)
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth_logout');
  // Keep auth_login for potential future cross-tab features
};
