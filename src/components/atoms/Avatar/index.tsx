import React, { useState } from 'react';
import type { Avatar as AvatarType, Name } from '../../../interfaces/patient';
import { getInitials } from '../../../helpers/string';
import AvatarSkeleton from '@/components/skeletons/AvatarSkeleton';
import type { SizeType } from './types';
import { sizeClasses } from './types';

interface AvatarProps {
  avatar?: AvatarType;
  name: Name;
  size?: SizeType;
  className?: string;
  index?: number;
}


const Avatar: React.FC<AvatarProps> = ({ 
  avatar, 
  name, 
  size = 'lg', 
  className = '',
  index = 0
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const showImage = typeof avatar === 'string' && avatar && !imageError;
  const initials = getInitials(name);
  const isImageLoading = showImage && !imageLoaded && !imageError;

  return (
    <div 
      className={`
        relative inline-flex items-center justify-center 
        rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
        text-white font-semibold overflow-hidden flex-shrink-0
        ${sizeClasses[size]} 
        ${className}
      `}
      style={{ aspectRatio: '1 / 1' }}
    >
      {showImage ? (
        <>
          <img
            src={avatar as string}
            alt={`${name}'s avatar`}
            className={`
              w-full h-full object-cover object-center transition-opacity duration-200
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading={index > 10 ? "lazy" : "eager"}
          />
          {isImageLoading && (
            <AvatarSkeleton size={size} />
          )}
        </>
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;