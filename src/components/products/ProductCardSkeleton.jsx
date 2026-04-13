import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <article className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-200 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category */}
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
        
        {/* Brand */}
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1" />
        
        {/* Name */}
        <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
        
        {/* Description */}
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4 flex-1" />
        
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse" />
        </div>
        
        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </article>
  );
};

export default ProductCardSkeleton;
