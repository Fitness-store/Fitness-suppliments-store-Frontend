import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Dumbbell, Menu, X, ShoppingCart, User, Search, ChevronDown, Package } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const { cartCount } = useCart();

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

  const navLinks = [
    { name: 'Home', href: '#', type: 'scroll' },
    { name: 'Products', href: '/products', type: 'page' },
    { name: 'Cart', href: '/cart', type: 'page' },
    { name: 'About', href: '/about', type: 'page' },
    { name: 'Contact', href: '#footer', type: 'scroll' },
  ];

  const handleNavigation = (link) => {
    if (link.type === 'page') {
      navigate(link.href);
    } else {
      // Scroll type - only works on home page
      if (location.pathname !== '/') {
        navigate('/' + link.href);
      } else {
        if (link.href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.querySelector(link.href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-950/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">IronCore</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link)}
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-gray-300 hover:text-white transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && !isAuthenticated ? (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              ) : null}
            </button>
            {isAuthenticated && (
              <div className="profile-dropdown relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1 p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser?.fullName || 'User'}</p>
                      <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/orders'); setIsProfileDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </button>
                    <button
                      onClick={() => { navigate('/profile'); setIsProfileDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
                className="px-3 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link)}
                  className="text-gray-300 hover:text-white font-medium transition-colors text-left"
                >
                  {link.name}
                </button>
              ))}
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }}
                    className="text-gray-300 hover:text-white font-medium transition-colors text-left"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                    className="text-gray-300 hover:text-white font-medium transition-colors text-left"
                  >
                    Profile
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                  <button className="p-2 text-gray-300 hover:text-white transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className="p-2 text-gray-300 hover:text-white transition-colors relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
