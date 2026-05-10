import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ShoppingBag, Truck, Tag } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const subtotal = cartItems.reduce((total, item) => total + (item.finalPrice || 0) * item.quantity, 0);
  const isFreeShipping = subtotal >= 999;
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <Navbar />
        <div className="pt-32 pb-16 text-center" style={{ color: 'var(--text-secondary)' }}>Loading cart...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />

      <div className="pt-28 sm:pt-36 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Your Cart</h1>
            {cartItems.length > 0 && (
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-2xl p-8 sm:p-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(228,185,74,0.1)' }}>
                <ShoppingCart className="w-10 h-10" style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Your cart is empty</h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: 'var(--accent-grad)', color: '#09090b' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.variantId}
                    className="rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01]"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-subtle)' }}>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.brand}</p>
                        {item.flavor && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Flavor: {item.flavor} | Size: {item.netQuantity}</p>}
                        <p className="text-sm font-semibold mt-1" style={{ color: 'var(--accent-gold)' }}>₹{item.finalPrice?.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decrementQuantity(item.variantId)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.variantId)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--status-red)', border: '1px solid rgba(239,68,68,0.2)' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear cart button */}
                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--status-red)' }}
                  >
                    Clear entire cart
                  </button>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl p-6 sticky top-36" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <ShoppingBag className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
                    Order Summary
                  </h2>

                  <div className="space-y-3 pb-4 mb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>Items ({itemCount})</span>
                      <span style={{ color: 'var(--text-primary)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                      {isFreeShipping ? (
                        <span className="font-medium" style={{ color: 'var(--status-green)' }}>Free</span>
                      ) : (
                        <span style={{ color: 'var(--text-primary)' }}>Calculated at checkout</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span style={{ color: 'var(--text-primary)' }}>Subtotal</span>
                    <span className="text-gradient">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Shipping threshold progress */}
                  {!isFreeShipping && (
                    <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.15)' }}>
                      <div className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: 'var(--status-blue)' }}>
                        <Truck className="w-3.5 h-3.5" />
                        Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping!
                      </div>
                      <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(96,165,250,0.2)' }}>
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%`, background: 'var(--status-blue)' }}
                        />
                      </div>
                    </div>
                  )}

                  {isFreeShipping && (
                    <div className="rounded-xl p-3 mb-4 flex items-center gap-2 text-xs font-medium" style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--status-green)', border: '1px solid rgba(52,211,153,0.15)' }}>
                      <Truck className="w-3.5 h-3.5" />
                      You've unlocked free shipping!
                    </div>
                  )}

                  {/* Coupon hint */}
                  <div className="rounded-xl p-3 mb-4 flex items-center gap-2 text-xs font-medium" style={{ background: 'rgba(228,185,74,0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(228,185,74,0.15)' }}>
                    <Tag className="w-3.5 h-3.5" />
                    Use code <span className="font-bold">SMILE</span> at checkout for 10% off!
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                      style={{ background: 'var(--accent-grad)', color: '#09090b' }}
                    >
                      Proceed to Checkout
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>Login to continue to checkout</p>
                      <Link
                        to="/login?redirect=%2Fcart"
                        className="block w-full px-6 py-3.5 rounded-xl text-center font-semibold transition-all duration-300 hover:scale-[1.02]"
                        style={{ background: 'var(--accent-grad)', color: '#09090b' }}
                      >
                        Login To Checkout
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
