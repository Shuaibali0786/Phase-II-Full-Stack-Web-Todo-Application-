'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import { cn } from '@/lib/cn';
import { logoAnimation } from '@/lib/animations';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { text: 'text-xl', icon: 24, padding: 'p-1.5' },
  md: { text: 'text-3xl', icon: 32, padding: 'p-2' },
  lg: { text: 'text-5xl', icon: 48, padding: 'p-3' },
};

export function Logo({ size = 'md', animated = true, className }: LogoProps) {
  const config = sizeConfig[size];
  const Component = animated ? motion.div : 'div';

  return (
    <Component
      variants={animated ? logoAnimation : undefined}
      initial={animated ? 'initial' : undefined}
      animate={animated ? 'animate' : undefined}
      className={cn('flex items-center justify-center gap-3', className)}
    >
      <motion.div
        className={cn('bg-accent-gradient rounded-xl', config.padding)}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <ListTodo className="text-white" size={config.icon} />
      </motion.div>
      <span className={cn('font-bold gradient-text', config.text)}>
        TaskFlow
      </span>
    </Component>
  );
}

export default Logo;
