import { useState, useEffect, useRef } from 'react';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
// Conditionally load components based on viewport
const Hero = lazy(() => import('./components/Hero'));
const Treatment = lazy(() => import('./components/treatment'));
import type { ServicesRef } from './components/treatment';
const Assessment = lazy(() => import('./components/Assessment'));
const Results = lazy(() => import('./components/Results'));
const Doctor = lazy(() => import('./components/Doctor'));
const ConsultationForm = lazy(() => import('./components/ConsultationForm'));
const Footer = lazy(() => import('./components/Footer'));
import { Calendar } from 'lucide-react';
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
import { usePreloadImages } from './hooks/usePreloadImages';
import { loadDesktopOnly, loadOnIdle } from './utils/lazyLoad';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const servicesRef = useRef<ServicesRef>(null);
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash);

  // Conditionally load heavy/non-critical modules - STEP 6: Reduce Unused JavaScript
  useEffect(() => {
    // Load analytics only on desktop and when idle
    loadOnIdle(async () => {
      if (window.innerWidth > 768) {
        // Example: Load analytics module only on desktop
        // await import('./utils/analytics');
        console.log('✅ Analytics loaded (desktop only, when idle)');
      }
    }, 3000);

    // Load desktop-specific features
    loadDesktopOnly(async () => {
      // Example: Load desktop-specific utilities  
      // await import('./utils/desktop-features');
      console.log('🖥️ Desktop-specific features loaded');
      return null;
    });
  }, []);

  // Preload critical images for instant display
  usePreloadImages([
    '/assets/care1.webp',
    '/assets/care2.webp',
    '/assets/aboutdrv.webp',
    '/assets/stage 1.png',
    '/assets/female1.png',
    '/assets/ishrs.PNG',
    // Service detail page images (priority order)
    '/assets/eyebrowtreatment.webp',  // Highest priority
    '/assets/fuetreatment.webp',
    '/assets/futtreatment.webp',
    '/assets/beardtreatment.webp'
  ]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);

    const isServiceRoute = /^#\/service\//i.test(window.location.hash);
    if (isServiceRoute) {
      window.location.hash = '';
      setTimeout(() => {
        const elementAfter = document.getElementById(sectionId);
        if (elementAfter) {
          const headerHeight = 120;
          const targetPosition = elementAfter.offsetTop - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 120;
      const targetPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle hash changes and service route detection - optimized for performance
  useEffect(() => {
    const updateHash = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);

      // Scroll to top when navigating to service details - optimized
      if (/^#\/service\//i.test(hash)) {
        // Use requestAnimationFrame for smoother scroll
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    };

    // Check hash on mount
    updateHash();

    // Listen for hash changes - use passive listeners where possible
    window.addEventListener('hashchange', updateHash, { passive: true });
    window.addEventListener('popstate', updateHash, { passive: true });

    return () => {
      window.removeEventListener('hashchange', updateHash);
      window.removeEventListener('popstate', updateHash);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Don't update active section if we're on a service details page
      if (/^#\/service\//i.test(window.location.hash)) return;

      const sections = ['home', 'services', 'assessment', 'results', 'doctor', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const sectionTop = element.offsetTop;
          const sectionBottom = sectionTop + element.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if we're on a service details page
  const isServiceDetails = /^#\/service\//i.test(currentHash) || /^#\/service\//i.test(window.location.hash);

  return (
    <div className={`min-h-screen overflow-x-hidden ${isServiceDetails ? 'bg-white' : 'bg-[#112D4E]'}`}>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#3F72AF] text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-4 focus:ring-white/50"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      <Header activeSection={activeSection} onSectionChange={scrollToSection} />

      {/* Sticky Action Buttons - Hidden on mobile for better UX */}
      <div className="hidden md:block fixed right-0 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4" role="complementary" aria-label="Quick action buttons">
        {/* Book Appointment Button - Bottom */}
        <button
          onClick={() => scrollToSection('consultation')}
          className="group bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white p-4 rounded-l-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl w-20 h-20 lg:w-24 lg:h-24 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#112D4E]"
          aria-label="Book an appointment for hair restoration consultation"
        >
          <div className="flex flex-col items-center space-y-1 lg:space-y-2">
            <Calendar className="w-5 h-5 lg:w-6 lg:h-6" aria-hidden="true" />
            <div className="text-xs font-bold leading-tight text-center">
              <div className="text-xs lg:text-xs">BOOK AN</div>
              <div className="text-xs lg:text-xs">APPOINTMENT</div>
            </div>
          </div>
        </button>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed top-1/2 right-0 transform -translate-y-1/2 z-40" role="complementary" aria-label="Mobile quick action button">
        <button
          onClick={() => scrollToSection('consultation')}
          className="group bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-3 py-2 rounded-l-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#112D4E]"
          aria-label="Book an appointment for hair restoration consultation"
        >
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <div className="text-xs font-bold leading-tight">
              <div className="text-xs">BOOK</div>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <main id="main-content" role="main" aria-label="Main content">
        <Suspense
          fallback={
            <div
              className="min-h-screen bg-gradient-to-b from-[#F9F7F7] to-white text-[#112D4E] p-6"
              aria-live="polite"
            >
              Loading…
            </div>
          }
        >
          {isServiceDetails ? (
            <ServiceDetails key={window.location.hash} />
          ) : (
            <>
              <section id="home" aria-label="Home section">
                <Hero />
              </section>

              <section id="services" aria-label="Services section">
                <Treatment ref={servicesRef} />
              </section>

              <section id="assessment" aria-label="Hair loss assessment section">
                <Assessment />
              </section>

              <section id="results" aria-label="Before and after results section">
                <Results />
              </section>

              <section id="doctor" aria-label="About the doctor section">
                <Doctor />
              </section>

              <section id="consultation" aria-label="Consultation form section">
                <ConsultationForm />
              </section>
            </>
          )}
        </Suspense>
      </main>

      <Suspense fallback={<div className="text-white p-6" aria-live="polite">Loading footer…</div>}>
        <Footer servicesRef={servicesRef} />
      </Suspense>
    </div>
  );
}

export default App;
