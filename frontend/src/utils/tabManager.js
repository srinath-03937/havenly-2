// Tab management utilities for multi-tab authentication

// Get or create current tab ID
export const getCurrentTabId = () => {
  let tabId = sessionStorage.getItem('currentTabId');
  if (!tabId) {
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('currentTabId', tabId);
  }
  return tabId;
};

// Get auth token for current tab
export const getCurrentTabToken = () => {
  const tabId = getCurrentTabId();
  return localStorage.getItem(`token_${tabId}`) || 
         sessionStorage.getItem('token') || 
         localStorage.getItem('token');
};

// Get auth user for current tab
export const getCurrentTabUser = () => {
  const tabId = getCurrentTabId();
  return localStorage.getItem(`user_${tabId}`) || 
         sessionStorage.getItem('user') || 
         localStorage.getItem('user');
};

// Clear current tab auth
export const clearCurrentTabAuth = () => {
  const tabId = getCurrentTabId();
  
  // Clear tab-specific data
  localStorage.removeItem(`token_${tabId}`);
  localStorage.removeItem(`user_${tabId}`);
  
  // Clear general data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Clear sessionStorage data
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem(`user_${tabId}`);
  sessionStorage.removeItem('currentTabId');
  
  // Clear any other auth-related keys
  Object.keys(localStorage).forEach(key => {
    if (key.includes('token') || key.includes('user') || key.includes('auth')) {
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage).forEach(key => {
    if (key.includes('token') || key.includes('user') || key.includes('auth') || key.includes('tab')) {
      sessionStorage.removeItem(key);
    }
  });
};
