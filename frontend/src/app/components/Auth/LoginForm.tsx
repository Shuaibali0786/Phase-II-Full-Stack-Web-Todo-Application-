'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Logo } from './Logo';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/dashboard',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Check if user just registered (per spec clarification 2026-01-17)
  const justRegistered = searchParams.get('registered') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onSuccess?.();
      router.push(redirectTo);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <motion.h1
          variants={fadeInUp}
          className="text-2xl font-bold text-text-primary text-center mb-6"
        >
          Welcome Back 
        </motion.h1>

        {/* Success message after registration */}
        {justRegistered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success text-sm flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Account created successfully! Please log in.</span>
          </motion.div>
        )}

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
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-accent-orange hover:text-accent-yellow transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>
          </motion.div>
        </form>

        <motion.p
          variants={fadeInUp}
          className="mt-6 text-center text-sm text-text-secondary"
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="text-accent-orange hover:text-accent-yellow transition-colors font-medium"
          >
            Register here
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
