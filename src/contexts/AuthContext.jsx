import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, sessionManager } from '@/services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored session first
        const storedSession = sessionManager.getStoredSession();
        if (storedSession) {
          setUser(storedSession.user);
          setIsAdmin(storedSession.isAdmin);
        }

        // Set up Firebase auth state listener
        const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in
            const userData = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || '/api/placeholder/100/100',
              provider: firebaseUser.providerData[0]?.providerId || 'email'
            };

            const adminStatus = authService.isAdminUser(firebaseUser.email);
            const token = await firebaseUser.getIdToken();

            setUser(userData);
            setIsAdmin(adminStatus);

            // Store session
            sessionManager.storeSession(userData, adminStatus, token);
          } else {
            // User is signed out
            setUser(null);
            setIsAdmin(false);
            sessionManager.clearSession();
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    const unsubscribe = initializeAuth();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Google OAuth login
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await authService.signInWithGoogle();
      
      setUser(result.user);
      setIsAdmin(result.isAdmin);
      
      // Store session
      sessionManager.storeSession(result.user, result.isAdmin, result.token);

      if (result.isAdmin) {
        toast.success('Admin login successful! Welcome to AliBix Admin Panel.');
      } else {
        toast.success(`Welcome back, ${result.user.name}!`);
      }

      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password login
  const signInWithEmailPassword = async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.signInWithEmailPassword(email, password);
      
      setUser(result.user);
      setIsAdmin(result.isAdmin);
      
      // Store session
      sessionManager.storeSession(result.user, result.isAdmin, result.token);

      toast.success(`Welcome back, ${result.user.name}!`);
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password signup
  const signUpWithEmailPassword = async (email, password, name) => {
    try {
      setLoading(true);
      const result = await authService.signUpWithEmailPassword(email, password, name);
      
      setUser(result.user);
      setIsAdmin(result.isAdmin);
      
      // Store session
      sessionManager.storeSession(result.user, result.isAdmin, result.token);

      toast.success(`Welcome to AliBix, ${name}! Your account has been created.`);
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      
      setUser(null);
      setIsAdmin(false);
      sessionManager.clearSession();

      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if current user is admin
  const isAdminUser = (email) => {
    return authService.isAdminUser(email);
  };

  // Get current auth token
  const getAuthToken = async () => {
    try {
      return await authService.getUserToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const value = {
    // State
    user,
    isAdmin,
    loading,
    isAuthenticated,

    // Actions
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signOut,

    // Utilities
    isAdminUser,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;