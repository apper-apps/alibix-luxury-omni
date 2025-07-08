import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ApperIcon from '@/components/ApperIcon';

const ProtectedRoute = ({ children, requireAdmin = false, redirectTo = '/profile' }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <ApperIcon name="Loader2" size={48} className="text-primary mx-auto" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center p-8 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg max-w-md mx-4">
          <ApperIcon name="Lock" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This area is restricted to authorized administrators only.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Only <strong>alibix07@gmail.com</strong> can access the admin panel.
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Go Back
            </button>
            <Navigate to="/" replace />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;