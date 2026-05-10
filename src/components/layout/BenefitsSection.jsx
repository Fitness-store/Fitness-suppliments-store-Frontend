import React, { useRef, useEffect, useState } from 'react';
import { FlaskConical, Truck, ShieldCheck, Headphones, RotateCcw, BadgeCheck } from 'lucide-react';

const benefits = [
  {
    icon: FlaskConical,
    title: 'Lab Tested',
    description: 'Every batch is independently tested in NABL-certified labs for purity, potency, and safety.',
    accent: '#60a5fa',
    glow: 'rgba(96,165,250,0.10)',
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    description: 'We source directly from authorized brand distributors. Zero compromise on authenticity.',
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.10)',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Free delivery on orders above ₹999. 24-72 hour dispatch across India.',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.10)',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Real advice from certified sports nutritionists — not bots, not scripts.',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.10)',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day no-questions-asked return policy on all sealed, unused products.',
    accent: '#f472b6',
    glow: 'rgba(244,114,182,0.10)',
  },
  {
    icon: BadgeCheck,
    title: 'Best Price',
    description: "Found it cheaper? We'll match any authorised retailer's price — guaranteed.",
    accent: '#e4b94a',
    glow: 'rgba(228,185,74,0.10)',
  },
];

const certifications = ['FSSAI Approved', 'GMP Certified', 'ISO 22000', 'NABL Tested', 'AYUSH Compliant'];

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

const BenefitCard = ({ icon: Icon, title, description, accent, glow, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className="group relative p-7 rounded-2xl transition-all duration-300 cursor-default"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${index * 0.08}s, transform 0.7s ease ${index * 0.08}s, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accent + '44';
        e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.12), 0 0 0 1px ${accent}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Glow blob */}
      <div
        className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: glow, filter: 'blur(24px)', transform: 'translate(-25%, -25%)' }}
      />

      {/* Icon */}
      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: glow, border: `1px solid ${accent}22` }}
      >
        <Icon className="w-6 h-6" style={{ color: accent }} />
      </div>

      <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  );
};

const BenefitsSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(228,185,74,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div ref={sectionRef} className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className="text-center mb-20"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.8s ease' }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, #e4b94a)' }} />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: '#e4b94a' }}>
              Why IronCore
            </span>
            <span className="w-8 h-px" style={{ background: 'linear-gradient(90deg, #e4b94a, transparent)' }} />
          </div>

          <h2 className="section-heading text-5xl sm:text-6xl font-black leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            The <span className="text-gradient">IronCore</span>
            <br />
            Advantage
          </h2>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Trusted by 50,000+ athletes across India who demand nothing but the best.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <BenefitCard key={i} {...b} index={i} />
          ))}
        </div>

        {/* Certifications strip */}
        <div
          className="mt-20 rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.8s ease 0.5s',
          }}
        >
          <div className="px-8 py-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {certifications.map((cert, i) => (
              <React.Fragment key={cert}>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" style={{ color: '#e4b94a' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{cert}</span>
                </div>
                {i < certifications.length - 1 && (
                  <div className="hidden sm:block w-px h-5" style={{ background: 'var(--border)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
