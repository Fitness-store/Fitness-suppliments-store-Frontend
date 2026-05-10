import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { AlertCircle, RefreshCw, Package, ArrowRight } from 'lucide-react';

const sectionBg = { background: '#09090b' };

const SkeletonBlock = () => (
  <div className="h-6 rounded-lg" style={{ background: '#27272a', animation: 'pulse 2s infinite' }} />
);

const ProductGrid = ({ products, loading, error, onRetry }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section id="products-section" className="py-24 relative" style={sectionBg}>
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header skeleton */}
          <div className="text-center mb-16 space-y-4">
            <div className="h-4 w-28 rounded-full mx-auto" style={{ background: '#27272a', animation: 'pulse 2s infinite' }} />
            <div className="h-10 w-72 rounded-xl mx-auto" style={{ background: '#27272a', animation: 'pulse 2s infinite' }} />
            <div className="h-5 w-96 rounded-xl mx-auto" style={{ background: '#27272a', animation: 'pulse 2s infinite' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products-section" className="py-24 relative" style={sectionBg}>
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Products</h3>
          <p className="text-zinc-500 mb-8">{error}</p>
          <button
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2"
            aria-label="Retry loading products"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section id="products-section" className="py-24 relative" style={sectionBg}>
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Package className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Products Available</h3>
          <p className="text-zinc-500 mb-8">Our inventory is currently empty. Check back soon for premium supplements!</p>
          <button onClick={onRetry} className="btn-primary inline-flex items-center gap-2" aria-label="Refresh products">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </section>
    );
  }

  const displayProducts = products.slice(0, 8);

  return (
    <section id="products-section" className="py-24 relative overflow-hidden" style={sectionBg}>
      {/* Grid bg */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* Subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(228,185,74,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, #e4b94a)' }} />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: '#e4b94a' }}>
                Our Collection
              </span>
            </div>
            <h2 className="section-heading text-5xl font-black text-white leading-tight">
              Premium
              <br />
              <span className="text-gradient">Supplements</span>
            </h2>
          </div>
          <div className="flex items-center gap-8 mb-1">
            <div className="text-center">
              <p className="text-3xl font-black text-white">{products.length}+</p>
              <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mt-1">Products</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="text-center">
              <p className="text-3xl font-black text-white">50K+</p>
              <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mt-1">Athletes</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="text-center">
              <p className="text-3xl font-black text-white">4.9★</p>
              <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider mt-1">Rating</p>
            </div>
          </div>
        </div>

        {/* Glow separator */}
        <div className="glow-line mb-16" />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.productId || product.id}
              product={product}
            />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/products')}
            className="group btn-primary inline-flex items-center gap-3"
          >
            View All Products
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-zinc-600 text-sm mt-4">{products.length} products across multiple categories</p>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
