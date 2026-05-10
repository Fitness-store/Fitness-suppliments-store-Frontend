import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Package, ShoppingBag, ArrowRight, Sparkles, Receipt } from 'lucide-react';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Slight delay to trigger enter animations
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 flex items-center justify-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-1000" />
        
        <div className={`max-w-2xl w-full mx-4 relative z-10 transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl p-8 sm:p-12 text-center overflow-hidden relative">
            
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />

            {/* Animated Success Icon */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transform transition-transform hover:scale-105 duration-300">
                <svg className="w-12 h-12 text-white animate-[bounce_1s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              You're one step closer to your fitness goals. We're getting your gear ready for dispatch.
            </p>

            {/* Order Details Card */}
            {orderId && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-10 border border-gray-200/50 shadow-inner inline-block min-w-[280px]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Receipt className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Order Reference</span>
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-navy-800 tracking-wider">
                  #{orderId}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/orders')}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-black font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <Package className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                Track Order
                <ArrowRight className="w-5 h-5 opacity-0 -ml-8 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </button>
              
              <button
                onClick={() => navigate('/products')}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:text-primary-600 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                Continue Shopping
              </button>
            </div>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
