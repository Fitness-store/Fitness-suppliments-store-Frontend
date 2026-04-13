import React from 'react';
import { FlaskConical, Truck, ShieldCheck, Headphones, RotateCcw, BadgeCheck } from 'lucide-react';

const BenefitCard = ({ icon: Icon, title, description, color }) => (
  <div className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const BenefitsSection = () => {
  const benefits = [
    {
      icon: FlaskConical,
      title: 'Lab Tested',
      description: 'Every product is tested in certified labs for purity, potency, and safety.',
      color: 'bg-blue-500',
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic',
      description: 'We source directly from brands. No counterfeit products, ever.',
      color: 'bg-green-500',
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free delivery on orders over $50. 2-5 day delivery across the country.',
      color: 'bg-purple-500',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Get advice from certified nutritionists and fitness experts.',
      color: 'bg-orange-500',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy. No questions asked.',
      color: 'bg-pink-500',
    },
    {
      icon: BadgeCheck,
      title: 'Best Prices',
      description: 'Price match guarantee. Found it cheaper? We\'ll match it.',
      color: 'bg-primary-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-navy-900/10 text-navy-900 font-medium text-sm rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The <span className="text-gradient">FitStore</span> Advantage
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best supplements and an unmatched shopping experience
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-16 p-8 bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-6 h-6 text-primary-400" />
              <span className="font-semibold">GMP Certified</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-6 h-6 text-primary-400" />
              <span className="font-semibold">FDA Registered</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-6 h-6 text-primary-400" />
              <span className="font-semibold">ISO 22000</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-6 h-6 text-primary-400" />
              <span className="font-semibold">FSSAI Approved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
