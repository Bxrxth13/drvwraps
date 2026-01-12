import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { usePreloadImages } from '../hooks/usePreloadImages';

const Results: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const results = [
    {
      id: 1,
      name: "Michael R.",
      age: 35,
      procedure: "FUE Hair Transplant",
      grafts: 3300,
      months: 12,
      beforeImage: "/assets/before1.webp",
      afterImage: "/assets/after1.webp",
      testimonial: "Dr. V transformed my life. The results are incredible and completely natural. I finally have the confidence I've been missing for years.",
      rating: 5
    },
    {
      id: 2,
      name: "David L.",
      age: 42,
      procedure: "FUT Hair Transplant",
      grafts: 2523,
      months: 15,
      beforeImage: "/assets/before2.webp",
      afterImage: "/assets/after2.webp",
      testimonial: "The procedure was smooth and the recovery was much easier than I expected. The results speak for themselves - absolutely amazing!",
      rating: 5
    },
    {
      id: 3,
      name: "James K.",
      age: 38,
      procedure: "FUE Hair Transplant",
      grafts: 1800,
      months: 15,
      beforeImage: "/assets/before3.webp",
      afterImage: "/assets/after3.webp",
      testimonial: "Professional, caring, and exceptional results. The team made me feel comfortable throughout the entire process.",
      rating: 5
    },
    {
      id: 4,
      name: "John D.",
      age: 45,
      procedure: "FUT Hair Transplant",
      grafts: 2000,
      months: 12,
      beforeImage: "/assets/before4.webp",
      afterImage: "/assets/after4.webp",
      testimonial: "The procedure was smooth and the recovery was much easier than I expected. The results speak for themselves - absolutely amazing!",
      rating: 5
    },
    {
      id: 5,
      name: "Robert C.",
      age: 50,
      procedure: "FUE Hair Transplant",
      grafts: 2200,
      months: 15,
      beforeImage: "/assets/before5.webp",
      afterImage: "/assets/after5.webp",
      testimonial: "The procedure was smooth and the recovery was much easier than I expected. The results speak for themselves - absolutely amazing!",
      rating: 5
    },
  ];

  // Preload all before/after images to prevent flicker
  const imageUrls = useMemo(() => {
    const urls: string[] = [];
    results.forEach((res) => {
      urls.push(res.beforeImage, res.afterImage);
    });
    return urls;
  }, [results]);

  usePreloadImages(imageUrls);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % results.length);
    setIsAutoPlaying(false); // Pause auto-play when manually navigating
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + results.length) % results.length);
    setIsAutoPlaying(false); // Pause auto-play when manually navigating
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % results.length);
    }, 2000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, results.length]);

  const currentResult = results[currentSlide];

  return (
    <section id="results" className="py-6 sm:py-12 lg:py-16 xl:py-20 bg-[#F9F7F7] overflow-hidden" role="region" aria-labelledby="results-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10 lg:mb-14 animate-slideInUp">
          <h2 id="results-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 px-2 break-words">
            <span className="text-[#112D4E]">Transformation You Can See. </span>
            <span className="text-[#112D4E]">Confidence You Can Feel.</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-[#112D4E]/80 max-w-4xl mx-auto leading-relaxed px-4 break-words">
            Experience real, natural results achieved through Dr. V's advanced hair restoration artistry, where science and compassion work together to bring confidence back to life.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-12 shadow-2xl animate-scaleIn overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-stretch">
            {/* Before/After Images */}
            <div className="relative overflow-hidden">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-4 items-stretch">
                <div className="flex flex-col h-full min-h-[260px] sm:min-h-[280px] space-y-3 sm:space-y-4">
                  <div className="text-center">
                    <div className="bg-[#112D4E] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold inline-block">
                      BEFORE
                    </div>
                  </div>
                  <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl flex-1">
                    <img
                      src={currentResult.beforeImage}
                      srcSet={`${currentResult.beforeImage} 500w`}
                      alt={`Before hair restoration treatment for ${currentResult.name}, ${currentResult.procedure}`}
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                      decoding="sync"
                      fetchPriority="high"
                      width={500}
                      height={500}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 500px"
                    />
                  </div>
                </div>
                <div className="flex flex-col h-full min-h-[260px] sm:min-h-[280px] space-y-3 sm:space-y-4">
                  <div className="text-center">
                    <div className="bg-[#3F72AF] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold inline-block">
                      AFTER
                    </div>
                  </div>
                  <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl flex-1">
                    <img
                      src={currentResult.afterImage}
                      srcSet={`${currentResult.afterImage} 500w`}
                      alt={`After hair restoration treatment for ${currentResult.name}, ${currentResult.procedure} - ${currentResult.months} months post-procedure`}
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                      decoding="sync"
                      fetchPriority="high"
                      width={500}
                      height={500}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 500px"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Controls - Moved to bottom of images */}
              <div className="flex justify-center items-center space-x-2 sm:space-x-3 mt-3 sm:mt-4" role="group" aria-label="Carousel navigation controls">
                <button
                  onClick={prevSlide}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                      e.preventDefault();
                      if (e.key === 'ArrowLeft') prevSlide();
                      else nextSlide();
                    }
                  }}
                  className="p-1.5 sm:p-2 bg-white border-2 border-gray-200 rounded-full hover:border-[#3F72AF] hover:bg-[#3F72AF] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:ring-offset-2 touch-target"
                  aria-label="Previous result"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>

                <button
                  onClick={nextSlide}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                      e.preventDefault();
                      if (e.key === 'ArrowLeft') prevSlide();
                      else nextSlide();
                    }
                  }}
                  className="p-1.5 sm:p-2 bg-white border-2 border-gray-200 rounded-full hover:border-[#3F72AF] hover:bg-[#3F72AF] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:ring-offset-2 touch-target"
                  aria-label="Next result"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Patient Information (without name/age) */}
            <div className="space-y-6 sm:space-y-8">
              {/* Procedure & Stats */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h4 className="font-semibold text-[#112D4E] mb-3 sm:mb-4 text-lg sm:text-xl">{currentResult.procedure}</h4>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#3F72AF]">{currentResult.grafts.toLocaleString()}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Grafts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#3F72AF]">{currentResult.months}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Months</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#3F72AF]" aria-hidden="true" />
                  <h4 className="font-semibold text-[#112D4E] text-lg sm:text-xl">Patient Testimonial</h4>
                </div>
                <blockquote className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed italic">
                  "{currentResult.testimonial}"
                </blockquote>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 sm:space-x-3" role="img" aria-label={`${currentResult.rating} out of 5 stars rating`}>
                <div className="flex space-x-1" aria-hidden="true">
                  {[...Array(currentResult.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-gray-600 font-medium">Excellent Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
