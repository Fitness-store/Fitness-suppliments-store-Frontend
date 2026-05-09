import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/useAuth';
import { fetchMyOrders } from '../services/api';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  PAID: { label: 'Paid', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadOrders = async () => {
      setLoading(true);
      try {
        const res = await fetchMyOrders();
        if (res?.success && Array.isArray(res.orders)) {
          setOrders(res.orders);
        }
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-12 px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Please login to view your orders</p>
            <button onClick={() => navigate('/login')} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-primary-600" />
              My Orders
            </h1>
            <p className="text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
              <button onClick={() => navigate('/products')} className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors">
                Browse Products
              </button>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.orderId;
                const status = statusConfig[order.status] || statusConfig.PENDING;
                const StatusIcon = status.icon;

                return (
                  <div key={order.orderId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                    {/* Order Header */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900">Order #{order.orderId}</p>
                          <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                        <span className="text-lg font-bold text-gray-900 whitespace-nowrap">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </button>

                    {/* Order Items (Expandable) */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-100">
                                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                  {item.productImage ? (
                                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.productName || 'Product'}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {item.flavor && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.flavor}</span>}
                                    {item.netQuantity && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.netQuantity}</span>}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-bold text-gray-900">₹{item.price?.toLocaleString('en-IN')}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-2">No item details available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
