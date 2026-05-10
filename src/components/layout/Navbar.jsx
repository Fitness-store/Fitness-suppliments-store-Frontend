import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Dumbbell, Menu, X, ShoppingCart, User, Search, ChevronDown, Package, Sun, Moon } from 'lucide-react';
import OfferBanner from './OfferBanner';
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';
import { ThemeContext } from '../../context/ThemeContext';
import { fetchCategories } from '../../services/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const searchInputRef = useRef(null);
  const productsDropdownRef = useRef(null);
  const productsTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  // Load categories for the dropdown
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response?.success && Array.isArray(response?.categories)) {
          setCategories(response.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isSearchOpen]);

  const navLinks = [
    { name: 'Home', href: '/', type: 'page' },
    { name: 'Products', href: '/products', type: 'products' },
    { name: 'Cart', href: '/cart', type: 'page' },
    { name: 'About', href: '/about', type: 'page' },
    { name: 'Contact', href: '#footer', type: 'scroll' },
  ];

  const handleNavigation = (link) => {
    if (link.type === 'page' || link.type === 'products') {
      navigate(link.href);
    } else if (link.type === 'scroll') {
      if (location.pathname !== '/') {
        // Navigate to home first, then scroll after a small delay
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(link.href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      } else {
        const element = document.querySelector(link.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleProductsMouseEnter = () => {
    if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current);
    setIsProductsDropdownOpen(true);
  };

  const handleProductsMouseLeave = () => {
    productsTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 200);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/products');
    }
    setIsSearchOpen(false);
    setSearchInput('');
    setIsMobileMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchInput('');
    }
  };

  return (
    <>
    <OfferBanner />
    <nav
      className={`fixed top-7 sm:top-8 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
        isScrolled
          ? 'shadow-lg py-2 sm:py-3'
          : 'py-3 sm:py-5'
      }`}
      style={{ background: 'var(--nav-bg)', borderBottom: isScrolled ? '1px solid var(--nav-border)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - always navigates to homepage */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'var(--accent-gold)' }}>
              <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#09090b' }} />
            </div>
            <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>IronCore</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.type === 'products' ? (
                /* Products link with hover dropdown */
                <div
                  key={link.name}
                  className="relative"
                  ref={productsDropdownRef}
                  onMouseEnter={handleProductsMouseEnter}
                  onMouseLeave={handleProductsMouseLeave}
                >
                  <button
                    onClick={() => handleNavigation(link)}
                    className="font-medium transition-colors hover:opacity-100 flex items-center gap-1"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {link.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Products Dropdown */}
                  {isProductsDropdownOpen && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 rounded-xl shadow-xl border py-2 z-50"
                      style={{ background: 'var(--dropdown-bg)', borderColor: 'var(--border)' }}
                    >
                      {/* Arrow */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45" style={{ background: 'var(--dropdown-bg)', borderLeft: '1px solid var(--border)', borderTop: '1px solid var(--border)' }} />
                      
                      <button
                        onClick={() => { navigate('/products'); setIsProductsDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm font-semibold flex items-center gap-2 transition-colors"
                        style={{ color: 'var(--accent-gold)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--dropdown-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Package className="w-4 h-4" />
                        All Products
                      </button>
                      
                      <div className="mx-3 my-1" style={{ borderBottom: '1px solid var(--border)' }} />
                      
                      {categories.length > 0 ? (
                        categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => { navigate(`/products?category=${cat.id}`); setIsProductsDropdownOpen(false); }}
                            className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--dropdown-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                          >
                            {cat.name}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>Loading...</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link)}
                  className="font-medium transition-colors hover:opacity-100"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {link.name}
                </button>
              )
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative w-5 h-5">
                <Sun
                  className="absolute inset-0 w-5 h-5 transition-all duration-300"
                  style={{ opacity: isDark ? 0 : 1, transform: isDark ? 'rotate(90deg) scale(0.5)' : 'rotate(0deg) scale(1)' }}
                />
                <Moon
                  className="absolute inset-0 w-5 h-5 transition-all duration-300"
                  style={{ opacity: isDark ? 1 : 0, transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)' }}
                />
              </div>
            </button>
            <button
              onClick={toggleSearch}
              className="p-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle search"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="p-2 transition-colors relative"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {isAuthenticated && (
              <div className="profile-dropdown relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1 p-2 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border py-2 z-50"
                    style={{ background: 'var(--dropdown-bg)', borderColor: 'var(--border)' }}
                  >
                    <div className="px-4 py-2 mb-1" style={{ borderBottom: '1px solid var(--border)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{currentUser?.fullName || 'User'}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{currentUser?.email || ''}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/orders'); setIsProfileDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--dropdown-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </button>
                    <button
                      onClick={() => { navigate('/profile'); setIsProfileDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--dropdown-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                  </div>
                )}
              </div>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-2 text-sm font-semibold rounded-lg transition-colors"
                style={{ background: 'var(--accent-gold)', color: '#09090b' }}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Actions + Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            {/* Mobile Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="p-2 transition-colors relative"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 text-[10px] rounded-full flex items-center justify-center font-bold"
                  style={{ background: 'var(--accent-gold)', color: '#09090b' }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Profile */}
            {isAuthenticated ? (
              <div className="profile-dropdown relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="p-2 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <User className="w-5 h-5" />
                </button>
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border py-2 z-50"
                    style={{ background: 'var(--dropdown-bg)', borderColor: 'var(--border)' }}
                  >
                    <div className="px-4 py-2 mb-1" style={{ borderBottom: '1px solid var(--border)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{currentUser?.fullName || 'User'}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{currentUser?.email || ''}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/orders'); setIsProfileDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--dropdown-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </button>
                    <button
                      onClick={() => { navigate('/profile'); setIsProfileDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--dropdown-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                style={{ background: 'var(--accent-gold)', color: '#09090b' }}
              >
                Login
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar (slides down) */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products, brands, supplements..."
                className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="p-2 text-gray-400 hover:text-white transition-colors mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden mt-4 pb-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="flex flex-col gap-4 pt-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div
                  className="flex items-center rounded-xl overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <Search className="w-5 h-5 ml-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-3 py-2.5 bg-transparent focus:outline-none text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 text-sm font-semibold"
                    style={{ background: 'var(--accent-gold)', color: '#09090b' }}
                  >
                    Go
                  </button>
                </div>
              </form>

              {navLinks.map((link) => (
                link.type === 'products' ? (
                  <div key={link.name}>
                    <button
                      onClick={() => handleNavigation(link)}
                      className="font-medium transition-colors text-left"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {link.name}
                    </button>
                    {/* Mobile category sub-links */}
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { navigate(`/products?category=${cat.id}`); setIsMobileMenuOpen(false); }}
                          className="text-sm text-left transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link)}
                    className="font-medium transition-colors text-left"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.name}
                  </button>
                )
              ))}
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }}
                    className="font-medium transition-colors text-left"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                    className="font-medium transition-colors text-left"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Profile
                  </button>
                </>
              )}
              <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => navigate('/cart')}
                  className="p-2 transition-colors relative"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-xs rounded-full flex items-center justify-center"
                      style={{ background: 'var(--accent-gold)', color: '#09090b', fontWeight: 700 }}>
                      {cartCount}
                    </span>
                  )}
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-2 text-sm font-semibold rounded-lg"
                    style={{ background: 'var(--accent-gold)', color: '#09090b' }}
                  >
                    Login
                  </button>
                )}
                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg transition-all ml-auto"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
