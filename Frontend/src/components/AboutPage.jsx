import React, { useEffect, useState } from 'react'
import { aboutUsStyles, aboutUsAnimations } from '../assets/dummyStyles'
import AboutBanner from '../assets/AboutBannerImage.png'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { BadgeCheck, Star, MessageCircleCode, Users, BookOpen, Award, Globe, GraduationCap, Clock, Target, Eye, Heart } from 'lucide-react'

const counterTargets = {
  students: 75000,
  courses: 3200,
  successRate: 97,
  countries: 180,
  certificates: 1200000,
  support: 24,
};

const statsMeta = [
  {
    key: "students",
    label: "Active Students",
    icon: Users,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
  },
  {
    key: "courses",
    label: "Courses",
    icon: BookOpen,
    color: "from-pink-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-purple-50",
  },
  {
    key: "successRate",
    label: "Success Rate",
    icon: Award,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
  {
    key: "countries",
    label: "Countries",
    icon: Globe,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
  },
  {
    key: "certificates",
    label: "Certificates",
    icon: GraduationCap,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
  },
  {
    key: "support",
    label: "Support",
    icon: Clock,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
  },
];


const missionVisionValues = [
  {
    type: "mission",
    icon: Target,
    title: "Our Mission",
    subtitle: "Empower Learners Worldwide",
    description:
      "We aim to create a platform where learners everywhere can acquire knowledge, skills, and confidence to succeed in life and career.",
    dotLottie: "https://lottie.host/d4aed205-8352-4490-a20a-83e4b3b3e2f6/f3nl34gaEN.lottie",
    features: [
      "Accessible education for everyone",
      "Affordable and flexible learning",
      "Global learning community",
      "Industry-focused courses",
    ],
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100",
  },
  {
    type: "vision",
    icon: Eye,
    title: "Our Vision",
    subtitle: "Shaping Future Innovators",
    description:
      "To be the most trusted global education platform enabling people to unlock their potential and make a positive impact in the world.",
    dotLottie: "https://lottie.host/591f8a0f-faba-495a-9a38-ff1bf44b5fad/W30zLs2vep.lottie",
    features: [
      "Lifelong learning mindset",
      "Future-ready skills",
      "Global community impact",
      "Innovation-driven approach",
    ],
    color: "from-purple-600 to-pink-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-100",
  },
  {
    type: "values",
    icon: Heart,
    title: "Our Values",
    subtitle: "Guiding Principles",
    description:
      "We are committed to integrity, innovation, and excellence, placing our students and community at the heart of every decision.",
    dotLottie: "https://lottie.host/4cf976d2-0a1a-4017-b021-c3fe2b0a4c18/ksM0OM58Dd.lottie",
    features: [
      "Student success first",
      "Excellence in teaching",
      "Innovation & creativity",
      "Collaboration & community",
    ],
    color: "from-green-600 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
  },
];


const values = [
  {
    title: "Quality Education",
    description:
      "We provide carefully curated courses by experts to ensure learners gain real-world skills.",
    features: ["Expert Instructors", "Updated Curriculum", "Industry Relevance"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Learner First",
    description:
      "All our decisions focus on enhancing the learner's journey and success.",
    features: ["Personalized Experience", "Career Support", "Community Building"],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Continuous Creation",
    description:
      "We continuously integrate new learning technologies to keep our platform ahead.",
    features: ["AI-driven Learning", "Interactive Labs", "Mobile-First Design"],
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Lifetime Learning",
    description:
      "Learners get lifelong access to all courses and updates for continuous growth.",
    features: ["Forever Access", "Free Updates", "Progress Tracking"],
    color: "from-orange-500 to-amber-500",
  },
];

const AboutPage = () => {
  const [counterValues, setCounterValues] = useState({
    students: 0,
    courses: 0,
    successRate: 0,
    countries: 0,
    certificates: 0,
    support: 0,
  });

  // Animated counter
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const timers = [];

    Object.keys(counterTargets).forEach((key) => {
      let current = 0;
      const target = counterTargets[key];
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounterValues((prev) => ({
          ...prev,
          [key]: Math.floor(current),
        }));
      }, stepDuration);

      timers.push(timer);
    });

    return () => timers.forEach((t) => clearInterval(t));
  }, []);

  const formatStatNumber = (key) => {
    if (key === "support") return "24/7";
    if (key === "successRate") return `${counterValues.successRate}%`;
    const val = counterValues[key] ?? 0;
    if (key === "certificates") return `${val.toLocaleString()}+`;
    return `${val.toLocaleString()}+`;
  };

  return (

    <div className={aboutUsStyles.container}>

      {/* Hero Section */}
      <section className={aboutUsStyles.heroSection}>
        <div className={aboutUsStyles.heroBackground}>
          <div
            style={{ 
              backgroundImage: `url(${AboutBanner})`, 
              opacity: 0.50 
            }}

            className={aboutUsStyles.heroImageContainer} 
          />
          <div
            className={aboutUsStyles.heroVignette}
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.72) 100%)",
            }}
          />
          <div className={aboutUsStyles.heroTint}></div>
          </div>

          <div className={aboutUsStyles.heroContent}>
            <div className={aboutUsStyles.trustBadge}>
              <Star className={aboutUsStyles.trustIcon} /> Trusted by 50,000+ students worldwide
            </div>
             
            <h1 className={aboutUsStyles.mainHeading}>About Academia</h1>
            <p className={aboutUsStyles.subHeading}>
              Empowering millions to achieve dreams through accessible education.
            </p>

            <br>
            </br>

            <div className={aboutUsStyles.statsGrid}>
              {statsMeta.slice(0, 4).map((stat, index) => (
                <div 
                key={index} 
                className={aboutUsStyles.statCard} 
                style={{ minWidth: 120 }}>

                  <div className={aboutUsStyles.statNumber}>{formatStatNumber(stat.key)}</div>
                  <div className={aboutUsStyles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
      </section>


      {missionVisionValues.map((section, index) => {
        const Icon = section.icon;
        return (
          <section
            key={section.type}
            className={`${aboutUsStyles.sectionContainer} ${section.bgColor}`}
            style={{ backgroundColor: index % 2 === 1 ? "white" : undefined }}
          >
            <div className={aboutUsStyles.sectionGrid}>
              <div
                className={`${aboutUsStyles.sectionContentGrid} ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
        
                <div
                  className={`${aboutUsStyles.sectionContent} ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className={aboutUsStyles.sectionBadge}>
                    {Icon && <Icon className={`${aboutUsStyles.sectionIcon} ${section.color}`} />}
                    <span className={aboutUsStyles.sectionBadgeText}>{section.subtitle}</span>
                  </div>

                  <h2 className={aboutUsStyles.sectionTitle}>{section.title}</h2>
                  <p className={aboutUsStyles.sectionDescription}>{section.description}</p>

                  <div className={aboutUsStyles.featuresContainer}>
                    {section.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className={aboutUsStyles.featureItem}>
                        <div className={`${aboutUsStyles.featureIcon} ${section.color}`}>
                          <BadgeCheck className={aboutUsStyles.featureIconSvg} />
                        </div>
                        <span className={aboutUsStyles.featureText}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

             
                <div className={`${aboutUsStyles.sectionImage} ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                  <DotLottieReact src={section.dotLottie} loop autoplay />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className={aboutUsStyles.valuesSection}>
        <div className={aboutUsStyles.sectionGrid}>
          <div className={aboutUsStyles.valuesHeader}>
            
            <h2 className={aboutUsStyles.valuesTitle}>Core Values That Define Us</h2>
            <p className={aboutUsStyles.valuesSubtitle}>The foundation of everything we do at Academia</p>
          </div>

          <div className={aboutUsStyles.valuesGrid}>
            {values.map((value, index) => (
              <div key={index} className={aboutUsStyles.valueCard}>
                <div className={`${aboutUsStyles.valueGradient} ${value.color}`} />
                <h3 className={aboutUsStyles.valueCardTitle} title={value.title}>{value.title}</h3>
                <p className={aboutUsStyles.valueCardDescription}>{value.description}</p>
                <ul className={aboutUsStyles.valueFeatures}>
                  {value.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={aboutUsStyles.valueFeatureItem}>
                      <div className={`${aboutUsStyles.valueFeatureDot} ${value.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className={`${aboutUsStyles.valueUnderline} ${value.color}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={aboutUsStyles.ctaSection}>
        <div className={aboutUsStyles.ctaOrb1} />
        <div className={aboutUsStyles.ctaOrb2} />
        <div className={aboutUsStyles.ctaContent}>
          <h2 className={aboutUsStyles.ctaTitle}>Ready to Transform Your Future</h2>
          <p className={aboutUsStyles.ctaDescription}>
            Join millions of learners who have transformed their lives with Academia. Start your journey today with a 7-day free trial.
          </p>

          <div className={aboutUsStyles.ctaButtons}>
            <a href="/contact" className={aboutUsStyles.ctaButton} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircleCode className={aboutUsStyles.ctaButtonIcon} /> 
              <span>Talk to Advisor</span>
            </a>
          </div>
        </div>
      </section>

      <style jsx>{aboutUsAnimations}</style>
    </div>
  );
};

export default AboutPage;