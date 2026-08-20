import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';
import { AuthInput, PasswordInput } from '../../components/auth/AuthInputs';
import { SEO } from '../../components/SEO';
import { buildBreadcrumbSchema } from '../../seo/schema';

export function Login() {
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle redirect from protected routes
  const from = (location.state as any)?.from?.pathname || '/user/workflows'; // We'll just default to / for now if no workflow exists
  const redirectTarget = from === '/login' || from === '/signup' ? '/' : from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signInWithEmail(email.trim().toLowerCase(), password);
      
      // Prevent open redirect by only allowing relative paths (start with /)
      if (redirectTarget.startsWith('/')) {
        navigate(redirectTarget, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error("Login error", err);
      // Generic error message for security
      setError('Email or password is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      illustrationTitle="Your PDF workspace, ready when you are"
      illustrationDescription="Access your saved preferences and PDF tools from one convenient workspace."
    >
      <SEO
        title="Login | ilovepdf.in"
        description="Sign in to your ilovepdf.in account to access your PDF workspace and online document tools."
        canonicalPath="/login"
        noIndex={true}
        schema={[buildBreadcrumbSchema([{ name: 'Login', path: '/login' }], '/login')]}
      />

      <h1 className="text-[28px] font-[600] text-[#272830] mb-8 text-center md:text-left">
        Login to your account
      </h1>

      <SocialAuthButtons />

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#E0E2E8]"></div>
        <span className="text-[13px] font-[500] text-[#999BA3] uppercase tracking-wider">OR</span>
        <div className="flex-1 h-px bg-[#E0E2E8]"></div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <AuthInput
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <PasswordInput
          label="Password"
          name="password"
          icon={Lock}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <div className="flex justify-end mb-6 -mt-2">
          <Link to="/forgot-password" className="text-[13.5px] font-[500] text-[#E5322D] hover:underline">
            Forgot your password?
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-[#FFF2F2] border border-[#FFD9D9] text-[#E5322D] text-[14px]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] flex items-center justify-center gap-2 bg-[#E5322D] text-white rounded-[7px] text-[15px] font-[600] hover:bg-[#d42d28] transition-colors disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Logging in...
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-[14.5px] text-[#686B74]">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#E5322D] font-[500] hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
