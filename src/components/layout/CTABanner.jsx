import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Copy, Check } from 'lucide-react';

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

const CTABanner = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText('SMILE').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="absolute inset-0 grid-pattern opacity-60" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(228,185,74,0.2)',
            boxShadow: 'var(--shadow-card)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(228,185,74,0.12), transparent)' }}
          />
          {/* Corner glows */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(228,185,74,0.07), transparent)', filter: 'blur(40px)' }} />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07), transparent)', filter: 'blur(40px)' }} />

          {/* Decorative rings */}
          <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full pointer-events-none" style={{ border: '1px solid rgba(228,185,74,0.07)' }} />
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full pointer-events-none" style={{ border: '1px solid rgba(228,185,74,0.05)' }} />

          <div className="relative z-10 px-10 py-16 lg:px-20 lg:py-20">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ background: 'rgba(228,185,74,0.08)', border: '1px solid rgba(228,185,74,0.2)' }}>
                <Zap className="w-4 h-4" style={{ color: '#e4b94a' }} />
                <span className="text-sm font-semibold" style={{ color: '#e4b94a' }}>Limited Time Offer</span>
              </div>

              {/* Headline */}
              <h2 className="section-heading text-5xl lg:text-6xl font-black leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
                Your First Step to
                <br />
                <span className="text-gradient">Greatness</span>
                {' '}Starts Now
              </h2>

              <p className="text-lg leading-relaxed max-w-xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
                Use code <strong style={{ color: 'var(--text-primary)' }}>SMILE</strong> at checkout and get{' '}
                <span className="font-bold" style={{ color: '#e4b94a' }}>flat 10% off</span>{' '}
                your entire order. No minimum. No excuses.
              </p>

              {/* Coupon Block */}
              <div
                className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl mb-10"
                style={{ background: 'var(--bg-subtle)', border: '1px dashed rgba(228,185,74,0.35)' }}
              >
                <span className="font-black text-2xl tracking-[0.25em]" style={{ color: '#e4b94a', fontFamily: 'monospace' }}>
                  SMILE
                </span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(228,185,74,0.12)',
                    color: copied ? '#34d399' : '#e4b94a',
                    border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(228,185,74,0.25)'}`,
                  }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/products')}
                  className="group btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center"
                >
                  Browse All Products
                </button>
              </div>

              {/* Fine print */}
              <p className="text-xs mt-8 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Free shipping on orders ₹999+ &nbsp;·&nbsp; 7-day returns &nbsp;·&nbsp; FSSAI Approved &nbsp;·&nbsp; 100% Authentic
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
