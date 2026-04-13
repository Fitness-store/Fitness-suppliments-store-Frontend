import React from 'react';
import { Dumbbell, Shield, Truck, Award } from 'lucide-react';

const TrustBadge = ({ icon: Icon, text, subtext }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
    <div className="p-2 bg-primary-500/20 rounded-lg">
      <Icon className="w-5 h-5 text-primary-400" />
    </div>
    <div className="text-left">
      <p className="text-white font-semibold text-sm">{text}</p>
      <p className="text-gray-400 text-xs">{subtext}</p>
    </div>
  </div>
);

const HeroSection = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/50 to-navy-950" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-primary-400 text-sm font-medium">Premium Quality Supplements</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Fuel Your
            <span className="text-gradient"> Fitness Journey </span>
            With Premium Supplements
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover lab-tested, high-performance supplements trusted by 100,000+ athletes. 
            From whey protein to pre-workout, we've got you covered.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={scrollToProducts}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              aria-label="Shop Now"
            >
              <Dumbbell className="w-5 h-5" />
              Shop Now
            </button>
            <button 
              className="btn-secondary w-full sm:w-auto"
              aria-label="View Categories"
            >
              View Categories
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <TrustBadge 
              icon={Shield} 
              text="Lab Tested" 
              subtext="100% Certified"
            />
            <TrustBadge 
              icon={Truck} 
              text="Free Shipping" 
              subtext="Orders over $50"
            />
            <TrustBadge 
              icon={Award} 
              text="Premium Quality" 
              subtext="Top Brands"
            />
            <TrustBadge 
              icon={Dumbbell} 
              text="100K+ Customers" 
              subtext="Trusted by Athletes"
            />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
