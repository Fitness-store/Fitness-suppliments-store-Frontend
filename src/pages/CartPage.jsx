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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 text-center text-gray-600">Loading cart...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.variantId} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        {item.flavor && <p className="text-xs text-gray-400 mt-1">Flavor: {item.flavor} | Size: {item.netQuantity}</p>}
                        <p className="text-sm font-semibold text-gray-900 mt-1">₹{item.finalPrice?.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decrementQuantity(item.variantId)}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.variantId)}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="p-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
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
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear entire cart
                  </button>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-36">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary-600" />
                    Order Summary
                  </h2>

                  <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items ({itemCount})</span>
                      <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      {isFreeShipping ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        <span className="text-gray-900">Calculated at checkout</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span className="text-gray-900">Subtotal</span>
                    <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Shipping threshold progress */}
                  {!isFreeShipping && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-xs text-blue-700 font-medium mb-2">
                        <Truck className="w-3.5 h-3.5" />
                        Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping!
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isFreeShipping && (
                    <div className="bg-green-50 rounded-lg p-3 mb-4 flex items-center gap-2 text-xs text-green-700 font-medium">
                      <Truck className="w-3.5 h-3.5" />
                      You've unlocked free shipping!
                    </div>
                  )}

                  {/* Coupon hint */}
                  <div className="bg-yellow-50 rounded-lg p-3 mb-4 flex items-center gap-2 text-xs text-yellow-800 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    Use code <span className="font-bold">SMILE</span> at checkout for 10% off!
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full px-6 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 text-center">Login to continue to checkout</p>
                      <Link
                        to="/login?redirect=%2Fcart"
                        className="block w-full px-6 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-center font-semibold transition-colors"
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
