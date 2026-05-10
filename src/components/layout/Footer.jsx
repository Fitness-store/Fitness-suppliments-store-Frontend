import React from 'react';
import { Dumbbell, Mail, Phone, MapPin, Globe, Share2, MessageCircle, Video } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Protein', href: '#' },
      { name: 'Pre-Workout', href: '#' },
      { name: 'Vitamins', href: '#' },
      { name: 'Creatine', href: '#' },
      { name: 'Weight Gainers', href: '#' },
    ],
    support: [
      { name: 'Contact Us', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Shipping Info', href: '#' },
      { name: 'Returns', href: '#' },
      { name: 'Track Order', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
    ],
  };

  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-grad)' }}>
                <Dumbbell className="w-6 h-6" style={{ color: '#09090b' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>IronCore</span>
            </div>
            <p className="mb-6 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              Your trusted partner in fitness. Premium supplements, expert advice, and unmatched quality since 2020.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {[
                { icon: Mail, text: 'support@ironcore.com' },
                { icon: Phone, text: '+1 (800) 123-4567' },
                { icon: MapPin, text: '123 Fitness Street, Gym City' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
                    <Icon className="w-5 h-5" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              © {currentYear} IronCore. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[Globe, Share2, MessageCircle, Video].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
                  aria-label="Social Link"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              <a href="#" className="hover:opacity-80 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:opacity-80 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
