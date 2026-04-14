import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  if (!product) return null;

  const handleCardClick = (e) => {
    // Don't navigate if clicking the add to cart button
    if (e.target.closest('button')) return;
    navigate(`/product/${product.productId}`);
  };

  const { 
    productId, 
    name, 
    brand, 
    description, 
    mrp, 
    finalPrice, 
    imageUrl,
    stock,
    rating,
    flavor,
    netQuantity,
    isVegetarian,
    categoryName 
  } = product;

  const discount = mrp && finalPrice ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;
  const hasStock = stock > 0;

  return (
    <article 
      className="product-card group h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-gray-400 text-center">
              <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded-xl" />
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-accent-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Veg/Non-Veg Badge */}
        {isVegetarian !== undefined && (
          <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-sm ${
            isVegetarian 
              ? 'bg-green-100 border-green-600' 
              : 'bg-red-100 border-red-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isVegetarian ? 'bg-green-600' : 'bg-red-600'
            }`} />
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
            aria-label={`Add ${name} to cart`}
            disabled={!hasStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {hasStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category */}
        {categoryName && (
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wider mb-2">
            {categoryName}
          </span>
        )}

        {/* Brand */}
        {brand && (
          <p className="text-sm text-gray-500 mb-1">{brand}</p>
        )}

        {/* Name */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {description}
          </p>
        )}

        {/* Flavor & Quantity */}
        {(flavor || netQuantity) && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            {flavor && <span className="bg-gray-100 px-2 py-1 rounded-md">{flavor}</span>}
            {netQuantity && <span className="bg-gray-100 px-2 py-1 rounded-md">{netQuantity}</span>}
          </div>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>
        )}

        {/* Price & Stock */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{finalPrice?.toLocaleString() || 'N/A'}
              </span>
              {mrp > finalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{mrp?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Stock Indicator */}
          <div className={`flex items-center gap-1 text-sm font-medium ${
            hasStock ? 'text-green-600' : 'text-red-500'
          }`}>
            <Check className={`w-4 h-4 ${hasStock ? '' : 'hidden'}`} />
            <span>{hasStock ? `In Stock (${stock})` : 'Out of Stock'}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
