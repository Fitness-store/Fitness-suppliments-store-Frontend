import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6 inline-block">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-lg font-bold text-primary-600">#{orderId}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left">
              <h3 className="font-medium text-blue-900 mb-2">What's next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your order is being prepared for dispatch</li>
                <li>• Cash on Delivery — pay when the order arrives</li>
                <li>• Track your order from the "My Orders" page</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors"
              >
                <Package className="w-4 h-4" />
                View My Orders
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
