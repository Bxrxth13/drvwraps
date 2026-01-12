import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { ServicesRef } from './treatment';

interface FooterProps {
  servicesRef?: React.RefObject<ServicesRef>;
}

const Footer: React.FC<FooterProps> = ({ servicesRef }) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showCookiePolicy, setShowCookiePolicy] = useState(false);
  const privacyDialogRef = useRef<HTMLDivElement | null>(null);
  const termsDialogRef = useRef<HTMLDivElement | null>(null);
  const cookieDialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showPrivacyPolicy) {
      privacyDialogRef.current?.focus();
    }
    if (showTermsOfService) {
      termsDialogRef.current?.focus();
    }
    if (showCookiePolicy) {
      cookieDialogRef.current?.focus();
    }
  }, [showPrivacyPolicy, showTermsOfService, showCookiePolicy]);

  // Map service display names to slugs for navigation
  const serviceNameToSlugMap: Record<string, string> = {
    'FUE Hair Transplant': 'fue-hair-transplant',
    'FUT Hair Transplant': 'fut-hair-transplant',
    'PRP Therapy': 'prp-therapy',
    'Laser Therapy': 'laser-therapy'
  };

  // Function to check if we're on a service details page (checked at runtime)
  const isOnServiceDetailsPage = () => /^#\/service\//i.test(window.location.hash);

  // Function to navigate to service - works on both main page and service details page
  const navigateToService = (serviceName: string) => {
    const slug = serviceNameToSlugMap[serviceName];
    if (!slug) return;

    // If on service details page, navigate directly to the service detail page
    if (isOnServiceDetailsPage()) {
      window.location.hash = `#/service/${slug}`;
      return;
    }

    // If on main page, scroll to services section and highlight
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      const headerHeight = 120; // Account for fixed header
      const targetPosition = servicesSection.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Wait for scroll to complete, then highlight the service
      setTimeout(() => {
        if (servicesRef?.current) {
          servicesRef.current.highlightService(serviceName);
        }
      }, 800);
    }
  };

  // Function to navigate to main page sections - works on both pages
  const navigateToSection = (sectionName: string) => {
    // Map section names to their actual IDs
    const sectionMap: Record<string, string> = {
      'Home': 'home',
      'Treatments': 'services',
      'Assessment': 'assessment',
      'About': 'doctor'
    };

    const targetId = sectionMap[sectionName] || sectionName.toLowerCase();

    // If on service details page, navigate to main page first
    if (isOnServiceDetailsPage()) {
      window.location.hash = '';
      // Wait for navigation, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerHeight = 120;
          const targetPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }

    // If already on main page, just scroll
    const element = document.getElementById(targetId);
    if (element) {
      const headerHeight = 120;
      const targetPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  const privacyPolicyContent = {
    title: "Privacy Policy",
    lastUpdated: "Last updated: January 2024",
    sections: [
      {
        heading: "Information We Collect",
        content: "We collect information you provide directly to us, such as when you schedule a consultation, fill out forms, or contact us. This may include your name, email address, phone number, medical history, and other relevant information."
      },
      {
        heading: "How We Use Your Information",
        content: "We use the information we collect to provide our services, communicate with you, improve our services, and comply with legal obligations. Your medical information is used solely for treatment purposes and is protected under HIPAA regulations."
      },
      {
        heading: "Information Sharing",
        content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or as necessary to provide our services. Medical information is shared only with your explicit consent or as required by law."
      },
      {
        heading: "Data Security",
        content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and strict access controls."
      },
      {
        heading: "Your Rights",
        content: "You have the right to access, correct, or delete your personal information. You may also request restrictions on how we use your information. Contact us to exercise these rights."
      },
      {
        heading: "Contact Us",
        content: "If you have questions about this Privacy Policy or our data practices, please contact us at privacy@drvhairclinic.com or call us at +1 919-249-5900."
      }
    ]
  };

  const termsOfServiceContent = {
    title: "Terms of Service",
    lastUpdated: "Last updated: January 2024",
    sections: [
      {
        heading: "Acceptance of Terms",
        content: "By accessing and using the services of Dr V Hair Clinic, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
      },
      {
        heading: "Medical Services",
        content: "Our services are provided by qualified medical professionals. All treatments are performed in accordance with medical standards and regulations. Results may vary and are not guaranteed. We recommend consulting with our medical team for personalized treatment plans."
      },
      {
        heading: "Appointments and Cancellations",
        content: "Appointments must be scheduled in advance. We require 24-hour notice for cancellations. Late cancellations or no-shows may result in a cancellation fee. We reserve the right to reschedule appointments due to medical emergencies or unforeseen circumstances."
      },
      {
        heading: "Payment Terms",
        content: "Payment is required at the time of service unless other arrangements have been made. We accept major credit cards, cash, and approved financing options. All fees are non-refundable once services have been rendered."
      },
      {
        heading: "Liability and Disclaimers",
        content: "Dr V Hair Clinic is not liable for any indirect, incidental, special, consequential, or punitive damages. Our liability is limited to the amount paid for services. We disclaim all warranties, express or implied, regarding our services."
      },
      {
        heading: "Intellectual Property",
        content: "All content on our website, including text, graphics, logos, and images, is the property of Dr V Hair Clinic and is protected by copyright laws. Unauthorized use is strictly prohibited."
      },
      {
        heading: "Governing Law",
        content: "These terms are governed by the laws of the state where our clinic is located. Any disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association."
      },
      {
        heading: "Contact Information",
        content: "For questions about these Terms of Service, please contact us at legal@drvhairclinic.com or call us at +1 919-249-5900."
      }
    ]
  };

  const cookiePolicyContent = {
    title: "Cookie Policy",
    lastUpdated: "Last updated: January 2024",
    sections: [
      {
        heading: "What Are Cookies",
        content: "Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing content."
      },
      {
        heading: "Types of Cookies We Use",
        content: "We use essential cookies for website functionality, analytics cookies to understand user behavior, and preference cookies to remember your settings. Some cookies are set by third-party services we use, such as Google Analytics and social media platforms."
      },
      {
        heading: "Essential Cookies",
        content: "These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and form submissions. The website cannot function properly without these cookies."
      },
      {
        heading: "Analytics Cookies",
        content: "We use analytics cookies to understand how visitors interact with our website. This helps us improve our site design, content, and user experience. These cookies collect anonymous information about your browsing behavior."
      },
      {
        heading: "Preference Cookies",
        content: "These cookies allow our website to remember information that changes the way it behaves or looks, such as your preferred language or region. They may also be used to provide services you have asked for."
      },
      {
        heading: "Third-Party Cookies",
        content: "Some cookies are placed by third-party services that appear on our pages. These may include social media platforms, advertising networks, and analytics services. We do not control these cookies and they are subject to the third party's privacy policy."
      },
      {
        heading: "Managing Cookies",
        content: "You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete them. However, disabling certain cookies may limit your ability to use some features of our website."
      },
      {
        heading: "Contact Us",
        content: "If you have questions about our Cookie Policy or how we use cookies, please contact us at cookies@drvhairclinic.com or call us at +1 919-249-5900."
      }
    ]
  };

  return (
    <footer className="relative text-white overflow-hidden bg-[#112D4E]" role="contentinfo" aria-label="Site footer with company information and legal links">
      {/* Wave divider */}
      <div className="pointer-events-none select-none absolute -top-8 left-0 right-0 opacity-80">
        <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" className="w-full h-[90px]">
          <path d="M0,64 C240,16 480,16 720,48 C960,80 1200,80 1440,48 L1440,120 L0,120 Z" fill="#112D4E" />
        </svg>
      </div>

      {/* Decorative accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-20 w-72 h-72 rounded-full bg-[#3F72AF]/10 blur-2xl"></div>
        <div className="absolute -left-24 top-1/3 w-64 h-64 rounded-full bg-[#3F72AF]/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-6 sm:py-12 lg:py-20">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-10">
            {/* Company Info */}
            <div className="space-y-3 sm:space-y-4 xl:space-y-6 col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ring-white/10" aria-hidden="true">
                  <span className="font-bold text-sm sm:text-base lg:text-lg xl:text-xl text-[#112D4E] bg-white px-1.5 py-0.5 rounded">V</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold break-words">Dr V Hair Clinic</h3>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-white/80 break-words">Professional Hair Restoration</p>
                </div>
              </div>
              <p className="text-[10px] sm:text-xs lg:text-sm xl:text-base text-white/80 leading-relaxed">
                Experience world-class hair restoration with cutting-edge techniques. Transform your appearance and regain your confidence naturally.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4 xl:space-y-6 col-span-1 lg:pl-8 lg:border-l lg:border-white/10">
              <h4 className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl font-semibold break-words">Quick Links</h4>
              <nav role="navigation" aria-label="Quick navigation links">
                <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 xl:space-y-3">
                  {['Home', 'Treatments', 'Assessment', 'About'].map((item) => {
                    const sectionMap: Record<string, string> = { Home: '#home', Treatments: '#services', Assessment: '#assessment', About: '#doctor' };
                    const href = sectionMap[item] || '#';
                    return (
                      <li key={item} className="group">
                        <a
                          href={href}
                          onClick={(e) => { e.preventDefault(); navigateToSection(item); }}
                          className="relative inline-block text-[11px] sm:text-xs lg:text-sm xl:text-base text-white/80 transition-all duration-300 text-left focus:outline-none rounded touch-target break-words group-hover:-translate-y-0.5"
                          aria-label={`Navigate to ${item} section`}
                        >
                          <span className="relative z-10">{item}</span>
                          <span className="pointer-events-none absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[#3F72AF] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Our Treatments */}
            <div className="space-y-3 sm:space-y-4 xl:space-y-6 col-span-1 lg:pl-8 lg:border-l lg:border-white/10">
              <h4 className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl font-semibold break-words">Our Treatments</h4>
              <nav role="navigation" aria-label="Service navigation links">
                <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 xl:space-y-3">
                  {['FUE Hair Transplant', 'FUT Hair Transplant', 'PRP Therapy', 'Laser Therapy'].map((service) => {
                    const slug = serviceNameToSlugMap[service];
                    const href = slug ? `#/service/${slug}` : '#';
                    return (
                      <li key={service} className="group">
                        <a
                          href={href}
                          onClick={(e) => { e.preventDefault(); navigateToService(service); }}
                          className="inline-flex items-center text-[11px] sm:text-xs lg:text-sm xl:text-base text-white/80 transition-all duration-300 text-left focus:outline-none rounded touch-target break-words gap-1.5"
                          aria-label={`View ${service} service details`}
                        >
                          <span className="group-hover:underline break-words line-clamp-2 transition-all group-hover:-translate-y-0.5">{service}</span>
                          <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-1 lg:pl-10 space-y-4 lg:space-y-6">
              <h4 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider mb-4 lg:mb-6">Contact Info</h4>
              <address className="space-y-4 lg:space-y-5 not-italic">
                {/* Phone */}
                <div className="group flex items-start gap-3 lg:gap-4">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-[#3F72AF] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  </div>
                  <a href="tel:+19192495900" className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors duration-200 leading-snug flex-1 focus:outline-none rounded">
                    +1 919-249-5900
                  </a>
                </div>

                {/* Email */}
                <div className="group flex items-start gap-3 lg:gap-4">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-[#3F72AF] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  </div>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@drvhairclinic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors duration-200 leading-snug flex-1 break-all focus:outline-none rounded"
                    aria-label="Send email to info@drvhairclinic.com"
                  >
                    info@drvhairclinic.com
                  </a>
                </div>

                {/* Address */}
                <div className="group flex items-start gap-3 lg:gap-4">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-[#3F72AF] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=123+Hair+Restoration+Ave,+Suite+100"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm lg:text-base text-gray-300 hover:text-white transition-colors duration-200 leading-snug flex-1 focus:outline-none rounded"
                    aria-label="View location"
                  >
                    123 Hair Restoration Ave, Suite 100
                  </a>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 gap-3 sm:gap-0">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-white/60">
                © 2025 Dr V Hair Clinic. All rights reserved.
              </p>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6" role="navigation" aria-label="Legal and policy links">
              <button
                onClick={() => setShowPrivacyPolicy(true)}
                className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#112D4E] rounded touch-target"
                aria-label="View privacy policy"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setShowTermsOfService(true)}
                className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#112D4E] rounded touch-target"
                aria-label="View terms of service"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setShowCookiePolicy(true)}
                className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#112D4E] rounded touch-target"
                aria-label="View cookie policy"
              >
                Cookie Policy
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Privacy Policy Popup */}
      {showPrivacyPolicy && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="presentation"
          aria-labelledby="privacy-policy-title"
          aria-describedby="privacy-policy-content"
          onKeyDown={(e) => { if (e.key === 'Escape') setShowPrivacyPolicy(false); }}
        >
          <div ref={privacyDialogRef} tabIndex={-1} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h3 id="privacy-policy-title" className="text-xl sm:text-2xl font-bold text-[#112D4E]">{privacyPolicyContent.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">{privacyPolicyContent.lastUpdated}</p>
              <div id="privacy-policy-content" className="space-y-6">
                {privacyPolicyContent.sections.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold text-[#112D4E] mb-3">{section.heading}</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
              {/* Close button at bottom */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="px-6 py-3 bg-[#112D4E] text-white rounded-xl font-semibold hover:bg-[#3F72AF] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/30 focus:ring-offset-2"
                  aria-label="Close privacy policy"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Popup */}
      {showTermsOfService && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="presentation"
          aria-labelledby="terms-of-service-title"
          aria-describedby="terms-of-service-content"
          onKeyDown={(e) => { if (e.key === 'Escape') setShowTermsOfService(false); }}
        >
          <div ref={termsDialogRef} tabIndex={-1} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h3 id="terms-of-service-title" className="text-xl sm:text-2xl font-bold text-[#112D4E]">{termsOfServiceContent.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">{termsOfServiceContent.lastUpdated}</p>
              <div id="terms-of-service-content" className="space-y-6">
                {termsOfServiceContent.sections.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold text-[#112D4E] mb-3">{section.heading}</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
              {/* Close button at bottom */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowTermsOfService(false)}
                  className="px-6 py-3 bg-[#112D4E] text-white rounded-xl font-semibold hover:bg-[#3F72AF] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/30 focus:ring-offset-2"
                  aria-label="Close terms of service"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Policy Popup */}
      {showCookiePolicy && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="presentation"
          aria-labelledby="cookie-policy-title"
          aria-describedby="cookie-policy-content"
          onKeyDown={(e) => { if (e.key === 'Escape') setShowCookiePolicy(false); }}
        >
          <div ref={cookieDialogRef} tabIndex={-1} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h3 id="cookie-policy-title" className="text-xl sm:text-2xl font-bold text-[#112D4E]">{cookiePolicyContent.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">{cookiePolicyContent.lastUpdated}</p>
              <div id="cookie-policy-content" className="space-y-6">
                {cookiePolicyContent.sections.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold text-[#112D4E] mb-3">{section.heading}</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
              {/* Close button at bottom */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowCookiePolicy(false)}
                  className="px-6 py-3 bg-[#112D4E] text-white rounded-xl font-semibold hover:bg-[#3F72AF] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#3F72AF]/30 focus:ring-offset-2"
                  aria-label="Close cookie policy"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default React.memo(Footer);