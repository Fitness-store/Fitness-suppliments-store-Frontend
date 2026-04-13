import React, { useState, useEffect } from 'react';
import HeroSection from '../components/layout/HeroSection';
import ProductGrid from '../components/products/ProductGrid';
import BenefitsSection from '../components/layout/BenefitsSection';
import CTABanner from '../components/layout/CTABanner';
import Footer from '../components/layout/Footer';
import { fetchProducts } from '../services/api';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async (showInStockOnly = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProducts(showInStockOnly);
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Products Section */}
      <ProductGrid 
        products={products} 
        loading={loading} 
        error={error} 
        onRetry={loadProducts}
      />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* CTA Banner */}
      <CTABanner />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
