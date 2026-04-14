import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Dumbbell, Menu, X, ShoppingCart, User, Search } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
            <button className="p-2 text-gray-300 hover:text-white transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {/* Cart count badge - hidden until cart state is implemented */}
              {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span> */}
            </button>
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
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
              <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-300 hover:text-white transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  {/* Cart count badge - hidden until cart state is implemented */}
                  {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    0
                  </span> */}
                </button>
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
