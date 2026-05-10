import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Check, Zap } from 'lucide-react';
import { useCart } from '../../context/useCart';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [cartMessage, setCartMessage] = useState('');
  const [adding, setAdding] = useState(false);
  
  if (!product) return null;

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (!product?.productId) return;
    navigate(`/product/${product.productId}`);
  };

  const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const { name, brand, description, imageUrl, rating, categoryName } = product;
  const { flavor, netQuantity, mrp, finalPrice, stock } = defaultVariant || {};

  const discount = mrp && finalPrice ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;
  const hasStock = stock > 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!defaultVariant || adding) return;
    setAdding(true);
    const cartProduct = {
      ...product,
      variantId: defaultVariant.id,
      flavor: defaultVariant.flavor,
      netQuantity: defaultVariant.netQuantity,
      mrp: defaultVariant.mrp,
      finalPrice: defaultVariant.finalPrice,
      stock: defaultVariant.stock,
    };
    const result = await addToCart(cartProduct, 1);
    setAdding(false);
    setCartMessage(result.message);
    setTimeout(() => setCartMessage(''), 2000);
  };

  return (
    <article
      className="product-card group h-full flex flex-col cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-xl" style={{ background: 'var(--bg-input)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No Image</span>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

        {/* Discount Badge */}
        {discount > 0 && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-black tracking-wider"
            style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)', color: '#09090b' }}
          >
            -{discount}%
          </div>
        )}

        {/* Category pill */}
        {categoryName && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {categoryName}
          </div>
        )}

        {/* Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleAddToCart}
            disabled={!hasStock || adding}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: hasStock ? 'linear-gradient(135deg, #e4b94a, #f97316)' : 'rgba(0,0,0,0.4)',
              color: hasStock ? '#09090b' : 'rgba(255,255,255,0.4)',
              boxShadow: hasStock ? '0 8px 24px rgba(228,185,74,0.35)' : 'none',
            }}
            aria-label={`Add ${name} to cart`}
          >
            {adding ? <Zap className="w-4 h-4 animate-bounce" /> : <ShoppingCart className="w-4 h-4" />}
            {adding ? 'Adding...' : hasStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Brand */}
        {brand && (
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#e4b94a' }}>
            {brand}
          </p>
        )}

        {/* Name */}
        <h3 className="font-bold text-base mb-2 line-clamp-2 leading-snug transition-colors" style={{ color: 'var(--text-primary)' }}>
          {name}
        </h3>

        {/* Flavor & Quantity pills */}
        {(flavor || netQuantity) && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {flavor && (
              <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {flavor}
              </span>
            )}
            {netQuantity && (
              <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {netQuantity}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{rating}</span>
          </div>
        )}

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                ₹{finalPrice?.toLocaleString('en-IN') || 'N/A'}
              </span>
              {mrp > finalPrice && (
                <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>
                  ₹{mrp?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Glowing stock dot */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: hasStock ? '#34d399' : '#ef4444', boxShadow: hasStock ? '0 0 6px #34d399' : '0 0 6px #ef4444' }}
            />
            <span className="text-xs font-medium" style={{ color: hasStock ? '#34d399' : '#ef4444' }}>
              {hasStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {cartMessage && (
          <div className="flex items-center gap-1.5 mt-3 text-xs font-medium" style={{ color: '#34d399' }}>
            <Check className="w-3.5 h-3.5" />
            {cartMessage}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
