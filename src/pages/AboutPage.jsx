import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ShieldCheck, Eye, Zap, Check, ArrowRight, FlaskConical, Award, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(228,185,74,0.06) 0%, transparent 60%)' }} />
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, var(--accent-gold), transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'rgba(228,185,74,0.1)', border: '1px solid rgba(228,185,74,0.2)' }}>
            <Award className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>Our Story</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight max-w-4xl mx-auto" style={{ color: 'var(--text-primary)' }}>
            Engineered for the Elite.
            <br />
            <span className="text-gradient">Built on Absolute Trust.</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 sm:mb-10" style={{ color: 'var(--text-secondary)' }}>
            No hidden blends. No compromised ingredients. Just pure, lab-tested performance from IronCore.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              style={{ background: 'var(--accent-grad)', color: '#09090b' }}
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-hover)', color: 'var(--text-primary)' }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Main Story - The "Why" Block */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Image/Visual */}
            <div className="relative">
              <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(228,185,74,0.1), rgba(249,115,22,0.1))' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <FlaskConical className="w-24 h-24 mx-auto mb-6" style={{ color: 'var(--accent-gold)' }} />
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Radical Transparency</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(228,185,74,0.15)' }}>
                    <Check className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>100%</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lab Tested</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Story Content */}
            <div>
              <span className="inline-block px-4 py-2 font-medium text-sm rounded-full mb-6" style={{ background: 'rgba(228,185,74,0.1)', color: 'var(--accent-gold)' }}>
                The IronCore Origin
              </span>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                We demanded better,
                <br />
                <span className="text-gradient">so we built it.</span>
              </h2>
              
              <div className="space-y-4 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  The supplement industry is filled with noise—exaggerated claims, under-dosed formulas, and proprietary blends designed to hide the truth. We got tired of guessing what we were putting into our bodies.
                </p>
                <p>
                  IronCore was founded on a singular, unbreakable rule: <strong style={{ color: 'var(--text-primary)' }}>Radical Transparency.</strong> We believe that if you are putting in the work to build a monstrous physique and push your limits, your supplements should work just as hard.
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
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 font-medium text-sm rounded-full mb-4" style={{ background: 'rgba(228,185,74,0.1)', color: 'var(--accent-gold)' }}>
              Our Foundation
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              The Three Pillars of <span className="text-gradient">IronCore</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Everything we do is guided by these unwavering principles
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Uncompromising Quality', desc: "We don't cut corners. Every batch of IronCore is rigorously tested for purity, potency, and safety. We use premium, bioavailable ingredients that your body can actually absorb and utilize, ensuring a rock-solid foundation for your heavy training.", color: 'var(--accent-gold)' },
              { icon: Eye, title: '100% Label Transparency', desc: 'Trust is earned, not given. We have completely banned "proprietary blends" from our manufacturing process. Every single ingredient and its exact dosage is clearly listed on every IronCore tub. You will always know exactly what fuels your performance.', color: 'var(--status-blue)' },
              { icon: Zap, title: 'Unleashed Performance', desc: 'Our formulas are not designed for the average. They are precision-engineered for those who demand monster performance. With clinical dosages backed by hard science, IronCore provides the exact fuel needed to break plateaus and dominate every session.', color: 'var(--accent-orange)' },
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="group rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: `${pillar.color}15` }}>
                    <Icon className="w-8 h-8" style={{ color: pillar.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {pillar.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50+', label: 'Premium Products' },
              { value: '100K+', label: 'Athletes Served' },
              { value: '99.9%', label: 'Purity Rate' },
              { value: '4.9★', label: 'Customer Rating' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold mb-2 text-gradient">{stat.value}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(228,185,74,0.1)', border: '1px solid rgba(228,185,74,0.2)' }}>
            <Users className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
            <span className="font-medium text-sm" style={{ color: 'var(--accent-gold)' }}>Join the IronCore Family</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            The IronCore Promise
          </h2>
          
          <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We are not just a supplement company; we are athletes, lifters, and engineers of human performance. We pledge to never sell you a product we wouldn't take ourselves. When you choose IronCore, you are choosing a partner in your relentless pursuit of greatness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ background: 'var(--accent-grad)', color: '#09090b' }}
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
