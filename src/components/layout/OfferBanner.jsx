import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Tag, Gift } from 'lucide-react';

const offers = [
  { icon: Truck, text: 'Free Shipping on Orders Above ₹999' },
  { icon: Tag, text: 'Flat 10% Off — Code: SMILE' },
  { icon: Gift, text: 'View More Offers at Checkout!' },
];

const OfferBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] overflow-hidden" style={{ background: '#09090b', borderBottom: '1px solid rgba(228,185,74,0.15)' }}>
      <div
        className="flex items-center gap-6 sm:gap-12 py-2 px-4 whitespace-nowrap animate-marquee cursor-pointer"
        onClick={() => navigate('/checkout')}
      >
        {/* Duplicate items for seamless loop */}
        {[...offers, ...offers, ...offers].map((offer, i) => {
          const Icon = offer.icon;
          return (
            <span key={i} className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-white/95 font-medium">
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300 flex-shrink-0" />
              {offer.text}
              <span className="text-white/40 ml-3 sm:ml-6">✦</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default OfferBanner;
