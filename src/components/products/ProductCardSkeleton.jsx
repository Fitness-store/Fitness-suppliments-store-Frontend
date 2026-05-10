import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <article
      className="rounded-2xl overflow-hidden h-full flex flex-col"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Image Skeleton */}
      <div
        className="relative aspect-square"
        style={{ background: 'var(--bg-subtle)', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
      />

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="h-3 w-20 rounded-md" style={{ background: 'var(--bg-input)', animation: 'pulse 2s infinite' }} />
        <div className="h-5 w-full rounded-md" style={{ background: 'var(--bg-input)', animation: 'pulse 2s infinite' }} />
        <div className="h-5 w-3/4 rounded-md" style={{ background: 'var(--bg-input)', animation: 'pulse 2s infinite' }} />
        <div className="flex gap-2">
          <div className="h-6 w-14 rounded-md" style={{ background: 'var(--bg-input)', animation: 'pulse 2s infinite' }} />
          <div className="h-6 w-18 rounded-md" style={{ background: 'var(--bg-input)', animation: 'pulse 2s infinite' }} />
        </div>
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="h-7 w-24 rounded-md" style={{ background: 'var(--bg-input)', animation: 'pulse 2s infinite' }} />
          <div className="h-4 w-16 rounded-md" style={{ background: 'var(--bg-input)', animation: 'pulse 2s infinite' }} />
        </div>
      </div>
    </article>
  );
};

export default ProductCardSkeleton;
