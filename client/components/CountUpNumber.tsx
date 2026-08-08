import React, { useState, useEffect } from 'react';

interface CountUpNumberProps {
  value: number;
  formatter?: (val: number) => string;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  formatter,
  duration = 800,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (value - startValue) * easeProgress);
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value, duration]);

  const formattedStr = formatter ? formatter(displayValue) : displayValue.toLocaleString();

  return (
    <span className={`inline-block animate-count-up ${className}`}>
      {prefix}{formattedStr}{suffix}
    </span>
  );
};
