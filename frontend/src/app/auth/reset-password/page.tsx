'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Logo } from '@/app/components/Auth/Logo';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { authApi } from '@/utils/api';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authApi.resetPassword({ token: token!, new_password: password });
      setSuccess(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to reset password. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="auth-card p-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">Invalid Reset Link</h2>
            <p className="text-text-secondary mb-6">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/auth/forgot-password">
              <Button variant="primary" fullWidth>
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                Reset Your Password
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-text-secondary text-center mb-6"
              >
                Enter your new password below.
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
                    id="password"
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={setPassword}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-muted hover:text-text-secondary"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                    minLength={8}
                    disabled={loading}
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Input
                    id="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-text-muted hover:text-text-secondary"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
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
                    Reset Password
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
                Password Reset Successful
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-text-secondary text-center mb-6"
              >
                Your password has been successfully reset. You can now log in with your new password.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => router.push('/auth/login')}
                >
                  Go to Login
                </Button>
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

export default ResetPasswordPage;