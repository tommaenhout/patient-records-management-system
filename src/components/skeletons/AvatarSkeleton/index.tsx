import React from 'react';
import type { SizeType } from '@/components/atoms/Avatar/types';
import { sizeClasses } from '@/components/atoms/Avatar/types';

interface AvatarSkeletonProps {
  size?: SizeType;
  className?: string;
}

const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div 
        className={`
          bg-gray-200 animate-pulse rounded-full
          ${sizeClasses[size]} 
          ${className}
        `}
      />
    </div>
  );
};

export default AvatarSkeleton;
