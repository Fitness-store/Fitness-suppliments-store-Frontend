import React from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { AlertCircle, RefreshCw, Package } from 'lucide-react';

const ProductGrid = ({ products, loading, error, onRetry }) => {
  // Loading State
  if (loading) {
    return (
      <section id="products-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          
          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section id="products-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Failed to Load Products
            </h3>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
              aria-label="Retry loading products"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <section id="products-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-600 mb-6">
              Our inventory is currently empty. Check back soon for premium supplements!
            </p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
              aria-label="Refresh products"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Success State
  return (
    <section id="products-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 font-medium text-sm rounded-full mb-4">
            Our Collection
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Supplements
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lab-tested, high-performance supplements trusted by professional athletes and fitness enthusiasts
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
          <div>
            <p className="text-3xl font-bold text-primary-600">{products.length}+</p>
            <p className="text-sm text-gray-600">Products</p>
          </div>
          <div className="hidden sm:block w-px bg-gray-300" />
          <div>
            <p className="text-3xl font-bold text-primary-600">50+</p>
            <p className="text-sm text-gray-600">Brands</p>
          </div>
          <div className="hidden sm:block w-px bg-gray-300" />
          <div>
            <p className="text-3xl font-bold text-primary-600">100K+</p>
            <p className="text-sm text-gray-600">Happy Customers</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.productId || product.id} 
              product={product} 
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
            View All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
