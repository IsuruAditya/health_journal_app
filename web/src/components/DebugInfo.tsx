import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const DebugInfo: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (import.meta.env.VITE_NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs">
      <div>Path: {location.pathname}</div>
      <div>Auth: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user?.email || 'None'}</div>
    </div>
  );
};

export default DebugInfo;