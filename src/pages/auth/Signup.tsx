import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';
import { AuthInput, PasswordInput } from '../../components/auth/AuthInputs';
import { SEO } from '../../components/SEO';
import { buildBreadcrumbSchema } from '../../seo/schema';

export function Signup() {
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password validation logic
  const isPasswordStrong = (pass: string) => {
    const hasLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    return hasLength && hasUpper && hasLower && hasNumber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isPasswordStrong(password)) {
      setError('Password must contain at least 8 characters, one uppercase, one lowercase, and one number.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await signUpWithEmail(email.trim().toLowerCase(), password, name.trim());
      navigate('/');
    } catch (err: any) {
      console.error("Signup error", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      illustrationTitle="PDF tools built for productive work"
      illustrationDescription="Convert, organize, edit and protect PDF files with a simple set of online tools."
    >
      <SEO
        title="Create Account | ilovepdf.in"
        description="Create your ilovepdf.in account and access convenient online PDF tools from your workspace."
        canonicalPath="/signup"
        noIndex={true}
        schema={[buildBreadcrumbSchema([{ name: 'Sign Up', path: '/signup' }], '/signup')]}
      />

      <h1 className="text-[28px] font-[600] text-[#272830] mb-8 text-center md:text-left">
        Create your account
      </h1>

      <SocialAuthButtons />

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#E0E2E8]"></div>
        <span className="text-[13px] font-[500] text-[#999BA3] uppercase tracking-wider">OR</span>
        <div className="flex-1 h-px bg-[#E0E2E8]"></div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <AuthInput
          label="Full name"
          name="name"
          type="text"
          icon={User}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
        />

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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
        />

        {password && !isPasswordStrong(password) && (
          <div className="mb-4 text-[12px] text-[#686B74]">
            <ul className="list-disc pl-4 space-y-1">
              <li className={password.length >= 8 ? "text-[#34A853]" : ""}>At least 8 characters</li>
              <li className={/[A-Z]/.test(password) ? "text-[#34A853]" : ""}>At least one uppercase letter</li>
              <li className={/[a-z]/.test(password) ? "text-[#34A853]" : ""}>At least one lowercase letter</li>
              <li className={/[0-9]/.test(password) ? "text-[#34A853]" : ""}>At least one number</li>
            </ul>
          </div>
        )}

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          icon={Lock}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
        />

        {error && (
          <div className="mb-4 p-3 rounded-md bg-[#FFF2F2] border border-[#FFD9D9] text-[#E5322D] text-[14px]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!!password && !isPasswordStrong(password))}
          className="w-full mt-2 h-[46px] flex items-center justify-center gap-2 bg-[#E5322D] text-white rounded-[7px] text-[15px] font-[600] hover:bg-[#d42d28] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
        
        <p className="mt-4 text-[12px] text-center text-[#999BA3] leading-relaxed">
          By creating an account, you agree to our <Link to="/" className="underline hover:text-[#272830]">Terms of Service</Link> and <Link to="/" className="underline hover:text-[#272830]">Privacy Policy</Link>.
        </p>
      </form>

      <p className="mt-8 text-center text-[14.5px] text-[#686B74]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#E5322D] font-[500] hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
