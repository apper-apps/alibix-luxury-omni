import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Admin email constant
const ADMIN_EMAIL = 'alibix07@gmail.com';

// Authentication service
export const authService = {
  // Google OAuth login
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL || '/api/placeholder/100/100',
        provider: 'google'
      };

      // Check if user is admin
      const isAdmin = user.email === ADMIN_EMAIL;
      
      return {
        user: userData,
        isAdmin,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Email/Password sign in
  async signInWithEmailPassword(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        name: user.displayName || 'Customer',
        email: user.email,
        avatar: user.photoURL || '/api/placeholder/100/100',
        provider: 'email'
      };

      // Email login is only for customers (not admin)
      const isAdmin = false;
      
      return {
        user: userData,
        isAdmin,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Email/Password sign up
  async signUpWithEmailPassword(email, password, name) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update profile with name
      await user.updateProfile({
        displayName: name
      });

      const userData = {
        uid: user.uid,
        name: name,
        email: user.email,
        avatar: '/api/placeholder/100/100',
        provider: 'email'
      };

      // New users are customers by default
      const isAdmin = false;
      
      return {
        user: userData,
        isAdmin,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Sign-up error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw new Error('Failed to sign out');
    }
  },

  // Check admin access
  isAdminUser(email) {
    return email === ADMIN_EMAIL;
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Auth state observer
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get user token
  async getUserToken() {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  // Error message mapping
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/popup-blocked': 'Pop-up was blocked by browser. Please allow pop-ups.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/internal-error': 'Internal error occurred. Please try again.',
      'auth/invalid-credential': 'Invalid credentials provided.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/requires-recent-login': 'Please sign in again to continue.',
      'auth/credential-already-in-use': 'This credential is already associated with another account.'
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }
};

// Session management utilities
export const sessionManager = {
  // Store user session
  storeSession(user, isAdmin, token) {
    localStorage.setItem('alibix-user', JSON.stringify(user));
    localStorage.setItem('alibix-is-admin', isAdmin.toString());
    localStorage.setItem('alibix-auth-token', token);
    localStorage.setItem('alibix-session-timestamp', Date.now().toString());
  },

  // Get stored session
  getStoredSession() {
    try {
      const user = localStorage.getItem('alibix-user');
      const isAdmin = localStorage.getItem('alibix-is-admin');
      const token = localStorage.getItem('alibix-auth-token');
      const timestamp = localStorage.getItem('alibix-session-timestamp');

      if (user && isAdmin !== null && token && timestamp) {
        // Check if session is still valid (24 hours)
        const sessionAge = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge < maxAge) {
          return {
            user: JSON.parse(user),
            isAdmin: isAdmin === 'true',
            token,
            timestamp: parseInt(timestamp)
          };
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
    return null;
  },

  // Clear session
  clearSession() {
    localStorage.removeItem('alibix-user');
    localStorage.removeItem('alibix-is-admin');
    localStorage.removeItem('alibix-auth-token');
    localStorage.removeItem('alibix-session-timestamp');
  },

  // Check if session exists
  hasValidSession() {
    return this.getStoredSession() !== null;
  }
};

export default authService;