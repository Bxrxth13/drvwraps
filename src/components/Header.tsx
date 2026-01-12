import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  const lastMenuItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Focus management for mobile menu
  useEffect(() => {
    if (isMenuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [isMenuOpen]);

  // Keyboard navigation for mobile menu
  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    switch (event.key) {
      case 'Escape':
        setIsMenuOpen(false);
        break;
      case 'Tab':
        if (event.shiftKey && itemId === 'home') {
          event.preventDefault();
          lastMenuItemRef.current?.focus();
        } else if (!event.shiftKey && itemId === 'About') {
          event.preventDefault();
          firstMenuItemRef.current?.focus();
        }
        break;
    }
  };

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Treatments', id: 'services' },
    { name: 'Assessment', id: 'assessment' },
    { name: 'About', id: 'doctor' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gradient-to-r from-[#3F72AF] to-[#112D4E] shadow-2xl' 
          : 'bg-transparent'
      }`}
      role="banner"
      aria-label="Main navigation"
    >
      {/* Full width background coverage to prevent any lines */}
      {isScrolled && (
        <>
          <div className="absolute inset-0 -left-8 -right-8 bg-gradient-to-r from-[#3F72AF] to-[#112D4E]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#3F72AF] to-[#112D4E]"></div>
        </>
      )}
      <nav className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 relative" role="navigation" aria-label="Primary navigation">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20 lg:h-24">
          {/* Logo and Brand */}
          <div className="flex items-center group cursor-pointer min-w-0 flex-shrink-0">
            <h1 className={`text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold tracking-wide transition-colors duration-300 break-words ${
              isScrolled ? 'text-white' : 'text-white'
            }`}>
              Dr V's Hair Clinic
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1" role="menubar">
            {navigation.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white ${
                    activeSection === item.id 
                      ? 'text-[#112D4E] bg-white shadow-lg' 
                      : isScrolled 
                        ? 'text-white hover:text-white hover:bg-white/20' 
                        : 'text-white hover:text-white hover:bg-white/10'
                  }`}
                  role="menuitem"
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  aria-label={`Navigate to ${item.name} section`}
                  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSectionChange(item.id);
                    }
                  }}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <div className={`w-1 h-6 rounded-full transition-all duration-300 ${
                      isScrolled ? 'bg-[#3F72AF]' : 'bg-white'
                    } absolute right-2 top-1/2 transform -translate-y-1/2`}></div>
                  )}
                </button>
              </div>
            ))}
            
            {/* Desktop Phone Number */}
            <div className="ml-6 pl-6 border-l border-white/20">
              <a 
                href="tel:+15551234567" 
                className={`group flex items-center space-x-2 px-3 py-1.5 rounded-none transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-md border border-white/30 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm hover:shadow-md'
                }`}
                aria-label="Call us at +1 919-249-5900"
              >
                <div className={`p-1.5 rounded-none transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-white/20 group-hover:bg-white/30' 
                    : 'bg-white/15 group-hover:bg-white/25'
                }`}>
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium opacity-80 leading-none">Call Now</span>
                  <span className="text-xs font-semibold leading-tight">+1 919-249-5900</span>
                </div>
              </a>
            </div>
          </div>
          
          {/* Mobile Phone Number and Menu Button */}
          <div className="lg:hidden flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Mobile Phone Number - Professional Design */}
            <a 
              href="tel:+19192495900" 
              className={`group flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-none transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-md border border-white/30 text-white shadow-md hover:shadow-lg' 
                  : 'bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm hover:shadow-md'
              }`}
              aria-label="Call us at +1 919-249-5900"
            >
              <div className={`p-0.5 sm:p-1 rounded-none transition-all duration-300 ${
                isScrolled 
                  ? 'bg-white/20 group-hover:bg-white/30' 
                  : 'bg-white/15 group-hover:bg-white/25'
              }`}>
                <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] sm:text-[10px] font-medium opacity-80 leading-none whitespace-nowrap">Call Now</span>
                <span className="text-[10px] sm:text-xs font-semibold leading-tight truncate">+1 919-249-5900</span>
              </div>
            </a>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 motion-reduce:transition-none transform hover:scale-105 active:scale-95 flex-shrink-0 ${
                isScrolled 
                  ? 'text-white hover:bg-white/20 shadow-lg' 
                  : 'text-white hover:bg-white/10 shadow-md'
              }`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="true"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            ref={mobileMenuRef}
            className="lg:hidden pb-4 sm:pb-6 animate-slideInUpFast mobile-menu-container"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-6 border transition-all duration-200 ${
              isScrolled 
                ? 'bg-white/20 backdrop-blur-md border-white/30 shadow-xl' 
                : 'bg-white/10 backdrop-blur-md border-white/20'
            }`}>
              <div className="flex flex-col space-y-2">
                {navigation.map((item, index) => (
                  <button
                    key={item.id}
                    ref={index === 0 ? firstMenuItemRef : index === navigation.length - 1 ? lastMenuItemRef : undefined}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => handleKeyDown(e, item.id)}
                    className={`text-left font-semibold py-3 sm:py-4 px-3 sm:px-4 rounded-xl transition-all duration-150 ${
                      activeSection === item.id 
                        ? isScrolled 
                          ? 'bg-white text-[#112D4E] shadow-md' 
                          : 'bg-white/20 text-white'
                        : isScrolled 
                          ? 'text-white hover:bg-white/20' 
                          : 'text-white hover:bg-white/10'
                    }`}
                    role="menuitem"
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    aria-label={`Navigate to ${item.name} section`}
                  >
                    {item.name}
                    {activeSection === item.id && (
                      <div className={`w-1 h-4 sm:h-6 rounded-full transition-all duration-150 ${
                        isScrolled ? 'bg-[#3F72AF]' : 'bg-white'
                      } absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2`}></div>
                    )}
                  </button>
                ))}
                <div className="pt-4 border-t border-white/20 mt-4">
                  <a 
                    href="tel:+19192495900"
                    className={`flex items-center space-x-3 mb-4 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:opacity-90 cursor-pointer ${
                      isScrolled 
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    aria-label="Call us at +1 919-249-5900"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span className="font-medium text-sm">+1 919-249-5900</span>
                  </a>
                  <button 
                    onClick={() => {
                      onSectionChange('consultation');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#3F72AF] to-[#112D4E] text-white hover:from-[#112D4E] hover:to-[#3F72AF] shadow-lg transition-all duration-150"
                    role="menuitem"
                    aria-label="Schedule a consultation"
                  >
                    Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default React.memo(Header);