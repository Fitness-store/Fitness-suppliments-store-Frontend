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
      <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <Navbar />
        <div className="pt-36 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 w-32 rounded mb-8" style={{ background: 'var(--bg-subtle)' }} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-square rounded-2xl" style={{ background: 'var(--bg-subtle)' }} />
                <div className="space-y-4">
                  <div className="h-8 w-3/4 rounded" style={{ background: 'var(--bg-subtle)' }} />
                  <div className="h-6 w-1/2 rounded" style={{ background: 'var(--bg-subtle)' }} />
                  <div className="h-12 w-1/3 rounded" style={{ background: 'var(--bg-subtle)' }} />
                  <div className="h-32 w-full rounded" style={{ background: 'var(--bg-subtle)' }} />
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
      <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <Navbar />
        <div className="pt-36 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-2xl p-12" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-lg mb-6" style={{ color: 'var(--status-red)' }}>{error || 'Product not found'}</p>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: 'var(--accent-grad)', color: '#09090b' }}
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
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />
      
      <div className="pt-36 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link>
            <span>/</span>
            <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4" style={{ background: 'var(--bg-subtle)' }} />
                      <p style={{ color: 'var(--text-muted)' }}>No image available</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full" style={{ background: 'var(--status-red)', color: '#fff' }}>
                    -{discount}%
                  </span>
                )}
                {!hasStock && (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium mb-1" style={{ color: 'var(--accent-gold)' }}>{product.brand}</p>
                  <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{product.name}</h1>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
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
                          : ''
                      }`}
                      style={i >= Math.round(product.rating || 0) ? { color: 'var(--text-muted)' } : {}}
                    />
                  ))}
                </div>
                <span style={{ color: 'var(--text-muted)' }}>({product.rating?.toFixed(1) || '0.0'})</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gradient">
                  Rs {selectedVariant?.finalPrice?.toLocaleString()}
                </span>
                {selectedVariant?.mrp > selectedVariant?.finalPrice && (
                  <>
                    <span className="text-xl line-through" style={{ color: 'var(--text-muted)' }}>
                      Rs {selectedVariant?.mrp?.toLocaleString()}
                    </span>
                    <span className="font-medium" style={{ color: 'var(--status-green)' }}>{discount}% off</span>
                  </>
                )}
              </div>
              
              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Select Variant</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                        style={selectedVariant?.id === variant.id
                          ? { background: 'rgba(228,185,74,0.15)', border: '1px solid rgba(228,185,74,0.4)', color: 'var(--accent-gold)' }
                          : { background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                        }
                      >
                        {variant.flavor} - {variant.netQuantity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <Check className="w-5 h-5" style={{ color: hasStock ? 'var(--status-green)' : 'var(--text-muted)' }} />
                <span style={{ color: hasStock ? 'var(--status-green)' : 'var(--text-muted)' }}>
                  {hasStock ? `In Stock (${selectedVariant?.stock} units)` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Quantity:</span>
                <div className="flex items-center rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium" style={{ color: 'var(--text-primary)' }}>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (selectedVariant?.stock || 0)}
                    className="p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  disabled={!hasStock}
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300"
                  style={hasStock
                    ? { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
                    : { background: 'var(--bg-subtle)', color: 'var(--text-muted)', cursor: 'not-allowed' }
                  }
                >
                  <ShoppingCart className="w-5 h-5" />
                  {hasStock ? 'Add To Cart' : 'Out of Stock'}
                </button>
                <button
                  disabled={!hasStock}
                  onClick={handleOrderNow}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                  style={hasStock
                    ? { background: 'var(--accent-grad)', color: '#09090b' }
                    : { background: 'var(--bg-subtle)', color: 'var(--text-muted)', cursor: 'not-allowed' }
                  }
                >
                  <ShoppingCart className="w-5 h-5" />
                  {hasStock ? (orderLoading ? 'Placing Order...' : 'Order Now') : 'Out of Stock'}
                </button>
              </div>
              {orderMessage && (
                <p className="text-sm mb-4" style={{ color: orderMessage.toLowerCase().includes('fail') ? 'var(--status-red)' : 'var(--status-green)' }}>
                  {orderMessage}
                </p>
              )}
              {cartMessage && (
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{cartMessage}</p>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6" style={{ borderTop: '1px solid var(--border)' }}>
                {[
                  { icon: ShieldCheck, text: '100% Authentic' },
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: RotateCcw, text: 'Easy Returns' },
                ].map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Icon className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
                      <span>{badge.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Tabs */}
              <div className="mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex gap-6">
                  {['description', 'details'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="pb-3 font-medium capitalize transition-colors"
                      style={activeTab === tab
                        ? { color: 'var(--accent-gold)', borderBottom: '2px solid var(--accent-gold)' }
                        : { color: 'var(--text-muted)' }
                      }
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {activeTab === 'description' && (
                  <p>{product.description || 'No description available.'}</p>
                )}
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    {[
                      { label: 'Brand', value: product.brand },
                      { label: 'Category', value: product.categoryName },
                      { label: 'Stock', value: `${product.stock} units` },
                      ...(product.isVegetarian !== undefined ? [{ label: 'Type', value: product.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian' }] : []),
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                        <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
                      </div>
                    ))}
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
