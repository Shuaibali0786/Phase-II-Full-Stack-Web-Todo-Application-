'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Logo } from './Logo';
import { PasswordStrength, isPasswordValid } from './PasswordStrength';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  redirectTo = '/dashboard',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (!isPasswordValid(password)) {
      setError('Password does not meet all requirements');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email,
        password,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      };
      const result = await register(userData);

      // Per spec clarification (2026-01-17): Redirect to login page with success message
      // Do NOT auto-login - user must manually log in after registration
      if (result.success) {
        router.push('/auth/login?registered=true');
      }
    } catch (err) {
      setError('Registration failed. Email may already be in use.');
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
          Create Account
        </motion.h1>

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
          {/* Name fields in a row */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              label="First Name"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={setFirstName}
              leftIcon={<User className="w-4 h-4" />}
              disabled={loading}
            />
            <Input
              id="lastName"
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={setLastName}
              disabled={loading}
            />
          </motion.div>

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
              placeholder="Create a secure password"
              value={password}
              onChange={setPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              disabled={loading}
            />
          </motion.div>

          {/* Password strength indicator */}
          {password && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <PasswordStrength password={password} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp}>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={!isPasswordValid(password)}
            >
              Create Account
            </Button>
          </motion.div>
        </form>

        <motion.p
          variants={fadeInUp}
          className="mt-6 text-center text-sm text-text-secondary"
        >
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-accent-orange hover:text-accent-yellow transition-colors font-medium"
          >
            Sign in here
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;
