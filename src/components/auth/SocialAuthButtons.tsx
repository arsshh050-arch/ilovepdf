import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export function SocialAuthButtons() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await signInWithGoogle();
      navigate('/');
    } catch (error: any) {
      console.error("Google sign in failed", error);
      
      const domain = window.location.hostname;
      if (error?.code === 'auth/unauthorized-domain') {
        setAuthError(`This domain (${domain}) is not authorized in your Firebase Auth Console. Please add "${domain}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`);
      } else if (error?.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups for this site or try again.');
      } else if (error?.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed before completing authentication.');
      } else {
        setAuthError(error?.message || 'Google sign-in failed. Please try again or use email login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mb-6 space-y-3">
      {authError && (
        <div className="p-3 rounded-lg bg-[#FFF2F2] border border-[#FFD9D9] text-[#E5322D] text-xs flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-white border border-[#D4D6DE] rounded-[7px] text-[15px] font-[500] text-[#272830] hover:bg-[#F9F9FA] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>
        
        <button 
          disabled
          type="button"
          className="flex-none sm:w-[100px] h-[44px] flex items-center justify-center gap-2 bg-[#F5F6FA] border border-[#E0E2E8] rounded-[7px] text-[15px] font-[500] text-[#999BA3] cursor-not-allowed"
          title="SSO coming soon"
        >
          SSO
        </button>
      </div>
    </div>
  );
}
