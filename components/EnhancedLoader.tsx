'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader = ({ 
  message = 'Loading...', 
  size = 'md',
  className 
}: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const containerClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  return (
    <div className={cn(
      'flex-center flex-col text-white',
      containerClasses[size],
      className
    )}>
      <Image
        src="/icons/loading-circle.svg"
        alt="Loading"
        width={size === 'lg' ? 48 : size === 'md' ? 32 : 24}
        height={size === 'lg' ? 48 : size === 'md' ? 32 : 24}
        className={cn('animate-spin', sizeClasses[size])}
      />
      {message && (
        <p className={cn(
          'text-center',
          size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'
        )}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
