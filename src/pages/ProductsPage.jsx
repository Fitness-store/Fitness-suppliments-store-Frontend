import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/products/ProductCardSkeleton';
import { fetchProducts, fetchProductsByCategoryId } from '../services/api';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'protein', name: 'Protein' },
    { id: 'pre-workout', name: 'Pre-Workout' },
    { id: 'bcaa', name: 'BCAA' },
    { id: 'creatine', name: 'Creatine' },
    { id: 'vitamins', name: 'Vitamins' },
  ];

  const brands = ['Optimum Nutrition', 'Dymatize', 'Muscletech', 'BSN', 'Cellucor'];

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
    if (category) {
      setSelectedCategory(category);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-navy-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">All Products</h1>
          <p className="text-gray-400">Discover our premium range of fitness supplements</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="appearance-none w-full lg:w-48 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white pr-10"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full lg:w-40 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white pr-10"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                showFilters ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Brand Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
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
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
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
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
