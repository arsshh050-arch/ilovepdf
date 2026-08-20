import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthInput } from '../../components/auth/AuthInputs';
import { SEO } from '../../components/SEO';
import { buildBreadcrumbSchema } from '../../seo/schema';

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await resetPassword(email.trim().toLowerCase());
      setSuccess(true);
    } catch (err: any) {
      console.error("Reset error", err);
      // For security, always return neutral success on the frontend, even if the user wasn't found in Firebase Auth.
      // Alternatively, Firebase handles this naturally but we can force success state to prevent email enumeration.
      setSuccess(true);
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
        title="Reset Password | ilovepdf.in"
        description="Reset your ilovepdf.in password."
        canonicalPath="/forgot-password"
        noIndex={true}
        schema={[buildBreadcrumbSchema([{ name: 'Reset Password', path: '/forgot-password' }], '/forgot-password')]}
      />

      <div className="mb-6">
        <Link to="/login" className="inline-flex items-center text-[14px] font-[500] text-[#686B74] hover:text-[#272830] transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to login
        </Link>
      </div>

      <h1 className="text-[28px] font-[600] text-[#272830] mb-3 text-center md:text-left">
        Reset your password
      </h1>

      {success ? (
        <div className="mt-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-[#34A853]">
            <CheckCircle2 size={24} />
            <span className="text-[16px] font-[600]">Reset link sent</span>
          </div>
          <p className="text-[15px] text-[#686B74] leading-relaxed mb-8">
            If an account exists for <strong>{email}</strong>, a password reset link has been sent. Please check your inbox and spam folder.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }}
            className="text-[#E5322D] font-[500] text-[15px] hover:underline"
          >
            Try another email address
          </button>
        </div>
      ) : (
        <>
          <p className="text-[15px] text-[#686B74] mb-8 text-center md:text-left">
            Enter your email address and we'll send you a password reset link.
          </p>

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

            {error && (
              <div className="mb-4 p-3 rounded-md bg-[#FFF2F2] border border-[#FFD9D9] text-[#E5322D] text-[14px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-[46px] flex items-center justify-center gap-2 bg-[#E5322D] text-white rounded-[7px] text-[15px] font-[600] hover:bg-[#d42d28] transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
