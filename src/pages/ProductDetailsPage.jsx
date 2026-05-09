import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchProductById, placeOrder } from '../services/api';
import { Star, ShoppingCart, Check, Minus, Plus, ArrowLeft, Heart, Share2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProductById(id);
        if (response?.success && response?.product) {
          setProduct(response.product);
          if (response.product.variants && response.product.variants.length > 0) {
            setSelectedVariant(response.product.variants[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);


  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, selectedVariant?.stock || 10)));
  };

  const calculateDiscount = () => {
    if (!selectedVariant?.mrp || !selectedVariant?.finalPrice) return 0;
    return Math.round(((selectedVariant.mrp - selectedVariant.finalPrice) / selectedVariant.mrp) * 100);
  };

  const handleOrderNow = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`);
      return;
    }

    setOrderLoading(true);
    setOrderMessage('');
    try {
      const response = await placeOrder({
        totalAmount: (selectedVariant.finalPrice || 0) * quantity,
      });
      setOrderMessage(response?.message || 'Order placed successfully');
    } catch (err) {
      setOrderMessage(err.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    const cartProduct = { ...product, variantId: selectedVariant.id, flavor: selectedVariant.flavor, netQuantity: selectedVariant.netQuantity, finalPrice: selectedVariant.finalPrice, mrp: selectedVariant.mrp, stock: selectedVariant.stock };
    const result = await addToCart(cartProduct, quantity);
    setCartMessage(result.message);
    setTimeout(() => setCartMessage(''), 3000);
  };
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
                  <div className="h-32 w-full bg-gray-200 rounded" />
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
            <div className="bg-white rounded-2xl p-12 border border-gray-100">
              <p className="text-red-600 text-lg mb-6">{error || 'Product not found'}</p>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Products
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount();
  const hasStock = selectedVariant && selectedVariant.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4" />
                      <p className="text-gray-400">No image available</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                    -{discount}%
                  </span>
                )}
                {!hasStock && (
                  <span className="px-3 py-1 bg-gray-500 text-white text-sm font-semibold rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-primary-600 font-medium mb-1">{product.brand}</p>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500">({product.rating?.toFixed(1) || '0.0'})</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  Rs {selectedVariant?.finalPrice?.toLocaleString()}
                </span>
                {selectedVariant?.mrp > selectedVariant?.finalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      Rs {selectedVariant?.mrp?.toLocaleString()}
                    </span>
                    <span className="text-green-600 font-medium">{discount}% off</span>
                  </>
                )}
              </div>
              
              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h3 className="font-medium text-gray-900">Select Variant</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {variant.flavor} - {variant.netQuantity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <Check className={`w-5 h-5 ${hasStock ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={hasStock ? 'text-green-700' : 'text-gray-500'}>
                  {hasStock ? `In Stock (${selectedVariant?.stock} units)` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (selectedVariant?.stock || 0)}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  disabled={!hasStock}
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    hasStock
                      ? 'bg-navy-900 hover:bg-navy-800 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {hasStock ? 'Add To Cart' : 'Out of Stock'}
                </button>
                <button
                  disabled={!hasStock}
                  onClick={handleOrderNow}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    hasStock
                      ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {hasStock ? (orderLoading ? 'Placing Order...' : 'Order Now') : 'Out of Stock'}
                </button>
              </div>
              {orderMessage && (
                <p className={`text-sm mb-4 ${orderMessage.toLowerCase().includes('fail') ? 'text-red-600' : 'text-green-700'}`}>
                  {orderMessage}
                </p>
              )}
              {cartMessage && (
                <p className="text-sm mb-4 text-gray-600">{cartMessage}</p>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="w-5 h-5 text-primary-600" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-primary-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="w-5 h-5 text-primary-600" />
                  <span>Easy Returns</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6">
                  {['description', 'details'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="text-gray-600 leading-relaxed">
                {activeTab === 'description' && (
                  <p>{product.description || 'No description available.'}</p>
                )}
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Brand</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium capitalize">{product.categoryName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Stock</span>
                      <span className="font-medium">{product.stock} units</span>
                    </div>
                    {product.isVegetarian !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Type</span>
                        <span className="font-medium">
                          {product.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                        </span>
                      </div>
                    )}
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

