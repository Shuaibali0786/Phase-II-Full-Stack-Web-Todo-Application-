import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, MotionValue } from 'framer-motion';

interface UseAnimatedCounterOptions {
  duration?: number;
  delay?: number;
  enabled?: boolean;
}

/**
 * Hook for animating numeric values with smooth transitions
 * Uses Framer Motion for spring-based animations
 */
export function useAnimatedCounter(
  value: number,
  options: UseAnimatedCounterOptions = {}
): MotionValue<number> {
  const { duration = 0.8, delay = 0, enabled = true } = options;
  const motionValue = useMotionValue(0);
  const previousValue = useRef(0);

  useEffect(() => {
    if (!enabled) {
      motionValue.set(value);
      return;
    }

    // Only animate if value actually changed
    if (previousValue.current === value) {
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: 'easeOut',
    });

    previousValue.current = value;

    return () => controls.stop();
  }, [value, duration, delay, enabled, motionValue]);

  return motionValue;
}

/**
 * Hook that returns a rounded animated value for display
 */
export function useAnimatedCounterRounded(
  value: number,
  options: UseAnimatedCounterOptions = {}
): MotionValue<string> {
  const motionValue = useAnimatedCounter(value, options);
  return useTransform(motionValue, (latest) => Math.round(latest).toString());
}

export default useAnimatedCounter;
