import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&q=90',
    eyebrow: 'New Collection 2025',
    title: 'Unleash Your',
    highlight: 'Peak Performance',
    subtitle: 'Elite-grade supplements engineered for athletes who refuse to settle for average.',
    cta: 'Shop Collection',
    ctaLink: '/products',
    stat1: { value: '50K+', label: 'Athletes' },
    stat2: { value: '100%', label: 'Authentic' },
    stat3: { value: '4.9★', label: 'Rating' },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1920&h=1080&fit=crop&q=90',
    eyebrow: 'Best Seller',
    title: 'Fuel Your',
    highlight: 'Every Rep',
    subtitle: 'High-performance pre-workout and whey protein formulas trusted by champions.',
    cta: 'Shop Protein',
    ctaLink: '/products',
    stat1: { value: '30g', label: 'Protein/Serving' },
    stat2: { value: 'Lab', label: 'Tested & Pure' },
    stat3: { value: 'Free', label: 'Shipping ₹999+' },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=1080&fit=crop&q=90',
    eyebrow: 'Recovery Science',
    title: 'Recover Faster,',
    highlight: 'Build More',
    subtitle: 'Science-backed recovery supplements to maximise gains and minimise downtime.',
    cta: 'Explore Recovery',
    ctaLink: '/products',
    stat1: { value: '72hr', label: 'Delivery' },
    stat2: { value: 'FSSAI', label: 'Approved' },
    stat3: { value: '10%', label: 'Off: SMILE' },
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoPlayRef = useRef(null);
  const progressRef = useRef(null);
  const navigate = useNavigate();

  const SLIDE_DURATION = 6000;

  const startProgress = () => {
    setProgress(0);
    const startTime = Date.now();
    clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
    }, 30);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 400);
    startProgress();
  };

  useEffect(() => {
    startProgress();
    autoPlayRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 400);
      startProgress();
    }, SLIDE_DURATION);

    return () => {
      clearInterval(autoPlayRef.current);
      clearInterval(progressRef.current);
    };
  }, []);

  const slide = slides[currentSlide];

  const scrollDown = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-950 flex flex-col">
      {/* Background Image with Ken Burns */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === currentSlide ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: i === currentSlide ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 8s ease-out',
            }}
          />
          {/* Multi-layer dark overlay for premium look */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.80) 40%, rgba(9,9,11,0.30) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, transparent 50%)' }} />
        </div>
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Radial glow accent */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(228,185,74,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 pt-36 pb-24">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div
              key={`eyebrow-${currentSlide}`}
              className="animate-fade-up inline-flex items-center gap-3 mb-8"
            >
              <span className="w-8 h-px" style={{ background: 'linear-gradient(90deg, #e4b94a, #f97316)' }} />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#e4b94a' }}>
                {slide.eyebrow}
              </span>
            </div>

            {/* Main Heading */}
            <div
              key={`title-${currentSlide}`}
              className={`transition-all duration-400 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}
              style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
            >
              <h1 className="section-heading text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight text-white mb-6">
                {slide.title}
                <br />
                <span className="text-gradient">{slide.highlight}</span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed mb-10 text-balance">
                {slide.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-16">
                <button
                  onClick={() => navigate(slide.ctaLink)}
                  className="group btn-primary inline-flex items-center gap-3"
                >
                  {slide.cta}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={scrollDown}
                  className="btn-secondary inline-flex items-center gap-3"
                >
                  Explore All
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div
              key={`stats-${currentSlide}`}
              className="animate-fade-up-delay-3 flex items-center gap-10 border-t border-white/10 pt-8"
            >
              {[slide.stat1, slide.stat2, slide.stat3].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl font-black text-white">{stat.value}</span>
                  <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Controls — Bottom bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 pb-10 flex items-center justify-between">
        {/* Progress Indicators */}
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === currentSlide ? '64px' : '24px', background: 'rgba(255,255,255,0.15)' }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === currentSlide && (
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #e4b94a, #f97316)' }}
                />
              )}
            </button>
          ))}
          <span className="text-zinc-600 text-xs font-medium ml-2">
            0{currentSlide + 1} / 0{slides.length}
          </span>
        </div>

        {/* Scroll Down hint */}
        <button
          onClick={scrollDown}
          className="flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors group"
          aria-label="Scroll to products"
        >
          <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
