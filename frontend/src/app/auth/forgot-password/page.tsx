'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Logo } from '@/app/components/Auth/Logo';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { authApi } from '@/utils/api';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} className="mb-8 text-center">
          <Logo size="lg" />
        </motion.div>

        {/* Card */}
        <motion.div
          variants={fadeInUp}
          className="auth-card"
        >
          {!success ? (
            <>
              <motion.h1
                variants={fadeInUp}
                className="text-2xl font-bold text-text-primary text-center mb-2"
              >
                Forgot Password?
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-text-secondary text-center mb-6"
              >
                Enter your email and we'll send you a link to reset your password.
              </motion.p>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-status-error/10 border border-status-error/20 text-status-error text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={fadeInUp}>
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={setEmail}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                    disabled={loading}
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                  >
                    Send Reset Link
                  </Button>
                </motion.div>
              </form>
            </>
          ) : (
            <>
              <motion.h1
                variants={fadeInUp}
                className="text-2xl font-bold text-text-primary text-center mb-2"
              >
                Check Your Email
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-text-secondary text-center mb-6"
              >
                We've sent a password reset link to{' '}
                <span className="font-medium text-text-primary">{email}</span>.
                Please check your inbox and follow the instructions.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => router.push('/auth/login')}
                >
                  Back to Login
                </Button>

                <div className="text-center text-sm text-text-secondary">
                  Didn't receive the email?{' '}
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="text-accent-orange hover:text-accent-yellow transition-colors font-medium"
                  >
                    Send again
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="mt-6 text-center text-sm text-text-secondary"
        >
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-accent-orange hover:text-accent-yellow transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;