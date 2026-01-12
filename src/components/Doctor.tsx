import React from 'react';
import { CheckCircle, Award, GraduationCap, Heart, Users } from 'lucide-react';


const Doctor: React.FC = () => {
  return (
    <section id="doctor" className="pt-6 sm:pt-12 lg:pt-16 xl:pt-20 pb-4 sm:pb-6 lg:pb-8 xl:pb-10 bg-gradient-to-br from-[#DBE2EF] to-[#F9F7F7] overflow-hidden" role="region" aria-labelledby="doctor-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12 lg:mb-16 animate-slideInUp">
          <h2 id="doctor-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-5 lg:mb-8 px-2 break-words">
            <span className="text-[#112D4E]">Meet Dr. Vijaya Nirmala Polavaram, MD</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-[#3F72AF] font-semibold mb-3 sm:mb-4 px-4 break-words">
            Founder & Lead Physician | Hair Restoration & Aesthetic Medicine Specialist
          </p>

          <div className="flex items-center justify-center space-x-2 text-[#112D4E]/80 px-4">
            <span className="text-xl sm:text-2xl">🌿</span>
            <p className="text-sm sm:text-base lg:text-lg italic font-medium break-words">
              "Where Science Meets the Art of Confidence."
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 items-start">
          {/* Left Side - Doctor Image */}
          <div className="animate-scaleIn flex flex-col">
            <div className="relative mb-4 sm:mb-6">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl shadow-xl relative aspect-[3/4]">
                <img
                  src="/assets/aboutdrv.webp"
                  srcSet="/assets/aboutdrv.webp 600w"
                  alt="Dr. Vijaya Nirmala Polavaram - Hair Restoration Specialist"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  width={600}
                  height={800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>
            </div>

            {/* Credentials Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 shadow-xl" role="region" aria-labelledby="credentials-heading">
              <h4 id="credentials-heading" className="text-xl sm:text-2xl font-bold text-[#112D4E] mb-6 flex items-center">
                <Award className="w-6 h-6 text-[#3F72AF] mr-2" aria-hidden="true" />
                Credentials at a Glance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#3F72AF] rounded-full" aria-hidden="true"></div>
                    <span className="text-sm sm:text-base lg:text-lg text-[#112D4E]/80"><strong>MBBS:</strong> SV Medical College, Tirupati, India</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#3F72AF] rounded-full" aria-hidden="true"></div>
                    <span className="text-sm sm:text-base lg:text-lg text-[#112D4E]/80"><strong>MD:</strong> Mount Sinai Medical College, New York</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#3F72AF] rounded-full" aria-hidden="true"></div>
                    <span className="text-sm sm:text-base lg:text-lg text-[#112D4E]/80"><strong>Fellowship:</strong> Hair Restoration Surgery, ISHRS</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#3F72AF] rounded-full" aria-hidden="true"></div>
                    <span className="text-sm sm:text-base lg:text-lg text-[#112D4E]/80"><strong>Experience:</strong> 26 Years of Clinical Excellence</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#3F72AF] rounded-full" aria-hidden="true"></div>
                    <span className="text-sm sm:text-base lg:text-lg text-[#112D4E]/80"><strong>Memberships:</strong> AMA | ACP | ISHRS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Doctor Details */}
          <div className="flex flex-col animate-slideInUp space-y-5 sm:space-y-6 lg:space-y-7">

            {/* Vision Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 shadow-xl" role="article" aria-labelledby="vision-heading">
              <h4 id="vision-heading" className="text-xl sm:text-2xl lg:text-2xl font-bold text-[#112D4E] mb-4 sm:mb-5 flex items-center">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-[#3F72AF] mr-3" aria-hidden="true" />
                A Vision Rooted in Care, Refined by Experience
              </h4>
              <p className="text-[#112D4E]/80 leading-relaxed text-sm sm:text-base lg:text-lg">
                For over 26 years, Dr. Vijaya Nirmala Polavaram, lovingly known as Dr. V, has dedicated her life to restoring confidence through the science and art of medical aesthetics. Her philosophy is simple: every patient deserves natural, life-changing results delivered with honesty, empathy, and precision.
              </p>
            </div>

            {/* Journey Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 shadow-xl" role="article" aria-labelledby="journey-heading">
              <h4 id="journey-heading" className="text-xl sm:text-2xl lg:text-2xl font-bold text-[#112D4E] mb-4 sm:mb-5 flex items-center">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-[#3F72AF] mr-3" aria-hidden="true" />
                A Journey of Passion and Precision
              </h4>
              <p className="text-[#112D4E]/80 leading-relaxed text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                While Dr. V built her clinical foundation in Internal Medicine in Raleigh, NC, her passion for aesthetic transformation never paused. Over the years, she refined her expertise through continuous learning and hands-on experience, leading to the creation of Cary Laser & Aesthetics, a trusted destination for hair restoration and cosmetic skin rejuvenation.
              </p>
              <p className="text-[#112D4E]/80 leading-relaxed text-sm sm:text-base lg:text-lg">
                Her unique approach blends the meticulous science of medicine with the intuitive art of beauty, ensuring results that look natural, feel effortless, and reflect the patient's individuality.
              </p>
            </div>

            {/* Philosophy Section */}
            <div className="bg-gradient-to-r from-[#3F72AF]/10 to-[#112D4E]/10 rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 shadow-xl border border-[#3F72AF]/20" role="article" aria-labelledby="philosophy-heading">
              <h4 id="philosophy-heading" className="text-xl sm:text-2xl lg:text-2xl font-bold text-[#112D4E] mb-4 sm:mb-5">
                Philosophy of Care
              </h4>
              <blockquote className="text-[#112D4E]/90 leading-relaxed text-sm sm:text-base lg:text-lg italic mb-3 sm:mb-4 border-l-4 border-[#3F72AF] pl-4 sm:pl-5">
                "Aesthetic medicine is not about changing who you are. It's about restoring how you feel. My mission is to help every patient rediscover confidence that feels natural and authentic."
                <div className="text-right mt-2 sm:mt-3">
                  <span className="text-[#112D4E]/80 font-semibold text-base sm:text-lg">— Dr. V</span>
                </div>
              </blockquote>
              <p className="text-[#112D4E]/80 leading-relaxed text-sm sm:text-base lg:text-lg mt-3 sm:mt-4">
                Dr. V believes true care extends beyond procedures. Every consultation begins with listening, understanding a patient's goals, lifestyle, and emotional journey, before crafting a personalized treatment plan built on trust and transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Centered Why Choose Dr. V Section */}
        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10 mb-0 animate-slideInUp">
          <div className="bg-white rounded-xl sm:rounded-2xl p-7 sm:p-8 shadow-xl w-full max-w-4xl">
            <div className="flex items-start gap-5 sm:gap-6 flex-col md:flex-row justify-center">
              {/* Left: Points */}
              <div className="flex-1 w-full md:w-auto">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-5 sm:mb-6">
                  <Users className="w-6 h-6 text-[#3F72AF] flex-shrink-0" aria-hidden="true" />
                  <h4 className="text-xl sm:text-2xl font-bold text-[#112D4E]">Why Patients Choose Dr.V</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 items-start">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#3F72AF] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm sm:text-base text-[#112D4E]/80 leading-relaxed">Personalized Consultations</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#3F72AF] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm sm:text-base text-[#112D4E]/80 leading-relaxed">Natural-Looking Results</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#3F72AF] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm sm:text-base text-[#112D4E]/80 leading-relaxed">Ethical & Transparent Care</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#3F72AF] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm sm:text-base text-[#112D4E]/80 leading-relaxed">Warm and Comforting Environment</span>
                  </div>
                </div>
              </div>

              {/* Right: ISHRS Badge */}
              <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
                <img
                  src="/assets/batch.jpeg"
                  srcSet="/assets/batch.jpeg 200w"
                  alt="ISHRS Member Badge"
                  className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] object-contain"
                  loading="eager"
                  decoding="sync"
                  width={200}
                  height={200}
                  sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 180px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Doctor);