import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeadTags from '../seo/headManager';
import { createServiceSchema, createBreadcrumbList } from '../seo/schemas';
import { Scissors, Zap, Eye, User, Droplets, Sun, Palette, Pill, Heart, Apple, CheckCircle, Clock, DollarSign, Award, Shield, Sparkles, ChevronDown } from 'lucide-react';

type ServiceSlug =
  | 'fue-hair-transplant'
  | 'fut-hair-transplant'
  | 'eyebrow-transplant'
  | 'beard-transplant'
  | 'prp-therapy'
  | 'laser-therapy'
  | 'scalp-micropigmentation'
  | 'medication-management'
  | 'autologous-fat-transfer'
  | 'nutrition-therapy';

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface RecoveryPhase {
  period: string;
  description: string;
  milestones?: string[];
}

interface ServiceContent {
  slug: ServiceSlug;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  heroSummary: string;
  keyBenefits: string[];
  overview: string;
  whyChoose?: string[];
  procedureHighlights?: {
    duration?: string;
    anesthesia?: string;
    recovery?: string;
    results?: string;
  };
  benefits: Benefit[];
  candidacy: {
    ideal?: string[];
    considerations?: string[];
    description?: string;
  };
  recovery?: RecoveryPhase[];
  investment?: {
    description?: string;
    factors?: string[];
    financing?: string[];
  };
}

const servicesContent: Record<ServiceSlug, ServiceContent> = {
  'fue-hair-transplant': {
    slug: 'fue-hair-transplant',
    title: 'FUE Hair Transplant',
    icon: Scissors,
    heroSummary:
      'Advanced Follicular Unit Extraction for natural, permanent hair restoration with minimal scarring and faster recovery.',
    keyBenefits: [
      'No linear scar - wear your hair short with confidence',
      'Faster recovery (3-5 days)',
      'Natural, undetectable results'
    ],
    overview:
      'Follicular Unit Extraction (FUE) is a state-of-the-art hair transplant technique where individual hair follicles are carefully extracted one by one from the donor area using specialized micro-punch tools. This minimally invasive approach eliminates the need for a linear incision, resulting in faster healing and virtually no visible scarring. Each follicular unit is meticulously harvested to preserve its integrity and then strategically placed in the recipient area following your natural hair growth patterns.',
    whyChoose: [
      'No linear scar - wear your hair short with confidence',
      'Faster recovery compared to traditional methods',
      'Minimal post-operative discomfort',
      'Precise, artistic hairline design',
      'Natural, undetectable results'
    ],
    procedureHighlights: {
      duration: '4-8 hours',
      anesthesia: 'Local',
      recovery: '3-5 days',
      results: '12-18 months'
    },
    benefits: [
      {
        icon: Shield,
        title: 'No Linear Scar',
        description: 'Individual follicle extraction leaves only tiny dots that heal quickly and are virtually undetectable.'
      },
      {
        icon: Clock,
        title: 'Faster Recovery',
        description: 'Return to normal activities within 3-5 days with minimal discomfort and downtime.'
      },
      {
        icon: Sparkles,
        title: 'Natural Results',
        description: 'Precise placement following natural hair growth patterns for undetectable results.'
      },
      {
        icon: Award,
        title: 'Minimal Pain',
        description: 'Advanced techniques and local anesthesia ensure a comfortable procedure experience.'
      },
      {
        icon: CheckCircle,
        title: 'No Sutures',
        description: 'Micro-punch extraction eliminates the need for stitches or staples.'
      },
      {
        icon: Scissors,
        title: 'Short Hair Friendly',
        description: 'Can be performed with very short donor hair, no need to grow hair long beforehand.'
      }
    ],
    candidacy: {
      ideal: [
        'Stable hair loss pattern (typically age 25+)',
        'Sufficient donor hair density',
        'Realistic expectations about results',
        'Good overall health',
        'Commitment to post-procedure care',
        'Non-smoker or willing to quit temporarily'
      ],
      description:
        'We conduct a comprehensive evaluation during your consultation to determine if FUE is the best option for your unique situation. We assess your hair loss pattern, donor area density, and discuss your goals and expectations.'
    },
    recovery: [
      {
        period: 'Day of Procedure',
        description: '4-8 hour procedure depending on graft count. Local anesthesia ensures comfort throughout.',
        milestones: ['Procedure completion', 'Local anesthesia administered', 'Immediate post-op care']
      },
      {
        period: 'Days 1-3',
        description: 'Mild swelling possible. Sleep with head elevated. Gentle washing begins day 2.',
        milestones: ['Head elevation for sleep', 'Gentle washing starts']
      },
      {
        period: 'Days 4-7',
        description: 'Return to work and light activities. Avoid strenuous exercise and direct sun exposure.',
        milestones: ['Normal activities resume', 'Light work permitted']
      },
      {
        period: 'Weeks 2-3',
        description: 'Transplanted hair may shed (normal process). Donor area fully healed.',
        milestones: ['Shedding phase begins', 'Donor area healing complete']
      },
      {
        period: 'Months 3-4',
        description: 'New hair growth begins. Initial fine hair becomes visible.',
        milestones: ['New growth starts', 'Visible hair appears']
      },
      {
        period: 'Months 6-12',
        description: 'Progressive thickening and lengthening. 70-80% of final result achieved.',
        milestones: ['Significant thickening', '70-80% results visible']
      },
      {
        period: '12-18 Months',
        description: 'Full results achieved. Hair continues to grow naturally for life.',
        milestones: ['Final results', 'Permanent growth']
      }
    ],
    investment: {
      description:
        'FUE hair transplant cost varies based on the number of grafts needed and the complexity of your case. During your consultation, we provide a detailed treatment plan and transparent pricing.',
      factors: [
        'Number of grafts required',
        'Size of treatment area',
        'Complexity of hairline design',
        'Follow-up treatments needed'
      ],
      financing: [
        '0% interest financing available',
        'Flexible payment plans',
        'Payment solutions',
        'HSA/FSA eligible'
      ]
    }
  },
  'fut-hair-transplant': {
    slug: 'fut-hair-transplant',
    title: 'FUT Hair Transplant',
    icon: Zap,
    heroSummary: 'Strip harvesting method providing maximum graft density for comprehensive hair restoration in a single session.',
    keyBenefits: [
      'Optimal graft survival rate',
      'Complete donor coverage area',
      'Ideal for extensive baldness',
      'Cost-efficient for large areas'
    ],
    overview:
      'Follicular Unit Transplantation (FUT) is a traditional yet highly effective hair transplant method where a strip of tissue containing hair follicles is surgically removed from the donor area. This technique allows for maximum graft density and is ideal for patients requiring extensive hair restoration. The harvested follicles are then carefully dissected and transplanted to the recipient area, following natural hair growth patterns for undetectable results.',
    whyChoose: [
      'Maximum graft yield in single session',
      'Proven long-term results',
      'Cost-effective for large coverage areas',
      'High graft survival rates',
      'Natural hair growth pattern'
    ],
    procedureHighlights: {
      duration: '5-10 hours',
      anesthesia: 'Local',
      recovery: '7-14 days',
      results: '12-18 months'
    },
    benefits: [
      {
        icon: Award,
        title: 'Maximum Graft Yield',
        description: 'Single session can harvest maximum number of grafts for comprehensive restoration.'
      },
      {
        icon: CheckCircle,
        title: 'Proven Results',
        description: 'Decades of proven success with natural, long-lasting results.'
      },
      {
        icon: DollarSign,
        title: 'Cost Efficient',
        description: 'More grafts per dollar compared to other methods, ideal for large areas.'
      },
      {
        icon: Shield,
        title: 'High Survival Rate',
        description: 'Excellent graft survival rates due to minimal manipulation during harvesting.'
      }
    ],
    candidacy: {
      ideal: [
        'Extensive hair loss requiring large coverage',
        'Adequate donor hair density',
        'Willingness to have a linear scar',
        'Stable hair loss pattern',
        'Good overall health'
      ],
      description:
        'FUT is ideal for patients with extensive hair loss who want maximum coverage in fewer sessions. During consultation, we evaluate your hair loss pattern and donor area to determine if FUT is the best option for you.'
    },
    recovery: [
      {
        period: 'Days 1-7',
        description: 'Sutures removed after 7-10 days. Keep donor area clean and dry.',
        milestones: ['Donor area healing', 'Suture removal']
      },
      {
        period: 'Days 7-14',
        description: 'Return to normal activities. Avoid heavy lifting and strenuous exercise.',
        milestones: ['Normal activities resume']
      },
      {
        period: 'Months 3-6',
        description: 'New hair growth begins with progressive thickening.',
        milestones: ['New growth visible']
      },
      {
        period: 'Months 12-18',
        description: 'Full results achieved with natural, permanent hair growth.',
        milestones: ['Final results']
      }
    ]
  },
  'eyebrow-transplant': {
    slug: 'eyebrow-transplant',
    title: 'Eyebrow Transplant',
    icon: Eye,
    heroSummary: 'Specialized micro-transplant technique restoring natural eyebrow arches and fullness with artistic precision.',
    keyBenefits: [
      'Custom eyebrow shape design',
      'Natural growth direction',
      'Permanent follicle survival',
      'No daily maintenance needed'
    ],
    overview:
      'Eyebrow transplantation is a delicate procedure that requires artistic skill and precision. Using FUE techniques, individual hair follicles are carefully extracted from the donor area (typically the back of the scalp) and transplanted to create natural-looking eyebrows. Each hair is placed at the correct angle and direction to mimic natural eyebrow growth, resulting in permanent, realistic results that enhance facial symmetry and expression.',
    whyChoose: [
      'Artistic design matching your facial features',
      'Natural growth patterns and angles',
      'Permanent solution',
      'Minimal scarring',
      'Enhanced facial symmetry'
    ],
    procedureHighlights: {
      duration: '3-5 hours',
      anesthesia: 'Local',
      recovery: '5-7 days',
      results: '6-12 months'
    },
    benefits: [
      {
        icon: Sparkles,
        title: 'Custom Shape Design',
        description: 'Artistic eyebrow design tailored to complement your facial features and symmetry.'
      },
      {
        icon: CheckCircle,
        title: 'Natural Growth Direction',
        description: 'Precise angulation creates realistic eyebrow appearance that grows naturally.'
      },
      {
        icon: Shield,
        title: 'Permanent Results',
        description: 'Transplanted follicles grow permanently, eliminating need for daily makeup or pencils.'
      },
      {
        icon: Award,
        title: 'Minimal Maintenance',
        description: 'Occasional trimming is all that is needed - no daily drawing or filling required.'
      }
    ],
    candidacy: {
      ideal: [
        'Sparse or over-plucked eyebrows',
        'Eyebrow loss due to trauma',
        'Adequate donor hair available',
        'Realistic expectations',
        'Good overall health'
      ],
      description:
        'Ideal candidates include those with thinning eyebrows, over-plucked brows, or loss due to medical conditions or trauma. We work with you to design the perfect eyebrow shape that complements your natural features.'
    },
    recovery: [
      {
        period: 'Days 1-5',
        description: 'Gentle care of transplanted area. Avoid touching or scratching.',
        milestones: ['Initial healing']
      },
      {
        period: 'Weeks 2-4',
        description: 'Scabs naturally fall off. Some shedding may occur (normal process).',
        milestones: ['Scab removal', 'Shedding phase']
      },
      {
        period: 'Months 3-4',
        description: 'New eyebrow hair begins growing with natural direction and texture.',
        milestones: ['New growth starts']
      },
      {
        period: 'Months 6-12',
        description: 'Full eyebrow restoration with permanent, natural-looking results.',
        milestones: ['Final results']
      }
    ]
  },
  'beard-transplant': {
    slug: 'beard-transplant',
    title: 'Beard Transplant',
    icon: User,
    heroSummary: 'Advanced beard restoration using strategic follicle placement to create natural-looking, full facial hair.',
    keyBenefits: [
      'Natural beard styling',
      'Customizable density levels',
      'Multiple facial area coverage',
      'Permanent hair growth'
    ],
    overview:
      'Beard transplantation creates fuller, more defined facial hair using advanced FUE techniques. Hair follicles are extracted from the donor area and strategically placed in the beard region (cheeks, chin, mustache, sideburns, or goatee area) following natural growth patterns. This procedure allows for complete customization of beard density, shape, and style to achieve your desired masculine appearance.',
    whyChoose: [
      'Complete beard customization',
      'Natural facial hair growth',
      'Permanent beard solution',
      'Coverage for patchy areas',
      'Enhanced facial definition'
    ],
    procedureHighlights: {
      duration: '4-8 hours',
      anesthesia: 'Local',
      recovery: '5-7 days',
      results: '6-12 months'
    },
    benefits: [
      {
        icon: Sparkles,
        title: 'Customized Styling',
        description: 'Design your ideal beard shape, density, and style to match your vision.'
      },
      {
        icon: CheckCircle,
        title: 'Natural Patterns',
        description: 'Follicles placed to follow natural beard growth direction for realistic appearance.'
      },
      {
        icon: Shield,
        title: 'Full Coverage',
        description: 'Address patchy areas, thin spots, or complete lack of facial hair growth.'
      },
      {
        icon: Award,
        title: 'Multiple Areas',
        description: 'Coverage available for cheeks, chin, mustache, sideburns, and goatee areas.'
      }
    ],
    candidacy: {
      ideal: [
        'Patchy or thin facial hair',
        'Complete absence of beard growth',
        'Desire for fuller, defined beard',
        'Adequate donor hair available',
        'Realistic expectations'
      ],
      description:
        'Perfect for men who want to enhance their facial hair for aesthetic or confidence reasons. We help design the perfect beard that complements your face shape and personal style.'
    },
    recovery: [
      {
        period: 'Days 1-5',
        description: 'Keep transplanted area clean. Avoid shaving or touching.',
        milestones: ['Initial healing']
      },
      {
        period: 'Weeks 2-4',
        description: 'Scabs fall off naturally. Temporary shedding may occur.',
        milestones: ['Scab removal']
      },
      {
        period: 'Months 3-6',
        description: 'New beard hair begins growing with natural texture and direction.',
        milestones: ['New growth']
      },
      {
        period: 'Months 6-12',
        description: 'Full beard restoration with permanent, natural-looking facial hair.',
        milestones: ['Final results']
      }
    ]
  },
  'prp-therapy': {
    slug: 'prp-therapy',
    title: 'PRP Therapy',
    icon: Droplets,
    heroSummary: 'Autologous platelet-rich plasma injection therapy promoting natural hair follicle regeneration and strengthening.',
    keyBenefits: [
      'Safe natural treatment',
      'Stimulates cellular growth',
      'No surgical intervention',
      'Enhances transplant results'
    ],
    overview:
      'Platelet-Rich Plasma (PRP) therapy harnesses the healing power of your own blood to promote hair growth. A small sample of your blood is drawn and processed to concentrate platelets, which contain growth factors essential for tissue repair and regeneration. This concentrated PRP is then injected into the scalp, stimulating dormant hair follicles and promoting thicker, healthier hair growth.',
    whyChoose: [
      '100% natural - uses your own blood',
      'Non-surgical treatment',
      'Minimal downtime',
      'Can enhance transplant results',
      'No allergic reactions'
    ],
    procedureHighlights: {
      duration: '45-60 minutes',
      anesthesia: 'Topical (optional)',
      recovery: 'No downtime',
      results: '3-6 months'
    },
    benefits: [
      {
        icon: Heart,
        title: 'Natural Treatment',
        description: 'Uses your own blood platelets - no foreign substances or chemicals.'
      },
      {
        icon: Sparkles,
        title: 'Stimulates Growth',
        description: 'Growth factors activate dormant follicles and promote hair regeneration.'
      },
      {
        icon: Shield,
        title: 'Safe & Effective',
        description: 'Minimal side effects with proven results for many patients.'
      },
      {
        icon: Award,
        title: 'Maintenance Therapy',
        description: 'Regular sessions help maintain hair health and prevent further loss.'
      }
    ],
    candidacy: {
      ideal: [
        'Early stage hair loss',
        'Thinning hair',
        'Want to enhance transplant results',
        'Prefer non-surgical options',
        'Good overall health'
      ],
      description:
        'PRP is effective for patients in early stages of hair loss, those with thinning hair, or as maintenance therapy. It can also be combined with hair transplants to enhance results. Multiple sessions are typically recommended for optimal outcomes.'
    }
  },
  'laser-therapy': {
    slug: 'laser-therapy',
    title: 'Low Level Laser Therapy',
    icon: Sun,
    heroSummary: 'Low-level laser technology using red light wavelengths to stimulate hair follicle activity and promote growth.',
    keyBenefits: [
      'FDA-cleared devices',
      'Painless non-invasive procedure',
      'Increases scalp circulation',
      'Strengthens hair shafts'
    ],
    overview:
      'Low-Level Laser Therapy (LLLT) uses safe, cool laser light to stimulate cellular activity in hair follicles. This non-invasive treatment increases blood flow to the scalp, delivering more nutrients to hair follicles and promoting healthier, thicker hair growth. Regular treatments can help prevent further hair loss and improve overall hair quality.',
    whyChoose: [
      'Completely painless',
      'FDA-cleared technology',
      'No downtime',
      'Can be done at home or clinic',
      'Safe for all hair types'
    ],
    procedureHighlights: {
      duration: '15-30 minutes',
      anesthesia: 'None required',
      recovery: 'No downtime',
      results: '3-6 months'
    },
    benefits: [
      {
        icon: Award,
        title: 'FDA Cleared',
        description: 'Safe, medically-proven technology with FDA clearance for hair loss treatment.'
      },
      {
        icon: Shield,
        title: 'Painless',
        description: 'Completely non-invasive with no discomfort during or after treatment.'
      },
      {
        icon: Sparkles,
        title: 'Convenient',
        description: 'Available as in-office sessions or portable devices for home use.'
      },
      {
        icon: CheckCircle,
        title: 'Maintenance',
        description: 'Effective maintenance therapy to preserve existing hair and prevent loss.'
      }
    ],
    candidacy: {
      ideal: [
        'Early stage hair loss',
        'Want maintenance therapy',
        'Prefer non-invasive treatment',
        'Consistent treatment commitment',
        'All hair types eligible'
      ],
      description:
        'Ideal for patients seeking non-invasive maintenance therapy. Consistent treatment sessions are key to achieving optimal results. Can be combined with other treatments for enhanced outcomes.'
    }
  },
  'scalp-micropigmentation': {
    slug: 'scalp-micropigmentation',
    title: 'Scalp Micropigmentation',
    icon: Palette,
    heroSummary: 'Advanced pigment implantation technique creating illusion of denser hair through strategic dot pattern application.',
    keyBenefits: [
      'Instant visual results',
      'All hair loss types compatible',
      'Realistic hair density effect',
      'Minimal touch-up maintenance'
    ],
    overview:
      'Scalp Micropigmentation (SMP) is an advanced cosmetic technique that replicates the appearance of hair follicles by implanting specialized pigments into the scalp. This creates the illusion of a closely shaved head or thicker, denser hair depending on your needs. The procedure involves precise placement of tiny dots that match your natural hair color and skin tone, resulting in a realistic, three-dimensional appearance.',
    whyChoose: [
      'Immediate visual improvement',
      'Works for all stages of hair loss',
      'Cost-effective solution',
      'No recovery downtime',
      'Realistic appearance'
    ],
    procedureHighlights: {
      duration: '2-4 hours per session',
      anesthesia: 'Topical',
      recovery: 'No downtime',
      results: 'Immediate'
    },
    benefits: [
      {
        icon: Sparkles,
        title: 'Instant Results',
        description: 'See immediate improvement in hair density appearance after first session.'
      },
      {
        icon: Award,
        title: 'Realistic Look',
        description: 'Creates natural-looking hair density that matches your original hair characteristics.'
      },
      {
        icon: Shield,
        title: 'Universal Solution',
        description: 'Effective for all hair loss types and patterns, including complete baldness.'
      },
      {
        icon: CheckCircle,
        title: 'Low Maintenance',
        description: 'Touch-ups needed only every 3-5 years to maintain optimal appearance.'
      }
    ],
    candidacy: {
      ideal: [
        'Any stage of hair loss',
        'Want instant visual improvement',
        'Prefer non-surgical option',
        'Realistic expectations',
        'Suitable for all hair types'
      ],
      description:
        'SMP is suitable for virtually anyone experiencing hair loss, from minor thinning to complete baldness. Multiple sessions may be needed to achieve the desired density and appearance. We customize pigment color and dot size to match your natural characteristics.'
    },
    recovery: [
      {
        period: 'Days 1-3',
        description: 'Mild redness and sensitivity. Avoid direct sun exposure and swimming.',
        milestones: ['Initial healing']
      },
      {
        period: 'Days 4-7',
        description: 'Color may appear darker initially, then softens to natural shade.',
        milestones: ['Color settling']
      },
      {
        period: 'Week 2',
        description: 'Final appearance becomes visible. Touch-ups can be scheduled if needed.',
        milestones: ['Final appearance']
      }
    ]
  },
  'medication-management': {
    slug: 'medication-management',
    title: 'Medication Management',
    icon: Pill,
    heroSummary: 'Evidence-based pharmaceutical protocols including FDA-approved medications for hair loss prevention and treatment.',
    keyBenefits: [
      'Halt hair loss progression',
      'Simple daily oral regimen',
      'FDA approved medications',
      'Enhanced treatment efficacy'
    ],
    overview:
      'Medication management is a cornerstone of effective hair loss treatment. We provide personalized protocols using FDA-approved medications that have been scientifically proven to slow hair loss and, in some cases, promote regrowth. Our approach includes comprehensive evaluation, proper dosing, monitoring, and combination with other treatments for optimal results.',
    whyChoose: [
      'Evidence-based approach',
      'FDA-approved treatments',
      'Can halt progression',
      'Enhances other treatments',
      'Convenient oral regimen'
    ],
    procedureHighlights: {
      duration: 'Ongoing',
      anesthesia: 'N/A',
      recovery: 'N/A',
      results: '3-6 months'
    },
    benefits: [
      {
        icon: Shield,
        title: 'FDA Approved',
        description: 'Clinically proven medications with FDA approval for hair loss treatment.'
      },
      {
        icon: CheckCircle,
        title: 'Proven Efficacy',
        description: 'Scientifically demonstrated to slow hair loss and support regrowth.'
      },
      {
        icon: Award,
        title: 'Enhancement Therapy',
        description: 'Complements surgical and non-surgical treatments for better outcomes.'
      },
      {
        icon: Heart,
        title: 'Convenient',
        description: 'Simple daily regimen that fits easily into your lifestyle.'
      }
    ],
    candidacy: {
      ideal: [
        'Early to moderate hair loss',
        'Want to prevent further loss',
        'Committed to daily regimen',
        'Good overall health',
        'Realistic expectations'
      ],
      description:
        'Ideal for patients seeking to prevent further hair loss or as part of a comprehensive treatment plan. Requires commitment to daily medication and regular monitoring. We provide thorough evaluation and ongoing supervision to ensure safety and effectiveness.'
    }
  },
  'autologous-fat-transfer': {
    slug: 'autologous-fat-transfer',
    title: 'Autologous Fat Transfer',
    icon: Heart,
    heroSummary: 'Stem cell-rich adipose tissue grafting technique stimulating regenerative environment for improved scalp health and thickness.',
    keyBenefits: [
      'Natural body-derived material',
      'Stem cell enrichment benefits',
      'No foreign substance rejection',
      'Scalp condition improvement'
    ],
    overview:
      'Autologous Fat Transfer (AFT) involves harvesting your own adipose (fat) tissue, which is rich in stem cells and growth factors, and injecting it into the scalp. This regenerative procedure improves scalp health, blood flow, and may stimulate hair follicle activity. The stem cells and growth factors in the fat tissue create an optimal environment for hair growth and scalp rejuvenation.',
    whyChoose: [
      'Uses your own tissue - no rejection risk',
      'Stem cell benefits',
      'Improves scalp health',
      'Regenerative properties',
      'Can combine with other treatments'
    ],
    procedureHighlights: {
      duration: '1-2 hours',
      anesthesia: 'Local',
      recovery: '2-3 days',
      results: '3-6 months'
    },
    benefits: [
      {
        icon: Heart,
        title: 'Natural Material',
        description: 'Uses your own body tissue - eliminates risk of rejection or allergic reactions.'
      },
      {
        icon: Sparkles,
        title: 'Stem Cell Rich',
        description: 'Adipose tissue contains valuable stem cells that promote regeneration.'
      },
      {
        icon: Shield,
        title: 'Scalp Health',
        description: 'Improves scalp circulation and creates healthier environment for hair follicles.'
      },
      {
        icon: Award,
        title: 'Combination Therapy',
        description: 'Effectively combines with transplants and other treatments for enhanced results.'
      }
    ],
    candidacy: {
      ideal: [
        'Adequate donor fat available',
        'Want regenerative benefits',
        'Combining with other treatments',
        'Good overall health',
        'Realistic expectations'
      ],
      description:
        'Suitable for patients seeking to improve scalp health and potentially enhance hair growth through regenerative medicine. Often used in combination with other hair restoration treatments for comprehensive results.'
    },
    recovery: [
      {
        period: 'Days 1-3',
        description: 'Mild swelling at injection sites. Avoid touching or massaging treated area.',
        milestones: ['Initial healing']
      },
      {
        period: 'Week 1-2',
        description: 'Swelling subsides. Normal activities can resume.',
        milestones: ['Recovery complete']
      },
      {
        period: 'Months 3-6',
        description: 'Benefits become visible with improved scalp health and potential hair improvements.',
        milestones: ['Results visible']
      }
    ]
  },
  'nutrition-therapy': {
    slug: 'nutrition-therapy',
    title: 'Nutrition Therapy',
    icon: Apple,
    heroSummary: 'Personalized dietary optimization program targeting micronutrient deficiencies that impact hair follicle health and growth.',
    keyBenefits: [
      'Comprehensive nutrient assessment',
      'Vitamin and mineral optimization',
      'Hair-healthy meal planning',
      'Supplement protocol guidance'
    ],
    overview:
      'Nutrition plays a crucial role in hair health. Our nutrition therapy program involves comprehensive assessment of your dietary intake and identification of micronutrient deficiencies that may be contributing to hair loss. We create personalized meal plans and supplement protocols designed to optimize hair follicle function and support healthy hair growth from within.',
    whyChoose: [
      'Addresses root causes',
      'Holistic approach',
      'Long-term benefits',
      'Supports all treatments',
      'Sustainable lifestyle changes'
    ],
    procedureHighlights: {
      duration: 'Ongoing program',
      anesthesia: 'N/A',
      recovery: 'N/A',
      results: '3-6 months'
    },
    benefits: [
      {
        icon: Apple,
        title: 'Comprehensive Assessment',
        description: 'Thorough evaluation of your nutritional status and hair health.'
      },
      {
        icon: CheckCircle,
        title: 'Personalized Plan',
        description: 'Custom meal plans and supplement protocols tailored to your needs.'
      },
      {
        icon: Heart,
        title: 'Holistic Approach',
        description: 'Addresses overall health and wellness, not just hair symptoms.'
      },
      {
        icon: Award,
        title: 'Long-term Support',
        description: 'Sustainable changes that support hair health for life.'
      }
    ],
    candidacy: {
      ideal: [
        'Hair loss related to nutrition',
        'Micronutrient deficiencies',
        'Want holistic approach',
        'Committed to lifestyle changes',
        'Seeking long-term solutions'
      ],
      description:
        'Ideal for patients whose hair loss may be related to nutritional deficiencies or those seeking a comprehensive, holistic approach to hair restoration. Works exceptionally well when combined with other treatment modalities.'
    }
  }
};

function slugFromHash(): ServiceSlug | null {
  const match = window.location.hash.match(/^#\/service\/([a-z0-9-]+)/i);
  if (!match) return null;
  const slug = match[1] as ServiceSlug;
  return (servicesContent as any)[slug] ? slug : null;
}

// Hero Section with 3D Animation
interface HeroSection3DProps {
  service: ServiceContent;
  serviceImageMap: Partial<Record<ServiceSlug, string>>;
  heroImgLoaded: boolean;
  setHeroImgLoaded: (loaded: boolean) => void;
  headingRef: React.RefObject<HTMLHeadingElement>;
}

const HeroSection3D: React.FC<HeroSection3DProps> = ({
  service,
  serviceImageMap,
  heroImgLoaded,
  setHeroImgLoaded,
  headingRef
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  // Parallax effect for background image (only after intro animation)
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Animation variants for 3D fade-merge effect
  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 1.1
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] // Custom cubic-bezier easing
      }
    }
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      rotateX: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  };

  const summaryVariants = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  };

  return (
    <div
      ref={heroRef}
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[80vh] overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Background Image with 3D animation and parallax */}
      {serviceImageMap[service.slug] ? (
        <>
          {/* Skeleton shimmer while loading */}
          {!heroImgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          )}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              y: parallaxY,
              willChange: 'transform'
            }}
          >
            <motion.img
              src={serviceImageMap[service.slug] as string}
              srcSet={`${serviceImageMap[service.slug]} 1920w`}
              alt={`${service.title} illustration`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              width={1920}
              height={1080}
              sizes="100vw"
              onLoad={() => setHeroImgLoaded(true)}
              onError={() => setHeroImgLoaded(true)}
              style={{
                willChange: 'opacity, transform',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            />
          </motion.div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#112D4E] to-[#3F72AF]"></div>
      )}

      {/* Dark Overlay Gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/40"></div>

      {/* Content Container with 3D perspective */}
      <div
        className="relative z-10 min-h-[80vh] flex flex-col justify-center"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="px-4 sm:px-6 lg:pl-[5%] xl:pl-[6%] 2xl:pl-[8%] text-center lg:text-left">
          {/* Title with 3D rotation and fade */}
          <motion.h1
            ref={headingRef}
            tabIndex={-1}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] mb-3 sm:mb-4 break-words focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent leading-tight"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            style={{
              willChange: 'opacity, transform',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            {service.title}
          </motion.h1>

          {/* Hero Summary with delayed 3D slide-up */}
          <motion.p
            className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0 leading-snug mb-6 sm:mb-8"
            variants={summaryVariants}
            initial="hidden"
            animate="visible"
            style={{
              willChange: 'opacity, transform',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            {service.heroSummary}
          </motion.p>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 drop-shadow-lg" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </div>
  );
};

const ServiceDetails: React.FC = () => {
  const [slug, setSlug] = useState<ServiceSlug | null>(() => slugFromHash());
  // Simple enter transition state to create subtle page shift on mount
  const [isEntering, setIsEntering] = useState(true);
  // Focus target for accessibility
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // Trigger enter animation on mount
    const raf = requestAnimationFrame(() => setIsEntering(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const handler = () => {
      const newSlug = slugFromHash();
      setSlug(newSlug);
    };

    // Check on mount
    handler();

    // Listen for changes
    window.addEventListener('hashchange', handler);
    window.addEventListener('popstate', handler);

    return () => {
      window.removeEventListener('hashchange', handler);
      window.removeEventListener('popstate', handler);
    };
  }, []);

  const service = useMemo(() => (slug ? servicesContent[slug] : null), [slug]);

  // Defer rendering of below-the-fold sections to speed up first paint
  const [deferredReady, setDeferredReady] = useState(false);
  // Track hero image load to avoid visible blank flash
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);

  useEffect(() => {
    // Reset heroImgLoaded when slug changes and try to resolve from cache synchronously
    setHeroImgLoaded(false);
    if (slug) {
      const url = (serviceImageMap as any)[slug] as string | undefined;
      if (url) {
        const probe = new Image();
        probe.src = url;
        if ((probe as any).complete) {
          setHeroImgLoaded(true);
        } else {
          probe.onload = () => setHeroImgLoaded(true);
          probe.onerror = () => setHeroImgLoaded(true);
        }
      }
    }
    // Use requestIdleCallback when available to schedule non-critical work
    const schedule = (cb: () => void) =>
      (window as any).requestIdleCallback ? (window as any).requestIdleCallback(cb) : setTimeout(cb, 1);
    schedule(() => setDeferredReady(true));
  }, [slug]);

  // Move focus to the page heading when service changes (for SR users)
  useEffect(() => {
    if (headingRef.current) {
      // Defer slightly to allow DOM paint
      const id = requestAnimationFrame(() => headingRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [service?.title]);

  // Memoize serviceImageMap to avoid recreation on every render
  const serviceImageMap = useMemo<Partial<Record<ServiceSlug, string>>>(() => ({
    'eyebrow-transplant': '/assets/eyebrowtreatment.webp',
    'fue-hair-transplant': '/assets/fuetreatment.webp',
    'fut-hair-transplant': '/assets/futtreatment.webp',
    'beard-transplant': '/assets/beardtreatment.webp',
    'prp-therapy': '/assets/prptreatment.webp',
    'laser-therapy': '/assets/lasertreatment.webp',
    'scalp-micropigmentation': '/assets/scalpmicropigmentationtreatment.webp',
    'medication-management': '/assets/medicationmanagementtreatment.webp',
    'autologous-fat-transfer': '/assets/autologousfattransfer.webp',
    'nutrition-therapy': '/assets/nutritiontherapy.webp'
  }), []);

  // Memoize description maps to avoid recreation on every render
  const benefitDescriptionMaps = useMemo(() => ({
    benefitDetails: {
      'Addresses root causes': 'Our comprehensive nutritional analysis identifies and targets the underlying deficiencies affecting your hair health, ensuring we treat the source, not just symptoms.',
      'Holistic approach': 'We integrate nutrition with your overall wellness, recognizing that optimal hair health requires a balanced approach to diet, lifestyle, and medical care.',
      'Long-term benefits': 'Unlike temporary solutions, our nutrition therapy creates sustainable habits that support healthy hair growth throughout your lifetime.',
      'Supports all treatments': 'Our nutritional protocols enhance the effectiveness of surgical and non-surgical treatments, maximizing your results.',
      'Sustainable lifestyle changes': 'We provide practical, achievable dietary modifications that become natural parts of your daily routine for lasting impact.'
    },
    descriptions: {
      'Artistic design matching your facial features': 'Our skilled team creates eyebrow designs that complement your unique facial structure, ensuring natural symmetry and enhanced beauty.',
      'Natural growth patterns and angles': 'Each transplanted hair is placed with precision to match natural eyebrow growth direction, creating realistic, undetectable results.',
      'Permanent solution': 'Unlike daily makeup or temporary solutions, eyebrow transplantation provides a permanent fix that grows naturally and requires only occasional trimming.',
      'Minimal scarring': 'Advanced FUE techniques ensure minimal, virtually invisible scarring while maximizing hair follicle survival for optimal density.',
      'Enhanced facial symmetry': 'Carefully planned eyebrow restoration improves facial balance and expression, creating a more youthful and harmonious appearance.',
      'Complete beard customization': 'We tailor the density, shape, and style of your beard to perfectly match your facial features and personal aesthetic goals.',
      'Natural facial hair growth': 'Implants are placed at the exact angle and direction of your natural facial hair for a seamless, undetectable result.',
      'Permanent beard solution': 'Transplanted hair follicles grow permanently, providing a lifetime solution to patchiness or inability to grow a full beard.',
      'Coverage for patchy areas': 'Effectively fills in patches, scars, or areas of low density to create a uniform, full beard appearance.',
      'Enhanced facial definition': 'A well-defined beard can contour the jawline and chin, adding structure and masculinity to the facial profile.',

      // PRP Therapy
      '100% natural - uses your own blood': 'Utilizes your body’s own healing mechanisms, eliminating the risk of allergic reactions or adverse side effects found in synthetic treatments.',
      'Non-surgical treatment': 'A simple, injectable procedure performed comfortably in our office without incisions, stitches, or significant recovery time.',
      'Minimal downtime': 'Return to your daily activities immediately after treatment, with only minor temporal swelling or redness possible.',
      'Can enhance transplant results': 'When combined with hair restoration surgery, PRP accelerates healing and improves graft survival rates for denser results.',
      'No allergic reactions': 'Since the treatment uses your own biological material, there is virtually zero risk of allergic rejection or incompatibility.',

      // Laser Therapy
      'Completely painless': 'A comfortable, relaxing experience where you feel only minimal warmth as the therapeutic light works to stimulate your scalp.',
      'FDA-cleared technology': 'Utilizes devices and wavelengths rigorously tested and cleared by the FDA for safety and efficacy in treating hair loss.',
      'No downtime': 'Requires absolutely no recovery period; simply undergo your session and continue with your day without interruption.',
      'Can be done at home or clinic': 'Flexible options allow for professional in-clinic sessions or high-quality devices for convenient treatment in the comfort of your home.',
      'Safe for all hair types': 'Effective for both men and women across various hair textures and skin tones without risk of damage.',

      // Scalp Micropigmentation
      'Immediate visual improvement': 'Walk out of your first session with the appearance of a full head of hair or significantly increased density.',
      'Works for all stages of hair loss': 'Versatile solution effective for everything from minor thinning and receding hairlines to complete baldness.',
      'Cost-effective solution': 'A fraction of the cost of surgical options, providing a high-impact aesthetic improvement for a reasonable investment.',
      'No recovery downtime': 'Non-invasive procedure allowing you to return to work and social activities often the same or next day.',
      'Realistic appearance': 'Expertly applied pigments perfectly match your natural hair color and skin tone for an undetectable, natural look.',

      // Medication Management
      'Evidence-based approach': 'Protocols grounded in scientific research and clinical studies ensuring you receive the most effective known medical treatments.',
      'FDA-approved treatments': 'Prescribing only medications that have met rigorous FDA standards for safety and proven efficacy in hair regrowth.',
      'Can halt progression': 'Effective at stopping the hormonal processes that cause hair loss, preserving the hair you still have.',
      'Enhances other treatments': 'Creates a fertile environment for regrowth that improves the success and longevity of surgical and other non-surgical procedures.',
      'Convenient oral regimen': 'Simple, easy-to-follow daily routines that fit seamlessly into your lifestyle without complex procedures.',

      // Autologous Fat Transfer
      'Uses your own tissue - no rejection risk': 'Biocompatible treatment using your own adipose tissue ensures complete acceptance by your body without immune rejection.',
      'Stem cell benefits': 'Adipose-derived stem cells actively regenerate damaged tissue and stimulate dormant hair follicles for renewed growth.',
      'Improves scalp health': 'Rejuvenates the scalp environment by increasing blood supply and nutrient delivery to starving hair follicles.',
      'Regenerative properties': 'Goes beyond symptom management to repair tissues at a cellular level, promoting long-term scalp vitality.',
      'Can combine with other treatments': 'Synergistically works with transplants to improve graft take and with PRP for amplified regenerative effects.'
    },
    defaultDescriptions: {
      'No linear scar - wear your hair short with confidence': 'Individual follicle extraction leaves only tiny dots that heal quickly and are virtually undetectable, allowing you to style your hair however you prefer.',
      'Faster recovery compared to traditional methods': 'Minimally invasive FUE techniques mean you can return to normal activities within days, with minimal discomfort and downtime.',
      'Minimal post-operative discomfort': 'Advanced local anesthesia and gentle techniques ensure maximum comfort throughout the procedure and during recovery.',
      'Precise, artistic hairline design': 'Our experienced surgeons craft hairlines that look completely natural, following your original hair growth patterns.',
      'Natural, undetectable results': 'Meticulous graft placement and proper angulation create results that blend seamlessly with existing hair, indistinguishable from natural growth.',
      'Maximum graft yield in single session': 'FUT allows us to harvest the maximum number of grafts in one procedure, making it ideal for extensive restoration.',
      'Proven long-term results': 'With decades of clinical success, FUT has demonstrated exceptional longevity and natural-looking results that stand the test of time.',
      'Cost-effective for large coverage areas': 'The efficiency of strip harvesting makes FUT a more economical choice for patients requiring extensive hair restoration.',
      'High graft survival rates': 'The strip harvesting method preserves follicle integrity, resulting in superior survival rates and optimal hair density.'
    }
  }), []);

  if (!service) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#F9F7F7] to-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#112D4E] mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">
            The service you're looking for doesn't exist or the link is invalid.
            <br />
            <span className="text-sm">Hash: {window.location.hash}</span>
            <br />
            <span className="text-sm">Slug: {slug || 'null'}</span>
          </p>
          <button
            onClick={() => {
              // Clear the category on error page navigation
              sessionStorage.removeItem('lastServiceCategory');
              window.location.hash = '#services';
              window.location.reload();
            }}
            className="bg-[#3F72AF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3F72AF]/90"
          >
            Back to Treatments
          </button>
        </div>
      </section>
    );
  }

  // Determine if the current service is surgical or non-surgical
  const isNonSurgical = useMemo(() => {
    if (!service) return false;
    const nonSurgicalSlugs: ServiceSlug[] = [
      'prp-therapy',
      'laser-therapy',
      'scalp-micropigmentation',
      'medication-management',
      'autologous-fat-transfer',
      'nutrition-therapy'
    ];
    return nonSurgicalSlugs.includes(service.slug);
  }, [service]);

  // Store the service category in session storage when component mounts
  useEffect(() => {
    if (service) {
      sessionStorage.setItem('lastServiceCategory', isNonSurgical ? 'non-surgical' : 'surgical');
    }
  }, [service, isNonSurgical]);

  // Memoize scrollToConsultation to avoid recreation on every render
  const scrollToConsultation = useCallback(() => {
    window.location.hash = '';
    setTimeout(() => {
      const el = document.getElementById('consultation');
      if (el) {
        const headerHeight = 120;
        const top = el.offsetTop - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  // Memoize SEO data to avoid recreation on every render
  const { pageTitle, description, canonicalUrl, jsonLd } = useMemo(() => {
    const title = service.title + ' | Dr V Hair Clinic';
    const desc = service.heroSummary || service.overview.slice(0, 160);
    const url = 'https://drvhairclinic.com/' + (service.slug || '').toString();
    const ld = [
      createServiceSchema({ name: service.title, description: desc, url }),
      createBreadcrumbList([
        { name: 'Home', url: 'https://drvhairclinic.com/' },
        { name: 'Treatments', url: 'https://drvhairclinic.com/#services' },
        { name: service.title, url }
      ])
    ];
    return { pageTitle: title, description: desc, canonicalUrl: url, jsonLd: ld };
  }, [service.title, service.heroSummary, service.overview, service.slug]);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#F9F7F7] to-white overflow-hidden" role="main" aria-label="Service details page">
      <HeadTags
        title={pageTitle}
        description={description}
        canonical={canonicalUrl}
        url={canonicalUrl}
        jsonLd={jsonLd}
      />
      <div className={`relative transition-[opacity,transform] duration-300 ease-out will-change-[opacity,transform] ${isEntering ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        {/* Hero Section - 3D Animated Full-Width */}
        <HeroSection3D
          service={service}
          serviceImageMap={serviceImageMap}
          heroImgLoaded={heroImgLoaded}
          setHeroImgLoaded={setHeroImgLoaded}
          headingRef={headingRef}
        />

        {/* Content Section - After Hero */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-6 md:pb-10 lg:pb-14">
          {/* Why Choose - Enhanced detailed benefits section (deferred) */}
          {deferredReady && service.whyChoose && (
            <div className="bg-gradient-to-br from-white via-[#F9F7F7] to-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-[#E3ECF8] p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              {/* Section Header */}
              <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#112D4E] mb-2 sm:mb-3 lg:mb-4 px-2 break-words">
                  Why Choose <span className="text-[#3F72AF] break-words">{service.title}</span>?
                </h2>
                <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-[#3F72AF] to-[#112D4E] mx-auto rounded-full mb-3 sm:mb-4"></div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-4 break-words leading-relaxed">
                  Discover the comprehensive benefits that make this treatment the ideal choice for your hair restoration journey
                </p>
              </div>

              {/* Main Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-6 md:mb-8">
                {service.whyChoose.slice(0, 3).map((reason, idx) => {
                  // Use memoized description maps instead of recreating on every render
                  const descriptionMaps = benefitDescriptionMaps as { [key: string]: Record<string, string> };
                  const description = descriptionMaps.descriptions[reason] ||
                    descriptionMaps.benefitDetails[reason] ||
                    descriptionMaps.defaultDescriptions[reason] ||
                    'Experience the highest standard of care with our evidence-based approach, combining advanced techniques with personalized attention to achieve exceptional results.';

                  return (
                    <div
                      key={idx}
                      className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border-2 border-[#E3ECF8] hover:border-[#3F72AF] shadow-lg hover:shadow-2xl transition-[border-color,shadow,transform] duration-200 ease-out hover:-translate-y-1 overflow-hidden will-change-transform"
                    >
                      {/* Decorative gradient background - optimized for performance */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3F72AF]/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-300 ease-out will-change-transform pointer-events-none"></div>

                      {/* Number badge */}
                      <div className="relative mb-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#3F72AF] to-[#112D4E] text-white font-bold text-lg shadow-md">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Benefit title */}
                      <h3 className="relative text-lg sm:text-xl lg:text-2xl font-bold text-[#112D4E] mb-2 sm:mb-3 group-hover:text-[#3F72AF] transition-colors duration-200 break-words">
                        {reason}
                      </h3>

                      {/* Detailed description */}
                      <p className="relative text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                        {description}
                      </p>

                      {/* Arrow indicator - optimized hover performance */}

                    </div>
                  );
                })}
              </div>

              {/* Premium assurance badges - Enhanced */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 border-t-2 border-[#E3ECF8]">
                {[
                  {
                    label: 'Board‑Certified Leadership',
                    icon: Award,
                    description: 'Led by experienced medical professionals'
                  },
                  {
                    label: 'ISO‑Class Sterility',
                    icon: Shield,
                    description: 'Highest safety standards maintained'
                  },
                  {
                    label: 'FDA‑Cleared Methods',
                    icon: CheckCircle,
                    description: 'Evidence-based proven techniques'
                  }
                ].map((badge, idx) => {
                  const IconComponent = badge.icon;
                  return (
                    <div
                      key={idx}
                      className="group bg-gradient-to-br from-white to-[#F9FBFF] rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-[#E3ECF8] hover:border-[#3F72AF] shadow-md hover:shadow-xl transition-[border-color,shadow] duration-200 ease-out text-center"
                    >
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#3F72AF] mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200 ease-out will-change-transform" />
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-[#112D4E] mb-1 sm:mb-2 break-words">{badge.label}</div>
                      <div className="text-xs sm:text-sm text-gray-600 break-words leading-relaxed">{badge.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compact CTA Section (deferred) */}
          {deferredReady && (
            <div className="bg-[#112D4E] rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8 max-w-4xl mx-auto" style={{ contentVisibility: 'auto' }}>
              <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {/* Left: Content */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 break-words px-2 md:px-0">
                    Ready to Get Started with {service.title}?
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-white/80 mb-3 sm:mb-4 break-words px-2 md:px-0">
                    Schedule your consultation to learn if {service.title} is right for you.
                  </p>

                  {/* Inline benefit badges */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                    {[
                      { icon: CheckCircle, text: 'Free Consultation' },
                      { icon: Clock, text: 'Personalized Plan' },
                      { icon: Award, text: 'Proven Results' }
                    ].map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <div key={idx} className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm break-words">
                          <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="break-words">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Button */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  <button
                    onClick={scrollToConsultation}
                    className="group bg-white text-[#112D4E] px-5 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:bg-white/90 transition-[background-color,shadow,transform] duration-200 ease-out shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 will-change-transform touch-target w-full md:w-auto"
                  >
                    <span className="break-words">Schedule Consultation</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200 ease-out will-change-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;
