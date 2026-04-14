import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Share2,
  Heart,
  Minus,
  Plus,
  AlertCircle
} from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchProductById(id);
      if (response?.success && response?.product) {
        setProduct(response.product);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product?.stock || 10)));
  };

  const discount = product?.mrp && product?.finalPrice 
    ? Math.round(((product.mrp - product.finalPrice) / product.mrp) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-gray-200 rounded mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-square bg-gray-200 rounded-2xl" />
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-gray-200 rounded" />
                  <div className="h-6 w-1/2 bg-gray-200 rounded" />
                  <div className="h-12 w-1/3 bg-gray-200 rounded" />
                  <div className="h-32 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Product not found'}
            </h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Products</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.categoryName || 'Category'}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}
              </div>
              
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-accent-orange text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {discount}% OFF
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    {product.brand}
                  </span>
                  {product.isVegetarian && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      <Check className="w-4 h-4" />
                      Vegetarian
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-gray-500">({product.reviewCount || 0} reviews)</span>
                    </div>
                  )}
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check className="w-4 h-4" />
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.finalPrice}
                </span>
                {product.mrp > product.finalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.mrp}
                    </span>
                    <span className="text-green-600 font-medium">
                      Save ₹{product.mrp - product.finalPrice}
                    </span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-6 h-6" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <ShieldCheck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Authentic Product</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Easy Returns</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex gap-6 mb-4">
                  {['description', 'details'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm font-semibold uppercase tracking-wide transition-colors border-b-2 ${
                        activeTab === tab
                          ? 'text-primary-600 border-primary-600'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description || 'No description available.'}
                    </p>
                  </div>
                )}
                
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    {product.flavor && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Flavor</span>
                        <span className="font-medium">{product.flavor}</span>
                      </div>
                    )}
                    {product.netQuantity && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Net Quantity</span>
                        <span className="font-medium">{product.netQuantity}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{product.categoryName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Product ID</span>
                      <span className="font-medium">{product.productId}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
