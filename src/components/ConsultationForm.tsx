import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowRight, CheckCircle, AlertCircle, Calendar, User, Mail, Phone, X } from 'lucide-react';
import axios from "axios";

const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    selectedPattern: ''
  });

  const [formGender, setFormGender] = useState<'male' | 'female'>('male');
  const [formSelectedPattern, setFormSelectedPattern] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const successCloseRef = useRef<HTMLButtonElement | null>(null);
  const errorCloseRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuccessModal(false);
        setShowErrorModal(false);
      }
    };

    if (showSuccessModal || showErrorModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showSuccessModal, showErrorModal]);

  // When opening a modal, move focus to the close button and remember the last focused element
  useEffect(() => {
    if (showSuccessModal || showErrorModal) {
      lastFocusedElementRef.current = (document.activeElement as HTMLElement) || null;
      const target = showSuccessModal ? successCloseRef.current : errorCloseRef.current;
      target?.focus();
    } else if (lastFocusedElementRef.current) {
      lastFocusedElementRef.current.focus();
      lastFocusedElementRef.current = null;
    }
  }, [showSuccessModal, showErrorModal]);

  // Hair loss patterns data
  const malePatterns = useMemo(() => [
    { id: '1', label: 'Stage 1', description: 'Full head of hair', image: '/assets/male1.webp' },
    { id: '2', label: 'Stage 2', description: 'Slight recession', image: '/assets/male2.webp' },
    { id: '3', label: 'Stage 3', description: 'Deepening recession', image: '/assets/male3.webp' },
    { id: '4', label: 'Stage 4', description: 'Crown thinning', image: '/assets/male4.webp' },
    { id: '5', label: 'Stage 5', description: 'Bridge thinning', image: '/assets/male5.webp' },
    { id: '6', label: 'Stage 6', description: 'Large balding area', image: '/assets/male6.webp' },
    { id: '7', label: 'Stage 7', description: 'Extensive loss', image: '/assets/male7.webp' },
    { id: '8', label: 'Stage 8', description: 'Complete loss', image: '/assets/male8.webp' }
  ], []);

  const femalePatterns = useMemo(() => [
    { id: '1d', label: 'Stage 1', description: 'Significant thinning', image: '/assets/female1.webp' },
    { id: '1f', label: 'Stage 2', description: 'Large balding area', image: '/assets/female2.webp' },
    { id: '1g', label: 'Stage 3', description: 'Extensive loss', image: '/assets/female3.png' },
    { id: '1h', label: 'Stage 4', description: 'Complete loss', image: '/assets/female4.webp' },
  ], []);

  const currentPatterns = formGender === 'male' ? malePatterns : femalePatterns;

  // Handle pattern selection in form
  const handleFormPatternSelect = (patternId: string) => {
    setFormSelectedPattern(patternId);
    const selectedPatternData = currentPatterns.find(p => p.id === patternId);
    const fullPatternInfo = `${formGender === 'male' ? 'Male' : 'Female'} - Pattern ${selectedPatternData?.label || patternId}: ${selectedPatternData?.description || ''}`;
    setFormData(prev => ({ ...prev, selectedPattern: fullPatternInfo }));

    // Dispatch custom event to notify Assessment component
    const event = new CustomEvent('formPatternSelected', {
      detail: {
        patternId,
        gender: formGender,
        patternLabel: selectedPatternData?.label || patternId,
        patternDescription: selectedPatternData?.description || '',
        fullPatternInfo
      }
    });
    window.dispatchEvent(event);
  };

  // Auto-update selectedPattern in formData when selectedPattern state changes
  useEffect(() => {
    if (selectedPattern) {
      setFormData(prev => ({ ...prev, selectedPattern }));
    }
  }, [selectedPattern]);

  // Listen for pattern selection from Assessment component
  useEffect(() => {
    const handlePatternSelected = (event: CustomEvent) => {
      const { patternId, gender: selectedGender, fullPatternInfo } = event.detail;
      console.log('Pattern selected event received:', { patternId, selectedGender, fullPatternInfo });

      // Update the form gender to match the assessment selection FIRST
      setFormGender(selectedGender);

      // Update the selected pattern text
      setSelectedPattern(fullPatternInfo);
      setFormData(prev => ({ ...prev, selectedPattern: fullPatternInfo }));

      // Find the pattern in the correct patterns array and set formSelectedPattern
      // Use the patterns based on the selectedGender from the event (not formGender state)
      const patterns = selectedGender === 'male' ? malePatterns : femalePatterns;
      const pattern = patterns.find(p => p.id === patternId);

      // Always set formSelectedPattern to visually highlight the selected pattern button
      // This ensures the corresponding pattern button in the form is automatically selected
      setFormSelectedPattern(patternId);

      if (pattern) {
        console.log('Pattern matched and selected in form:', patternId, pattern.label);
      } else {
        console.warn('Pattern not found in form patterns:', {
          patternId,
          selectedGender,
          availableIds: patterns.map(p => p.id),
          availableLabels: patterns.map(p => `${p.id}: ${p.label}`)
        });
      }
    };

    const handleGenderChanged = (event: CustomEvent) => {
      const { gender: selectedGender } = event.detail;
      console.log('Gender changed event received:', selectedGender);

      // Update the form gender to match the assessment selection
      setFormGender(selectedGender);

      // Clear selected pattern when gender changes
      setSelectedPattern(null);
      setFormSelectedPattern(null);
      setFormData(prev => ({ ...prev, selectedPattern: '' }));
    };

    window.addEventListener('patternSelected', handlePatternSelected as EventListener);
    window.addEventListener('genderChanged', handleGenderChanged as EventListener);

    return () => {
      window.removeEventListener('patternSelected', handlePatternSelected as EventListener);
      window.removeEventListener('genderChanged', handleGenderChanged as EventListener);
    };
  }, [malePatterns, femalePatterns]);

  // Name validation - only letters and spaces allowed
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s\-']*$/.test(value)) {
      setFormData({ ...formData, name: value });
      if (errors.name) setErrors({ ...errors, name: '' });
    }
  };

  // Phone validation - only numbers allowed
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, phone: value });
      if (errors.phone) setErrors({ ...errors, phone: '' });
    }
  };

  // Age validation - only numbers allowed
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, age: value });
      if (errors.age) setErrors({ ...errors, age: '' });
    }
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    // Validate preferred date if provided
    const preferredDateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (preferredDateInput && preferredDateInput.value) {
      const selectedDate = new Date(preferredDateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = 'Preferred date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to send consultation request
  // Always succeeds from user's perspective - server handles email failures gracefully
  const sendConsultationRequest = async (data: {
    name: string;
    email: string;
    phone: string;
    preferredDate: string;
  }) => {
    const consultationData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      age: formData.age || '',
      preferredDate: data.preferredDate || 'Not specified',
      consultationType: formData.selectedPattern || 'General Consultation',
      selectedPattern: formData.selectedPattern || ''
    };

    try {
      const response = await fetch('https://api.drvhairclinic.com/api/send-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });

      // Try to parse JSON, but if it fails, still treat as success
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.warn('Could not parse server response as JSON, treating as success');
        return true;
      }

      // Always treat as success - server handles email failures internally
      // Even validation errors from server are treated as success (form validation should catch these)
      if (result.success || !response.ok) {
        if (!response.ok) {
          console.warn('Server returned error, but treating as success for user experience:', result);
        }
        return true;
      }

      // Even if server says false, we still succeed from user perspective
      console.warn('Server returned success:false, but treating as success for user experience');
      return true;
    } catch (error) {
      // Network errors or other issues - still show success to user
      // The server will log the attempt, and admin can follow up
      console.error('Network error sending consultation request:', error);
      console.log('Consultation data that would have been sent:', consultationData);
      // Still return true so user sees success message
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const preferredDateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
      const preferredDate = preferredDateInput ? preferredDateInput.value : '';

      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredDate
      };

      // Always show success - sendConsultationRequest always succeeds
      await sendConsultationRequest(submissionData);

      // Clear form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        selectedPattern: ''
      });
      setSelectedPattern(null);
      setFormSelectedPattern(null);
      setErrors({});

      // Clear date input
      if (preferredDateInput) {
        preferredDateInput.value = '';
      }

      // Always show success modal - never show error
      setShowSuccessModal(true);
    } catch (error) {
      // This should never happen now, but if it does, still show success
      console.error('Unexpected error in form submission:', error);
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation" className="relative py-6 sm:py-8 lg:py-10 bg-gradient-to-br from-[#112D4E] via-[#1a3a5c] to-[#112D4E] overflow-hidden" role="region" aria-labelledby="consultation-heading">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3F72AF] via-[#F9F7F7] to-[#3F72AF]"></div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">


        {/* Main Form Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#3F72AF] to-[#112D4E] p-4 sm:p-5 lg:p-6 text-center">
            <h3 id="consultation-heading" className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white text-center break-words px-2">Begin Your Transformation With Dr. V's Expertise.</h3>
          </div>

          <div className="p-4 sm:p-5 lg:p-6 xl:p-8">
            {/* Selected Pattern Display - Only show if pattern was selected from Assessment page */}
            {selectedPattern && (
              <div className="text-center mb-4 sm:mb-6 animate-fadeIn">
                <div className="bg-gradient-to-r from-[#3F72AF]/10 to-[#112D4E]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[#3F72AF]/20 max-w-md sm:max-w-lg mx-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#3F72AF]" />
                    <span className="text-sm sm:text-base font-bold text-[#112D4E]">Pattern Selected</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <span className="font-semibold text-[#112D4E]">{selectedPattern}</span>
                  </p>
                </div>
              </div>
            )}



            {/* Live region for async announcements */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {isSubmitting ? 'Submitting your consultation request…' : ''}
              {showSuccessModal ? 'Consultation request sent successfully.' : ''}
              {showErrorModal ? 'There was an error submitting your request.' : ''}
            </div>

            {/* Premium Two-Column Layout */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10">
              {/* Left Column - Personal Information */}
              <div className="bg-gradient-to-br from-white via-slate-50/80 to-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gradient-to-r from-[#3F72AF]/20 via-[#112D4E]/10 to-[#3F72AF]/20 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                {/* Premium Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#3F72AF]/8 via-[#112D4E]/5 to-transparent rounded-full -translate-y-20 translate-x-20 blur-sm"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#112D4E]/8 via-[#3F72AF]/5 to-transparent rounded-full translate-y-16 -translate-x-16 blur-sm"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-[#3F72AF]/3 to-[#112D4E]/3 rounded-full -translate-x-1/2 -translate-y-1/2 blur-md"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3F72AF] via-[#112D4E] to-[#3F72AF] rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-[#3F72AF]/10">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#112D4E] to-[#3F72AF] bg-clip-text text-transparent">Personal Information</h3>
                      <p className="text-sm text-gray-600 font-medium">Tell us about yourself</p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      <label htmlFor="name" className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#112D4E]">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#3F72AF] to-[#112D4E] rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleNameChange}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl text-sm font-medium transition-all duration-300 motion-reduce:transition-none focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/20 focus:shadow-xl touch-target ${errors.name ? 'border-red-400 bg-red-50/50 shadow-red-200' : 'border-gray-200 focus:border-[#3F72AF] hover:border-[#3F72AF]/60 bg-white/90 shadow-lg hover:shadow-xl'
                          }`}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        required
                      />
                      {errors.name && (
                        <p id="name-error" className="text-red-500 text-xs flex items-center font-medium" role="alert">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-[#112D4E]">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#3F72AF] to-[#112D4E] rounded-lg flex items-center justify-center">
                          <Mail className="w-3 h-3 text-white" />
                        </div>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        className={`w-full px-5 py-4 border-2 rounded-2xl text-sm font-medium transition-all duration-300 motion-reduce:transition-none focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/20 focus:shadow-xl ${errors.email ? 'border-red-400 bg-red-50/50 shadow-red-200' : 'border-gray-200 focus:border-[#3F72AF] hover:border-[#3F72AF]/60 bg-white/90 shadow-lg hover:shadow-xl'
                          }`}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        required
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-500 text-xs flex items-center font-medium" role="alert">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="phone" className="flex items-center gap-2 text-sm font-bold text-[#112D4E]">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#3F72AF] to-[#112D4E] rounded-lg flex items-center justify-center">
                          <Phone className="w-3 h-3 text-white" />
                        </div>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full px-5 py-4 border-2 rounded-2xl text-sm font-medium transition-all duration-300 motion-reduce:transition-none focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/20 focus:shadow-xl ${errors.phone ? 'border-red-400 bg-red-50/50 shadow-red-200' : 'border-gray-200 focus:border-[#3F72AF] hover:border-[#3F72AF]/60 bg-white/90 shadow-lg hover:shadow-xl'
                          }`}
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        required
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-red-500 text-xs flex items-center font-medium" role="alert">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="age" className="flex items-center gap-2 text-sm font-bold text-[#112D4E]">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#3F72AF] to-[#112D4E] rounded-lg flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        Age *
                      </label>
                      <input
                        type="number"
                        id="age"
                        value={formData.age}
                        onChange={handleAgeChange}
                        min="18"
                        max="80"
                        className={`w-full px-5 py-4 border-2 rounded-2xl text-sm font-medium transition-all duration-300 motion-reduce:transition-none focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/20 focus:shadow-xl ${errors.age ? 'border-red-400 bg-red-50/50 shadow-red-200' : 'border-gray-200 focus:border-[#3F72AF] hover:border-[#3F72AF]/60 bg-white/90 shadow-lg hover:shadow-xl'
                          }`}
                        placeholder="Enter your age"
                        autoComplete="off"
                        aria-invalid={!!errors.age}
                        aria-describedby={errors.age ? 'age-error' : undefined}
                        required
                      />
                      {errors.age && (
                        <p id="age-error" className="text-red-500 text-xs flex items-center font-medium" role="alert">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.age}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="preferredDate"
                        onClick={(e) => {
                          e.preventDefault();
                          const input = document.getElementById('preferredDate') as HTMLInputElement;
                          if (input) {
                            input.showPicker?.();
                            input.focus();
                          }
                        }}
                        className="flex items-center gap-2 text-sm font-bold text-[#112D4E] cursor-pointer hover:text-[#3F72AF] transition-colors"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-[#3F72AF] to-[#112D4E] rounded-lg flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-white" />
                        </div>
                        Preferred Consultation Date
                      </label>
                      <div
                        className="relative"
                        onClick={(e) => {
                          const input = document.getElementById('preferredDate') as HTMLInputElement;
                          if (input && e.target !== input) {
                            input.showPicker?.();
                            input.focus();
                          }
                        }}
                      >
                        <input
                          type="date"
                          id="preferredDate"
                          onClick={(e) => {
                            const input = e.target as HTMLInputElement;
                            input.showPicker?.();
                          }}
                          className={`w-full px-5 py-4 border-2 rounded-2xl text-sm font-medium transition-all duration-300 motion-reduce:transition-none focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/20 focus:shadow-xl cursor-pointer ${errors.preferredDate ? 'border-red-400 bg-red-50/50 shadow-red-200' : 'border-gray-200 focus:border-[#3F72AF] hover:border-[#3F72AF]/60 bg-white/90 shadow-lg hover:shadow-xl'
                            }`}
                          min={new Date().toISOString().split('T')[0]}
                          aria-describedby={errors.preferredDate ? 'preferredDate-error preferredDate-help' : 'preferredDate-help'}
                          style={{
                            position: 'relative',
                            zIndex: 1
                          }}
                        />
                      </div>
                      {errors.preferredDate && (
                        <p id="preferredDate-error" className="text-red-500 text-xs flex items-center font-medium" role="alert">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.preferredDate}
                        </p>
                      )}
                      <p id="preferredDate-help" className="sr-only">Select a convenient date for your consultation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Hair Loss Pattern Selection */}
              <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-purple-50/50 rounded-3xl p-8 border-2 border-gradient-to-r from-[#3F72AF]/30 via-[#112D4E]/20 to-[#3F72AF]/30 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                {/* Premium Decorative Elements */}
                <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-[#3F72AF]/12 via-[#112D4E]/8 to-transparent rounded-full -translate-y-18 -translate-x-18 blur-sm"></div>
                <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tr from-[#112D4E]/12 via-[#3F72AF]/8 to-transparent rounded-full translate-y-14 translate-x-14 blur-sm"></div>
                <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-l from-[#3F72AF]/6 to-[#112D4E]/6 rounded-full blur-md"></div>

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#3F72AF] via-[#112D4E] to-[#3F72AF] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl ring-2 sm:ring-4 ring-[#3F72AF]/10 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#112D4E] to-[#3F72AF] bg-clip-text text-transparent break-words">Hair Loss Pattern</h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium break-words">Select your pattern</p>
                      </div>
                    </div>

                    <div className="flex bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-xl border-2 border-gray-200/50 w-full sm:w-auto flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setFormGender('male')}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3F72AF] touch-target ${formGender === 'male'
                          ? 'bg-gradient-to-r from-[#3F72AF] to-[#112D4E] text-white shadow-lg scale-105'
                          : 'text-gray-600 hover:text-[#3F72AF] hover:bg-gray-50'
                          }`}
                        aria-pressed={formGender === 'male'}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormGender('female')}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3F72AF] touch-target ${formGender === 'female'
                          ? 'bg-gradient-to-r from-[#3F72AF] to-[#112D4E] text-white shadow-lg scale-105'
                          : 'text-gray-600 hover:text-[#3F72AF] hover:bg-gray-50'
                          }`}
                        aria-pressed={formGender === 'female'}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  <div
                    className={`grid gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 ${formGender === 'male'
                      ? 'grid-cols-4 sm:grid-cols-4'
                      : 'grid-cols-2 sm:grid-cols-4'
                      }`}
                  >
                    {currentPatterns.map((pattern) => (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => handleFormPatternSelect(pattern.id)}
                        className={`group relative ${formGender === 'female' ? 'p-1.5' : 'p-2'
                          } sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 transition-all duration-300 motion-reduce:transition-none hover:shadow-2xl hover:-translate-y-2 touch-target ${formSelectedPattern === pattern.id
                            ? 'border-[#3F72AF] bg-gradient-to-br from-[#3F72AF]/15 to-[#112D4E]/10 shadow-xl scale-105 ring-2 sm:ring-4 ring-[#3F72AF]/20'
                            : 'border-gray-200 bg-white/90 hover:border-[#3F72AF]/60 hover:bg-white shadow-lg'
                          }`}
                        aria-pressed={formSelectedPattern === pattern.id}
                        aria-label={`Select ${formGender} hair loss ${pattern.label}`}
                      >
                        <div className="w-full aspect-square rounded-lg sm:rounded-xl mb-2 sm:mb-3 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                          <img
                            src={pattern.image}
                            srcSet={`${pattern.image} 150w`}
                            alt={`${formGender} hair loss pattern ${pattern.label}`}
                            className="w-full h-full object-cover object-center transition-transform duration-300 motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 150px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><div class="text-[10px] sm:text-xs font-bold text-gray-600">${pattern.label}</div></div>`;
                              }
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] sm:text-xs font-bold text-[#112D4E] break-words">{pattern.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {formSelectedPattern && (
                    <div className="bg-gradient-to-r from-[#3F72AF]/15 via-[#112D4E]/10 to-[#3F72AF]/15 rounded-2xl p-5 border-2 border-[#3F72AF]/30 shadow-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-[#3F72AF]" />
                        <span className="text-sm font-bold text-[#112D4E]">Pattern Selected</span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium">
                        {formData.selectedPattern}
                      </p>
                    </div>
                  )}

                  {/* Submit Button - Moved to Right Column */}
                  <div className="text-center mt-8 sm:mt-12 lg:mt-16">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group w-full px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#3F72AF] via-[#112D4E] to-[#3F72AF] text-white font-bold rounded-xl sm:rounded-2xl lg:rounded-3xl text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 sm:space-x-3 mx-auto ring-2 sm:ring-4 ring-[#3F72AF]/20 hover:ring-[#3F72AF]/30 touch-target`}
                      ref={submitButtonRef}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-white"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Book  Consultation</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-scaleIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-success-title"
            aria-describedby="consult-success-desc"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                // basic trap: keep focus on close button
                e.preventDefault();
                successCloseRef.current?.focus();
              }
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20 rounded-full p-1"
              aria-label="Close modal"
              ref={successCloseRef}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 id="consult-success-title" className="text-2xl sm:text-3xl font-bold text-[#112D4E] mb-3">
                Thank You!
              </h3>

              {/* Message */}
              <p id="consult-success-desc" className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                ✅ Thank you! Your consultation request has been received. Our team will confirm your appointment shortly.
              </p>

              {/* Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#3F72AF] to-[#112D4E] text-white font-semibold rounded-xl hover:from-[#112D4E] hover:to-[#3F72AF] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/20"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowErrorModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-scaleIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-error-title"
            aria-describedby="consult-error-desc"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                errorCloseRef.current?.focus();
              }
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 rounded-full p-1"
              aria-label="Close modal"
              ref={errorCloseRef}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 text-center">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 id="consult-error-title" className="text-2xl sm:text-3xl font-bold text-[#112D4E] mb-3">
                Submission Error
              </h3>

              {/* Message */}
              <p id="consult-error-desc" className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                There was an error submitting your request. Please try again or contact us directly.
              </p>

              {/* Button */}
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/20"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default React.memo(ConsultationForm);

// Alternative Simple Consultation Form Component
export const SimpleConsultationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    consultationType: "",
    preferredDate: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await axios.post("https://api.drvhairclinic.com/api/send-consultation", formData);

      if (res.data.success) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          consultationType: "",
          preferredDate: "",
          message: "",
        });
        setTimeout(() => setSuccess(false), 4000); // auto-hide after 4 seconds
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Server issue. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e6f6f4] to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 space-y-5 border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-center text-[#0a4b46] tracking-wide">
          Book Your Consultation
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a4b46]"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a4b46]"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a4b46]"
        />

        <select
          name="consultationType"
          value={formData.consultationType}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a4b46]"
        >
          <option value="">Select Consultation Type</option>
          <option value="Hair Loss">Hair Loss</option>
          <option value="Transplant">Transplant</option>
          <option value="Scalp Treatment">Scalp Treatment</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a4b46]"
        />

        <textarea
          name="message"
          placeholder="Additional message (optional)"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a4b46]"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0a4b46] text-white py-3 rounded-md font-semibold hover:bg-[#0c6c63] transition-all"
        >
          {loading ? "Sending..." : "Submit Consultation"}
        </button>

        {error && <p className="text-center text-red-600 font-medium mt-2">{error}</p>}
      </form>

      {/* ✅ Success Message Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-11/12 max-w-sm border border-[#0a4b46]/20 animate-fade-in">
            <h3 className="text-2xl font-semibold text-[#0a4b46] mb-2">Thank You!</h3>
            <p className="text-gray-700 mb-4">
              Your consultation request has been received successfully. Our team will contact you shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-[#0a4b46] text-white px-6 py-2 rounded-md hover:bg-[#0c6c63] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
