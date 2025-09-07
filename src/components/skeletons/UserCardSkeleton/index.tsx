import React from 'react';

interface UserCardSkeletonProps {
  className?: string;
}

const UserCardSkeleton: React.FC<UserCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`
      bg-white rounded-2xl border border-gray-200 p-6 shadow-sm
      max-w-full w-full animate-pulse
      ${className}
    `}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Avatar Skeleton */}
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          
          <div>
            {/* Name Skeleton */}
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
            {/* Date Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        
        {/* Action Icons Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default UserCardSkeleton;
