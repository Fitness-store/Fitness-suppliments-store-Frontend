import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/products/ProductCardSkeleton';
import { fetchProducts, fetchProductsByCategoryId, fetchCategories } from '../services/api';
import { Search, SlidersHorizontal, X, ChevronDown, Package } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: '', name: 'All Categories' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const brands = ['Optimum Nutrition', 'Dymatize', 'Muscletech', 'BSN', 'Cellucor'];

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      if (response?.success && Array.isArray(response?.categories)) {
        setCategories([{ id: '', name: 'All Categories' }, ...response.categories]);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (selectedCategory && selectedCategory !== '') {
        response = await fetchProductsByCategoryId(selectedCategory);
      } else {
        response = await fetchProducts(true);
      }
      
      if (response?.success && Array.isArray(response?.products)) {
        setProducts(response.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category) {
      setSelectedCategory(category);
    }
    if (search !== null) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        (p.description?.toLowerCase() || '').includes(query)
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    if (priceRange.min !== '') {
      result = result.filter(p => p.finalPrice >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter(p => p.finalPrice <= parseFloat(priceRange.max));
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedBrands, priceRange, sortBy]);

  const hasActiveFilters = selectedCategory || selectedBrands.length > 0 || priceRange.min || priceRange.max || searchQuery;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-28 sm:pt-36 pb-10 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(228,185,74,0.06) 0%, transparent 100%)' }} />
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--accent-gold), transparent 70%)' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(228,185,74,0.1)', border: '1px solid rgba(228,185,74,0.2)' }}>
            <Package className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Premium Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            All <span className="text-gradient">Products</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover our premium range of fitness supplements, engineered for elite performance.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search and Filter Bar */}
        <div className="rounded-2xl p-4 mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="appearance-none w-full lg:w-48 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 pr-10 transition-all"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full lg:w-40 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 pr-10 transition-all"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                background: showFilters ? 'rgba(228,185,74,0.15)' : 'var(--bg-input)',
                border: showFilters ? '1px solid rgba(228,185,74,0.3)' : '1px solid var(--border)',
                color: showFilters ? 'var(--accent-gold)' : 'var(--text-secondary)'
              }}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ borderTop: '1px solid var(--border)' }}>
              {/* Brand Filter */}
              <div>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Brands</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 rounded accent-amber-500"
                      />
                      <span style={{ color: 'var(--text-secondary)' }}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 font-medium hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--status-red)' }}
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p style={{ color: 'var(--text-secondary)' }}>
            Showing <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="mb-4" style={{ color: 'var(--status-red)' }}>{error}</p>
            <button
              onClick={loadProducts}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Package className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>No products found</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.productId || product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
