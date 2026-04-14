import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ShieldCheck, Eye, Zap, Check, ArrowRight, FlaskConical, Award, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-navy-950 pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900/90 to-navy-800/50" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full mb-8">
            <Award className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">Our Story</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
            Engineered for the Elite.
            <br />
            <span className="text-gradient">Built on Absolute Trust.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            No hidden blends. No compromised ingredients. Just pure, lab-tested performance from IronCore.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Main Story - The "Why" Block */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Image/Visual */}
            <div className="relative">
              <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-navy-900 to-navy-800">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-orange/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <FlaskConical className="w-24 h-24 text-primary-400 mx-auto mb-6" />
                    <p className="text-white text-2xl font-bold">Radical Transparency</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-600">Lab Tested</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Story Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-navy-900/10 text-navy-900 font-medium text-sm rounded-full mb-6">
                The IronCore Origin
              </span>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                We demanded better,
                <br />
                <span className="text-gradient">so we built it.</span>
              </h2>
              
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  The supplement industry is filled with noise—exaggerated claims, under-dosed formulas, and proprietary blends designed to hide the truth. We got tired of guessing what we were putting into our bodies.
                </p>
                <p>
                  IronCore was founded on a singular, unbreakable rule: <strong className="text-gray-900">Radical Transparency.</strong> We believe that if you are putting in the work to build a monstrous physique and push your limits, your supplements should work just as hard.
                </p>
                <p>
                  We source only the highest-grade raw materials, dose them at clinical levels, and test them rigorously. What is on the label is exactly what is in the scoop. Nothing more, nothing less.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars - 3 Column Feature Grid */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 font-medium text-sm rounded-full mb-4">
              Our Foundation
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Three Pillars of <span className="text-gradient">IronCore</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by these unwavering principles
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Quality */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Uncompromising Quality
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We don't cut corners. Every batch of IronCore is rigorously tested for purity, potency, and safety. We use premium, bioavailable ingredients that your body can actually absorb and utilize, ensuring a rock-solid foundation for your heavy training.
              </p>
            </div>

            {/* Pillar 2: Transparency */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                100% Label Transparency
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Trust is earned, not given. We have completely banned "proprietary blends" from our manufacturing process. Every single ingredient and its exact dosage is clearly listed on every IronCore tub. You will always know exactly what fuels your performance.
              </p>
            </div>

            {/* Pillar 3: Performance */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-accent-orange/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Unleashed Performance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our formulas are not designed for the average. They are precision-engineered for those who demand monster performance. With clinical dosages backed by hard science, IronCore provides the exact fuel needed to break plateaus and dominate every session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white mb-2">50+</p>
              <p className="text-gray-400">Premium Products</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">100K+</p>
              <p className="text-gray-400">Athletes Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">99.9%</p>
              <p className="text-gray-400">Purity Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">4.9★</p>
              <p className="text-gray-400">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-6">
            <Users className="w-4 h-4" />
            <span className="font-medium text-sm">Join the IronCore Family</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            The IronCore Promise
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            We are not just a supplement company; we are athletes, lifters, and engineers of human performance. We pledge to never sell you a product we wouldn't take ourselves. When you choose IronCore, you are choosing a partner in your relentless pursuit of greatness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
