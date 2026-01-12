import React, { useState, useEffect } from 'react';

const Assessment: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const scrollToConsultation = () => {
    const element = document.getElementById('consultation');
    if (element) {
      const headerHeight = 120; // Account for fixed header
      const targetPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  const malePatterns = [
    { id: '1', label: 'Stage 1', description: 'Full head of hair', image: '/assets/male1.webp' },
    { id: '2', label: 'Stage 2', description: 'Slight recession', image: '/assets/male2.webp' },
    { id: '3', label: 'Stage 3', description: 'Deepening recession', image: '/assets/male3.webp' },
    { id: '4', label: 'Stage 4', description: 'Crown thinning', image: '/assets/male4.webp' },
    { id: '5', label: 'Stage 5', description: 'Bridge thinning', image: '/assets/male5.webp' },
    { id: '6', label: 'Stage 6', description: 'Large balding area', image: '/assets/male6.webp' },
    { id: '7', label: 'Stage 7', description: 'Extensive loss', image: '/assets/male7.webp' },
    { id: '8', label: 'Stage 8', description: 'Complete loss', image: '/assets/male8.webp' }
  ];

  const femalePatterns = [
    { id: '1d', label: 'Stage 1', description: 'Significant thinning', image: '/assets/female1.webp' },
    { id: '1f', label: 'Stage 2', description: 'Large balding area', image: '/assets/female2.webp' },
    { id: '1g', label: 'Stage 3', description: 'Extensive loss', image: '/assets/female3.png' },
    { id: '1h', label: 'Stage 4', description: 'Complete loss', image: '/assets/female4.webp' },
  ];



  const currentPatterns = gender === 'male' ? malePatterns : femalePatterns;

  // Listen for pattern selection from ConsultationForm
  useEffect(() => {
    const handleFormPatternSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { patternId, gender: formGender } = customEvent.detail;

      // Update gender if it's different
      if (formGender !== gender) {
        setGender(formGender);
      }

      // Update selected pattern
      setSelectedPattern(patternId);
    };

    window.addEventListener('formPatternSelected', handleFormPatternSelected as EventListener);

    return () => {
      window.removeEventListener('formPatternSelected', handleFormPatternSelected as EventListener);
    };
  }, [gender]);

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId);

    // Dispatch custom event to notify ConsultationForm
    const selectedPatternData = currentPatterns.find(p => p.id === patternId);

    const event = new CustomEvent('patternSelected', {
      detail: {
        patternId,
        gender,
        patternLabel: selectedPatternData?.label || patternId,
        patternDescription: selectedPatternData?.description || '',
        fullPatternInfo: `${gender === 'male' ? 'Male' : 'Female'} - Pattern ${selectedPatternData?.label || patternId}: ${selectedPatternData?.description || ''}`
      }
    });
    window.dispatchEvent(event);

    // Smoothly scroll to Consultation form after selecting a stage
    // Slight delay ensures the event consumers update before scrolling
    setTimeout(() => {
      scrollToConsultation();
    }, 50);
  };

  return (
    <section id="assessment" className="py-6 sm:py-10 lg:py-14 xl:py-18 bg-[#DBE2EF] overflow-hidden" role="region" aria-labelledby="assessment-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10 lg:mb-14">
          <h2 id="assessment-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[#112D4E] mb-2 sm:mb-3 lg:mb-4 px-2 break-words">
            Select Your Hair Loss Pattern
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 sm:h-1.5 bg-[#3F72AF] mx-auto mb-3 sm:mb-4 lg:mb-6 rounded-full shadow-lg"></div>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-4xl mx-auto animate-fadeIn px-4 break-words leading-relaxed">
            Choose the pattern that best matches your current hair loss situation
          </p>
        </div>

        {/* Gender Toggle */}
        <div className="flex justify-center mb-6 sm:mb-10 lg:mb-14" role="radiogroup" aria-label="Select gender">
          <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-1.5 sm:p-2 lg:p-3 shadow-xl border border-gray-200 w-full max-w-md sm:max-w-lg lg:max-w-xl">
            <button
              onClick={() => {
                setGender('male');
                // Notify ConsultationForm that gender changed
                const event = new CustomEvent('genderChanged', {
                  detail: { gender: 'male' }
                });
                window.dispatchEvent(event);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setGender('male');
                  const event = new CustomEvent('genderChanged', {
                    detail: { gender: 'male' }
                  });
                  window.dispatchEvent(event);
                }
              }}
              className={`w-1/2 px-4 sm:px-6 lg:px-10 xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-sm sm:text-base lg:text-lg xl:text-xl transition-all duration-300 touch-target focus:outline-none ${gender === 'male'
                ? 'bg-[#112D4E] text-white shadow-lg'
                : 'text-[#112D4E] hover:text-[#112D4E]/80 hover:bg-gray-50'
                }`}
              role="radio"
              aria-checked={gender === 'male'}
              aria-label="Select male hair loss patterns"
            >
              Male
            </button>
            <button
              onClick={() => {
                setGender('female');
                // Notify ConsultationForm that gender changed
                const event = new CustomEvent('genderChanged', {
                  detail: { gender: 'female' }
                });
                window.dispatchEvent(event);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setGender('female');
                  const event = new CustomEvent('genderChanged', {
                    detail: { gender: 'female' }
                  });
                  window.dispatchEvent(event);
                }
              }}
              className={`w-1/2 px-4 sm:px-6 lg:px-10 xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-sm sm:text-base lg:text-lg xl:text-xl transition-all duration-300 touch-target focus:outline-none ${gender === 'female'
                ? 'bg-[#112D4E] text-white shadow-lg'
                : 'text-[#112D4E] hover:text-[#112D4E]/80 hover:bg-gray-50'
                }`}
              role="radio"
              aria-checked={gender === 'female'}
              aria-label="Select female hair loss patterns"
            >
              Female
            </button>
          </div>
        </div>

        {/* Hair Loss Pattern Grid */}
        <div className="flex justify-center mb-6 sm:mb-10 lg:mb-14" role="group" aria-label="Hair loss pattern selection">
          <div className={`grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-7xl ${gender === 'female'
            ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4'
            }`}>
            {currentPatterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => handlePatternSelect(pattern.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePatternSelect(pattern.id);
                  }
                }}
                className={`group relative p-2.5 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 active:scale-95 touch-target min-h-[120px] sm:min-h-[140px] md:min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:ring-offset-2 ${selectedPattern === pattern.id
                  ? 'border-[#222F40] bg-[#222F40] text-white shadow-xl transform scale-105'
                  : 'border-gray-200 bg-white text-[#222F40] hover:border-[#222F40] hover:bg-gray-50'
                  }`}
                aria-label={`Select ${pattern.label}: ${pattern.description}`}
                aria-pressed={selectedPattern === pattern.id}
              >
                {/* Pattern Illustration */}
                <div className="w-full aspect-square rounded-lg sm:rounded-xl lg:rounded-2xl mb-3 sm:mb-4 lg:mb-6 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={pattern.image}
                    srcSet={`${pattern.image} 400w`}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 400px"
                    alt={`${gender === 'male' ? 'Male' : 'Female'} hair loss pattern ${pattern.label} - ${pattern.description}`}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                    loading={pattern.id === '1' || pattern.id === '1d' ? "eager" : "lazy"}
                    decoding={pattern.id === '1' || pattern.id === '1d' ? "sync" : "async"}
                    fetchPriority={pattern.id === '1' || pattern.id === '1d' ? "high" : "auto"}
                    width={400}
                    height={400}
                    key={`${gender}-${pattern.id}`}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      // Fallback to label display if image fails to load
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><div class="text-xs sm:text-sm lg:text-base font-bold text-gray-600">${pattern.label}</div></div>`;
                      }
                    }}
                  />
                </div>

                {/* Pattern Description */}
                <div className="text-center">
                  <div className="text-xs sm:text-sm lg:text-base font-semibold mb-2 sm:mb-3 lg:mb-4 break-words">{pattern.label}</div>
                  <div className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 break-words ${selectedPattern === pattern.id
                    ? 'bg-white/20 backdrop-blur-sm text-white font-bold text-xs sm:text-sm lg:text-base shadow-lg'
                    : 'bg-gradient-to-r from-[#3F72AF]/15 to-[#112D4E]/15 text-[#112D4E] font-bold text-xs sm:text-sm lg:text-base border border-[#3F72AF]/30 hover:from-[#3F72AF]/25 hover:to-[#112D4E]/25 hover:border-[#3F72AF]/50 hover:shadow-md'
                    }`}>
                    {pattern.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Assessment;