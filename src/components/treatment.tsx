import React, { useState, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import { Scissors, Zap, Eye, User, CheckCircle, Droplets, Sun, Palette, Pill, Heart, Apple } from 'lucide-react';

export interface ServicesRef {
  highlightService: (serviceName: string) => void;
}

const Treatment = forwardRef<ServicesRef>((_, ref) => {
  const [activeTab, setActiveTab] = useState<'surgical' | 'non-surgical'>('surgical');
  const [highlightedService, setHighlightedService] = useState<string | null>(null);

  // Expose highlightService function to parent components
  useImperativeHandle(ref, () => ({
    highlightService: (serviceName: string) => {
      setHighlightedService(serviceName);

      // Auto-switch to the correct tab if needed
      const surgicalServiceNames = surgicalServices.map(s => s.title);
      const nonSurgicalServiceNames = nonSurgicalServices.map(s => s.title);

      if (surgicalServiceNames.includes(serviceName)) {
        setActiveTab('surgical');
      } else if (nonSurgicalServiceNames.includes(serviceName)) {
        setActiveTab('non-surgical');
      }

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedService(null);
      }, 3000);
    }
  }));

  // Check session storage on mount to restore the last viewed tab
  React.useEffect(() => {
    const lastCategory = sessionStorage.getItem('lastServiceCategory');
    if (lastCategory === 'non-surgical' || lastCategory === 'surgical') {
      setActiveTab(lastCategory as 'surgical' | 'non-surgical');
      // Clear the stored value after using it
      sessionStorage.removeItem('lastServiceCategory');
    }
  }, []);

  const surgicalServices = [
    {
      icon: Scissors,
      title: "FUE Hair Transplant",
      description: "Advanced follicular unit extraction procedure using individual follicle harvesting for natural-looking hair restoration",
      features: [
        // "No visible linear scarring", 
        // "Minimal downtime recovery", 
        // "Precision graft placement", 
        // "Suitable for all hair types", 
        // "Natural hairline design", 
        // "Long-lasting permanent results"
      ]
    },
    {
      icon: Zap,
      title: "FUT Hair Transplant",
      description: "Strip harvesting method providing maximum graft density for comprehensive hair restoration in single session",
      features: [
        // "Optimal graft survival rate", 
        // "Complete donor coverage area", 
        // "Ideal for extensive baldness", 
        // "Cost-efficient for large areas", 
        // "Single session procedure", 
        // "Natural hair growth pattern"
      ]
    },
    {
      icon: Eye,
      title: "Eyebrow Transplant",
      description: "Specialized micro-transplant technique restoring natural eyebrow arches and fullness with artistic precision",
      features: [
        // "Custom eyebrow shape design", 
        // "Natural growth direction", 
        // "Permanent follicle survival", 
        // "No daily maintenance needed", 
        // "Perfect arch placement", 
        // "Realistic hair texture"
      ]
    },
    {
      icon: User,
      title: "Beard Transplant",
      description: "Advanced beard restoration using strategic follicle placement to create natural-looking, full facial hair",
      features: [
        // "Natural beard styling", 
        // "Customizable density levels", 
        // "Multiple facial area coverage", 
        // "Permanent hair growth", 
        // "Realistic beard patterns", 
        // "No daily shaving required"
      ]
    }
  ];

  const nonSurgicalServices = [
    {
      icon: Droplets,
      title: "PRP Therapy",
      description: "Autologous platelet-rich plasma injection therapy promoting natural hair follicle regeneration and strengthening",
      features: [
        // "Safe natural treatment", 
        // "Stimulates cellular growth", 
        // "No surgical intervention", 
        // "Enhances transplant results", 
        // "Strengthens existing hair", 
        // "Multiple session protocol"
      ]
    },
    {
      icon: Sun,
      title: "Laser Therapy",
      description: "Low-level laser technology using red light wavelengths to stimulate hair follicle activity and promote growth",
      features: [
        // "FDA-cleared devices", 
        // "Painless non-invasive procedure", 
        // "Increases scalp circulation", 
        // "Strengthens hair shafts", 
        // "Portable treatment options", 
        // "Effective maintenance therapy"
      ]
    },
    {
      icon: Palette,
      title: "Scalp Micropigmentation",
      description: "Advanced pigment implantation technique creating illusion of denser hair through strategic dot pattern application",
      features: [
        // "Instant visual results", 
        // "All hair loss types compatible", 
        // "Realistic hair density effect", 
        // "Minimal touch-up maintenance", 
        // "Cost-effective solution", 
        // "No recovery downtime"
      ]
    },
    {
      icon: Pill,
      title: "Medication Management",
      description: "Evidence-based pharmaceutical protocols including FDA-approved medications for hair loss prevention and treatment",
      features: [
        // "Halt hair loss progression", 
        // "Simple daily oral regimen", 
        // "FDA approved medications", 
        // "Enhanced treatment efficacy", 
        // "Long-term maintenance solution", 
        // "Medical supervision included"
      ]
    },
    {
      icon: Heart,
      title: "Autologous Fat Transfer",
      description: "Stem cell-rich adipose tissue grafting technique stimulating regenerative environment for improved scalp health and thickness",
      features: [
        // "Natural body-derived material", 
        // "Stem cell enrichment benefits", 
        // "No foreign substance rejection", 
        // "Scalp condition improvement", 
        // "Durable results", 
        // "Combines with other treatments"
      ]
    },
    {
      icon: Apple,
      title: "Nutrition Therapy",
      description: "Personalized dietary optimization program targeting micronutrient deficiencies that impact hair follicle health and growth",
      features: [
        // "Comprehensive nutrient assessment", 
        // "Vitamin and mineral optimization", 
        // "Hair-healthy meal planning", 
        // "Supplement protocol guidance", 
        // "Lifestyle integration", 
        // "Sustainable long-term approach"
      ]
    }
  ];

  // Pre-compute service slugs to avoid runtime string manipulation
  const serviceSlugMap = useMemo(() => {
    const map: Record<string, string> = {};
    [...surgicalServices, ...nonSurgicalServices].forEach(service => {
      const slug = service.title
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      map[service.title] = slug;
    });
    return map;
  }, []);

  // Service image map for instant preloading on click - memoized
  // Use the same .webp assets as ServiceDetails to ensure cache hit and soft image fade
  const serviceImageMap = useMemo<Record<string, string>>(() => ({
    'fue-hair-transplant': '/assets/fuetreatment.webp',
    'fut-hair-transplant': '/assets/futtreatment.webp',
    'eyebrow-transplant': '/assets/eyebrowtreatment.webp',
    'beard-transplant': '/assets/beardtreatment.webp',
    'prp-therapy': '/assets/prptreatment.webp',
    'laser-therapy': '/assets/lasertreatment.webp',
    'scalp-micropigmentation': '/assets/scalpmicropigmentationtreatment.webp',
    'medication-management': '/assets/medicationmanagementtreatment.webp',
    'autologous-fat-transfer': '/assets/autologousfattransfer.webp',
    'nutrition-therapy': '/assets/nutritiontherapy.webp'
  }), []);

  // Optimized openDetails function - memoized and optimized for speed
  const openDetails = useCallback((title: string) => {
    // Use pre-computed slug - O(1) lookup instead of string manipulation
    const slug = serviceSlugMap[title];
    if (!slug) return;

    const hash = `#/service/${slug}`;

    // Skip if already on this page
    if (window.location.hash === hash) return;

    // Preload image immediately (non-blocking)
    const imageUrl = serviceImageMap[slug];
    if (imageUrl) {
      // Use requestIdleCallback for non-critical image preload
      const preloadImage = () => {
        const img = new Image();
        img.src = imageUrl;
        // Hint decode early to improve instant display when navigating
        if ('decode' in img) {
          (img as any).decode?.().catch(() => { });
        }
      };
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(preloadImage, { timeout: 100 });
      } else {
        setTimeout(preloadImage, 0);
      }
    }

    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
      window.location.hash = hash;
    });
  }, [serviceSlugMap, serviceImageMap]);


  return (
    <section id="services" className="py-6 sm:py-12 lg:py-16 xl:py-20 bg-[#F9F7F7] overflow-hidden" role="region" aria-labelledby="treatments-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-14">
          <h2 id="treatments-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[#112D4E] mb-2 sm:mb-3 lg:mb-4 px-2">
            Our Treatments
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 sm:h-1.5 bg-[#3F72AF] mx-auto mb-3 sm:mb-4 lg:mb-6 rounded-full shadow-lg"></div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 sm:mb-10 lg:mb-14">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-1 sm:p-1.5 lg:p-2 shadow-xl border border-gray-200 w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <button
              onClick={() => setActiveTab('surgical')}
              className={`w-1/2 px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 motion-reduce:transition-none focus:outline-none touch-target ${activeTab === 'surgical'
                ? 'bg-[#3F72AF] text-white shadow-lg'
                : 'bg-white text-[#112D4E] hover:text-[#3F72AF] hover:bg-gray-50'
                }`}
              aria-pressed={activeTab === 'surgical'}
              aria-controls="treatments-list"
              type="button"
            >
              Surgical
            </button>
            <button
              onClick={() => setActiveTab('non-surgical')}
              className={`w-1/2 px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 motion-reduce:transition-none focus:outline-none touch-target ${activeTab === 'non-surgical'
                ? 'bg-[#3F72AF] text-white shadow-lg'
                : 'bg-white text-[#112D4E] hover:text-[#3F72AF] hover:bg-gray-50'
                }`}
              aria-pressed={activeTab === 'non-surgical'}
              aria-controls="treatments-list"
              type="button"
            >
              Non-Surgical
            </button>
          </div>
        </div>

        {/* Service Cards */}
        <div id="treatments-list" aria-labelledby="treatments-heading" className={`grid auto-rows-fr grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 ${activeTab === 'surgical'
          ? 'lg:grid-cols-3 xl:grid-cols-4'
          : 'lg:grid-cols-3 xl:grid-cols-3'
          }`}>
          {(activeTab === 'surgical' ? surgicalServices : nonSurgicalServices).map((service, index) => {

            const isHighlighted = highlightedService === service.title;

            // Dynamic color configuration based on index
            const colorConfig = [
              { border: 'border-[#3F72AF]', ring: 'ring-[#3F72AF]/20', bg: 'bg-blue-50', hover: 'hover:bg-blue-50', text: 'text-[#3F72AF]' }, // Blue
              { border: 'border-green-500', ring: 'ring-green-500/20', bg: 'bg-green-50', hover: 'hover:bg-green-50', text: 'text-green-600' }, // Green
              { border: 'border-purple-500', ring: 'ring-purple-500/20', bg: 'bg-purple-50', hover: 'hover:bg-purple-50', text: 'text-purple-600' }, // Purple
              { border: 'border-orange-500', ring: 'ring-orange-500/20', bg: 'bg-orange-50', hover: 'hover:bg-orange-50', text: 'text-orange-600' }, // Orange
              { border: 'border-pink-500', ring: 'ring-pink-500/20', bg: 'bg-pink-50', hover: 'hover:bg-pink-50', text: 'text-pink-600' }, // Pink
              { border: 'border-teal-500', ring: 'ring-teal-500/20', bg: 'bg-teal-50', hover: 'hover:bg-teal-50', text: 'text-teal-600' }  // Teal
            ][index % 6];

            return (
              <div
                key={index}
                className={`group h-full flex flex-col bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg border transition-all duration-500 motion-reduce:transition-none motion-reduce:animate-none animate-fadeIn relative overflow-hidden ${isHighlighted
                  ? `shadow-xl -translate-y-1 ring-2 ${colorConfig.border} ${colorConfig.ring} ${colorConfig.bg}`
                  : `border-gray-200 hover:shadow-xl hover:-translate-y-1 ${colorConfig.hover}`
                  }`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => {
                  // Preload image on hover for instant display on click
                  const slug = serviceSlugMap[service.title];
                  const imageUrl = slug ? serviceImageMap[slug] : null;
                  if (imageUrl) {
                    // Use requestIdleCallback to avoid blocking hover interaction
                    const preloadImage = () => {
                      const img = new Image();
                      img.src = imageUrl;
                      if ('decode' in img) {
                        (img as any).decode?.().catch(() => { });
                      }
                    };
                    if ('requestIdleCallback' in window) {
                      (window as any).requestIdleCallback(preloadImage, { timeout: 50 });
                    } else {
                      setTimeout(preloadImage, 0);
                    }
                  }
                }}
              >
                {/* Animated Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto transition-all duration-500 motion-reduce:transition-none ${isHighlighted
                  ? 'scale-105 shadow-lg'
                  : 'shadow-md group-hover:shadow-lg'
                  } ${index === 0 ? (isHighlighted ? 'bg-blue-600' : 'bg-blue-500 group-hover:bg-blue-600') :
                    index === 1 ? (isHighlighted ? 'bg-green-600' : 'bg-green-500 group-hover:bg-green-600') :
                      index === 2 ? (isHighlighted ? 'bg-purple-600' : 'bg-purple-500 group-hover:bg-purple-600') :
                        index === 3 ? (isHighlighted ? 'bg-orange-600' : 'bg-orange-500 group-hover:bg-orange-600') :
                          index === 4 ? (isHighlighted ? 'bg-pink-600' : 'bg-pink-500 group-hover:bg-pink-600') :
                            (isHighlighted ? 'bg-teal-600' : 'bg-teal-500 group-hover:bg-teal-600')
                  }`}>
                  <service.icon aria-hidden="true" className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white transition-all duration-500 motion-reduce:transition-none ${isHighlighted ? 'scale-105' : ''
                    }`} />
                </div>

                <h3 className={`relative z-10 text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 text-center transition-all duration-500 break-words ${isHighlighted
                  ? `${colorConfig.text} scale-105`
                  : 'text-[#112D4E] group-hover:text-[#112D4E]/90'
                  }`}>{service.title}</h3>
                <p className={`relative z-10 mb-3 sm:mb-4 leading-relaxed text-center text-xs sm:text-sm transition-all duration-500 break-words ${isHighlighted
                  ? 'text-gray-800'
                  : 'text-gray-600 group-hover:text-gray-700'
                  }`}>{service.description}</p>

                <ul className="relative z-10 space-y-1.5 sm:space-y-2 flex-1" role="list">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-start text-xs sm:text-sm leading-relaxed transition-all duration-500 ${isHighlighted
                      ? 'text-gray-800'
                      : 'text-gray-700 group-hover:text-gray-800'
                      }`}>
                      <CheckCircle aria-hidden="true" className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5 animate-scaleIn motion-reduce:animate-none ${isHighlighted ? `${colorConfig.text} scale-110` : colorConfig.text
                        }`}
                        style={{ animationDelay: `${(index * 0.1) + (featureIndex * 0.05)}s` }} />
                      <span className="font-medium break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 relative z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      // Immediate visual feedback
                      const button = e.currentTarget;
                      button.style.opacity = '0.8';

                      // Optimized navigation with minimal delay
                      requestAnimationFrame(() => {
                        openDetails(service.title);
                        // Reset button after navigation starts
                        setTimeout(() => {
                          button.style.opacity = '1';
                        }, 100);
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        openDetails(service.title);
                      }
                    }}
                    className="w-full bg-[#3F72AF] text-white px-4 py-3 sm:py-2.5 rounded-lg font-semibold hover:bg-[#3F72AF]/90 active:bg-[#3F72AF]/80 transition-[background-color,opacity] duration-150 ease-out shadow-md hover:shadow-lg cursor-pointer relative z-20 focus:outline-none touch-target"
                    aria-label={`Read more about ${service.title}`}
                    type="button"
                  >
                    Read more
                  </button>
                </div>



                {/* Hover Effect - pointer-events-none to not block clicks */}
                <div className={`absolute inset-0 bg-gradient-to-r from-[#3F72AF]/10 to-transparent transition-opacity duration-500 motion-reduce:transition-none pointer-events-none ${isHighlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>

                {/* Highlight Pulse Effect - pointer-events-none to not block clicks */}
                {isHighlighted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3F72AF]/5 to-transparent animate-pulse motion-reduce:animate-none rounded-xl sm:rounded-2xl lg:rounded-3xl pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-6 sm:mt-10 lg:mt-14">
          {/* <button className="bg-[#3F72AF] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-[#3F72AF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-float">
            Book Consultation
          </button> */}
        </div>
      </div>
    </section>
  );
});

Treatment.displayName = 'Treatment';

export default React.memo(Treatment);


