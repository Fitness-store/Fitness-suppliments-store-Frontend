import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import { placeOrder, verifyPayment } from '../services/api';
import { MapPin, CreditCard, ShoppingBag, ArrowLeft, Loader2, Banknote, Smartphone, Tag, Truck, Info } from 'lucide-react';

const SAVED_ADDRESS_KEY = 'ironcore_saved_address';

const readSavedAddress = () => {
  try {
    const raw = localStorage.getItem(SAVED_ADDRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveAddress = (address) => {
  try {
    localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(address));
  } catch {
    // Ignore storage errors
  }
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  const savedAddress = readSavedAddress();

  const [form, setForm] = useState({
    shippingAddress: '',
    city: '',
    state: '',
    pincode: '',
    phone: currentUser?.phone || '',
    paymentMethod: 'COD',
  });

  // Auto-fill saved address on mount
  useEffect(() => {
    if (savedAddress) {
      setForm(prev => ({
        ...prev,
        shippingAddress: savedAddress.shippingAddress || '',
        city: savedAddress.city || '',
        state: savedAddress.state || '',
        pincode: savedAddress.pincode || '',
        phone: savedAddress.phone || prev.phone,
      }));
      setUseSavedAddress(true);
    }
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + (item.finalPrice || 0) * item.quantity, 0);
  const isFreeShipping = subtotal >= 999;
  const codCharge = form.paymentMethod === 'COD' ? Math.round((subtotal * 0.03) - 1) : 0;
  const total = subtotal + codCharge;

  // Load Razorpay script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openRazorpayWidget = (orderData) => {
    const options = {
      key: orderData.razorpayKeyId,
      amount: Math.round(orderData.totalAmount * 100),
      currency: 'INR',
      name: 'IronCore Supplements',
      description: `Order #${orderData.orderId}`,
      order_id: orderData.razorpayOrderId,
      handler: async function (response) {
        setLoading(true);
        setError(null);
        try {
          const verifyRes = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes?.success) {
            await clearCart();
            navigate(`/order-confirmation?orderId=${verifyRes.orderId}`);
          } else {
            setError(verifyRes?.message || 'Payment verification failed.');
          }
        } catch (err) {
          setError(err.message || 'Payment verification failed. Contact support.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: currentUser?.fullName || '',
        email: currentUser?.email || '',
        contact: form.phone,
      },
      theme: {
        color: '#0284c7',
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setError('Payment was cancelled. Your order is pending. You can retry from My Orders.');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.shippingAddress || !form.city || !form.state || !form.pincode || !form.phone) {
      setError('Please fill in all shipping fields.');
      return;
    }

    // Save address for future use
    saveAddress({
      shippingAddress: form.shippingAddress,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      phone: form.phone,
    });

    setLoading(true);
    try {
      const response = await placeOrder({
        shippingAddress: form.shippingAddress,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
      });

      if (response?.success) {
        if (form.paymentMethod === 'COD') {
          await clearCart();
          navigate(`/order-confirmation?orderId=${response.orderId}`);
        } else {
          setLoading(false);
          openRazorpayWidget(response);
        }
      } else {
        setError(response?.message || 'Failed to place order.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      if (form.paymentMethod === 'COD') {
        setLoading(false);
      }
    }
  };

  const clearSavedAddress = () => {
    localStorage.removeItem(SAVED_ADDRESS_KEY);
    setForm(prev => ({
      ...prev,
      shippingAddress: '',
      city: '',
      state: '',
      pincode: '',
      phone: currentUser?.phone || '',
    }));
    setUseSavedAddress(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-12 px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-600 mb-4">Please login to checkout</p>
            <button onClick={() => navigate('/login?redirect=%2Fcheckout')} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-12 px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const paymentMethods = [
    { value: 'COD', label: 'Cash on Delivery', desc: '3% COD charge applies', icon: Banknote },
    { value: 'ONLINE', label: 'Pay Online', desc: 'UPI, Cards, Net Banking — No extra charge', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back button */}
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>

          {/* Offers strip */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
              <Truck className="w-3.5 h-3.5" />
              {isFreeShipping ? 'Free Shipping Unlocked!' : 'Free shipping on orders above ₹999'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
              <Tag className="w-3.5 h-3.5" />
              Use code <span className="font-bold">SMILE</span> for 10% off
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Shipping + Payment */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      Shipping Address
                    </h2>
                    {savedAddress && (
                      <button
                        type="button"
                        onClick={clearSavedAddress}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Use a different address
                      </button>
                    )}
                  </div>

                  {savedAddress && useSavedAddress && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4 text-sm text-primary-800">
                      <p className="font-medium text-xs text-primary-600 mb-1">Using saved address</p>
                      <p>{savedAddress.shippingAddress}, {savedAddress.city}, {savedAddress.state} — {savedAddress.pincode}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                      <textarea
                        name="shippingAddress"
                        value={form.shippingAddress}
                        onChange={handleChange}
                        rows={3}
                        placeholder="House/Flat No., Street, Landmark"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="Mumbai"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          placeholder="Maharashtra"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={form.pincode}
                          onChange={handleChange}
                          placeholder="400001"
                          maxLength={6}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.value}
                          className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                            form.paymentMethod === method.value
                              ? 'border-primary-500 bg-primary-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={form.paymentMethod === method.value}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-600"
                          />
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{method.label}</p>
                            <p className="text-xs text-gray-500">{method.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {form.paymentMethod === 'COD' && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        A COD handling charge of <strong>3% (minus ₹1)</strong> will be added to your order total.
                        Pay online to avoid this charge.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-36">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary-600" />
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.variantId} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.flavor && `${item.flavor}`}{item.netQuantity && ` • ${item.netQuantity}`} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          ₹{((item.finalPrice || 0) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      {isFreeShipping ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        <span className="text-gray-900">₹0 <span className="text-green-600 text-xs">(Free)</span></span>
                      )}
                    </div>
                    {form.paymentMethod === 'COD' && codCharge > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">COD Charge (3%)</span>
                        <span className="text-amber-600 font-medium">+₹{codCharge.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-3">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    {form.paymentMethod === 'COD' && codCharge > 0 && (
                      <p className="text-xs text-gray-500 text-right">
                        Save ₹{codCharge.toLocaleString('en-IN')} by paying online
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 px-6 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {form.paymentMethod === 'COD' ? 'Placing Order...' : 'Processing...'}
                      </>
                    ) : form.paymentMethod === 'COD' ? (
                      `Place Order • ₹${total.toLocaleString('en-IN')}`
                    ) : (
                      `Pay Now • ₹${subtotal.toLocaleString('en-IN')}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
