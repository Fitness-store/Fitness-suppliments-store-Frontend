import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { AlertCircle, RefreshCw, Package, ArrowRight } from 'lucide-react';

const ProductGrid = ({ products, loading, error, onRetry }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section id="products-section" className="py-24 relative" style={{ background: 'var(--bg-base)' }}>
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <div className="h-4 w-28 rounded-full mx-auto" style={{ background: 'var(--bg-subtle)', animation: 'pulse 2s infinite' }} />
            <div className="h-10 w-72 rounded-xl mx-auto" style={{ background: 'var(--bg-subtle)', animation: 'pulse 2s infinite' }} />
            <div className="h-5 w-96 rounded-xl mx-auto" style={{ background: 'var(--bg-subtle)', animation: 'pulse 2s infinite' }} />
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
      <section id="products-section" className="py-24 relative" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-md mx-auto px-6 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <AlertCircle className="w-10 h-10" style={{ color: 'var(--status-red)' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Failed to Load Products</h3>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={onRetry} className="btn-primary inline-flex items-center gap-2" aria-label="Retry loading products">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section id="products-section" className="py-24 relative" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-md mx-auto px-6 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <Package className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Products Available</h3>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Our inventory is currently empty. Check back soon!</p>
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
    <section id="products-section" className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="absolute inset-0 grid-pattern" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(228,185,74,0.03) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-gold))' }} />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: 'var(--accent-gold)' }}>
                Our Collection
              </span>
            </div>
            <h2 className="section-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>
              Premium
              <br />
              <span className="text-gradient">Supplements</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mb-1">
            {[
              { value: `${products.length}+`, label: 'Products' },
              { value: '50K+', label: 'Athletes' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                <div className="text-center">
                  <p className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                  <p className="text-xs font-medium uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
                {i < 2 && <div className="w-px h-10" style={{ background: 'var(--border)' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Glow separator */}
        <div className="glow-line mb-16" />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayProducts.map((product) => (
            <ProductCard key={product.productId || product.id} product={product} />
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
          <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            {products.length} products across multiple categories
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
