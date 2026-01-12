import React, { useState, useEffect, useMemo } from 'react';
import { Award } from 'lucide-react';
import { usePreloadImages } from '../hooks/usePreloadImages';

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading] = useState(false); // Don't block initial render

  // Professional hair restoration images - using high-quality, relevant images
  const images = useMemo(() => [
    {
      src: "/assets/image1.webp",
      alt: "Professional Hair Restoration Care",
      width: 1200,
      height: 1600
    },
    {
      src: "/assets/image2.webp",
      alt: "Professional Hair Transplant Consultation",
      width: 1200,
      height: 1600
    },
    {
      src: "/assets/image3.webp",
      alt: "Hair Transplant Medical Procedure - Professional Clinical Environment",
      width: 1200,
      height: 1600
    },
  ], []);

  // Preload all images for instant switching
  const imageUrls = useMemo(() => images.map(img => img.src), [images]);
  usePreloadImages(imageUrls);

  // Auto-advance carousel
  useEffect(() => {
    if (isLoading) return; // Don't start auto-advance until images are loaded

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
        return newIndex;
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length, isLoading]);


  const scrollToResults = () => {
    const element = document.getElementById('results');
    if (element) {
      const headerHeight = 120; // Account for fixed header
      const targetPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      className="relative min-h-[85vh] sm:min-h-screen flex items-center pt-16 sm:pt-20 lg:pt-24 xl:pt-28 pb-8 sm:pb-12 lg:pb-16 bg-[#112D4E] overflow-hidden"
      role="banner"
      aria-label="Hero section with hair restoration information"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-end">
          {/* Left Side - Content */}
          <div className="text-white space-y-3 sm:space-y-4 lg:space-y-6 text-center md:text-left mt-0 sm:mt-0">
            {/* Title Section */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                <span className="block text-white/90 font-light mb-1 sm:mb-2 whitespace-nowrap">You deserve to feel</span>
                <span className="block">
                  <span className="text-[#3F72AF] font-bold animate-[heartbeat_1.5s_ease-in-out_infinite] hover:animate-[heartbeat_0.8s_ease-in-out_infinite] transition-all duration-300 cursor-pointer">YOU</span>
                  <span className="text-[#F9F7F7] font-semibold"> again!</span>
                </span>
              </h1>

              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium px-2 sm:px-0">
                Experience world-class hair restoration with cutting-edge techniques.
                Transform your appearance and regain your confidence naturally.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center md:justify-start">
              <button
                onClick={scrollToResults}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToResults();
                  }
                }}
                className="border-2 border-white/30 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl hover:border-white hover:bg-white/10 transition-all duration-300 font-semibold text-base sm:text-lg lg:text-xl focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#112D4E] touch-target"
                aria-label="View hair restoration results and before/after photos"
              >
                <span>View Results</span>
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-4 pt-2 sm:pt-3 md:pt-4" role="region" aria-label="Clinic statistics and achievements">
              {[
                // { value: '5000+', label: 'Happy Patients', icon: Users },
                // { value: '15+', label: 'Years Experience', icon: Award },
                { value: 'Fellowship', label: 'Trained', icon: Award },
                { value: 'ISHRS', label: 'Member', icon: Award }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/15 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 hover:bg-white/10 hover:border-white/25 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-1 group-hover:text-[#3F72AF] transition-colors duration-300 break-words">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs lg:text-sm text-white/70 font-medium group-hover:text-white/90 transition-colors duration-300 break-words leading-tight">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Carousel */}
          <div className="relative flex justify-center md:justify-end mb-4 sm:mb-6 md:mb-0 items-end">
            <div className="relative w-full max-w-sm sm:max-w-sm md:max-w-[336px] lg:max-w-[384px] xl:max-w-[432px] md:mr-[10%]">
              {/* Main Image Carousel Container */}
              <div
                className="aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl relative group"
                role="region"
                aria-label="Hair restoration before and after image carousel"
                aria-live="polite"
                aria-atomic="false"
              >
                {/* Eye-catchy Border Overlay */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#3F72AF]/25 via-white/5 to-[#3F72AF]/25 blur-md opacity-70 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="absolute inset-0 border-[3px] sm:border-[4px] border-white/25 rounded-xl sm:rounded-2xl z-30 pointer-events-none group-hover:border-[#3F72AF]/50 transition-colors duration-500"></div>
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#3F72AF]/25 via-transparent to-[#3F72AF]/25 rounded-xl sm:rounded-2xl z-20 pointer-events-none animate-pulse opacity-60"></div>

                {/* Image Container */}
                <div className="w-full h-full relative overflow-hidden">
                  {/* Loading State */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-20 rounded-xl sm:rounded-2xl">
                      <div className="text-center">
                        <div className="animate-spin motion-reduce:animate-none rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-white mx-auto mb-2 sm:mb-3" role="status" aria-label="Loading images"></div>
                        <p className="text-white text-sm sm:text-base font-medium">Loading Images...</p>
                      </div>
                    </div>
                  )}

                  <div className="w-full h-full relative overflow-hidden">
                    <img
                      src={images[currentImageIndex].src}
                      srcSet={`${images[currentImageIndex].src} ${images[currentImageIndex].width}w`}
                      alt={images[currentImageIndex].alt}
                      className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out"
                      fetchPriority={currentImageIndex === 0 ? "high" : "auto"}
                      width={images[currentImageIndex].width}
                      height={images[currentImageIndex].height}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 336px, 432px"
                      key={`image-${currentImageIndex}`}
                      role="img"
                      aria-label={`${images[currentImageIndex].alt} - Image ${currentImageIndex + 1} of ${images.length}`}
                    />
                  </div>

                  {/* Dots Indicator
                  {images.length > 1 && (
                    <div 
                      className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-1.5 z-10"
                      role="tablist"
                      aria-label="Image navigation dots"
                    >
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-[1.5px] h-[1.5px] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent touch-target ${
                            index === currentImageIndex 
                              ? 'bg-white w-[3px] sm:w-[4px] shadow-md' 
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                          role="tab"
                          aria-label={`Go to image ${index + 1}`}
                          aria-selected={index === currentImageIndex}
                          aria-controls={`image-${index}`}
                        />
                      ))}
                    </div>
                  )} */}

                </div>
              </div>

              {/* Floating Elements - Hidden on very small screens */}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);