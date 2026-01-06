import React, { useEffect, useState } from 'react'
import { aboutUsStyles, aboutUsAnimations } from '../assets/dummyStyles'
import { counterTargets, statsMeta, missionVisionValues, values } from '../assets/dummyAbout'
import AboutBanner from '../assets/AboutBannerImage.png'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { BadgeCheck, Star, ShieldUser, MessageCircleCode } from 'lucide-react'

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
            className={aboutUsStyles.heroImageContainer}
            style={{ backgroundImage: `url(${AboutBanner})`, opacity: 0.85 }}
          />
          <div
            className={aboutUsStyles.heroVignette}
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.72) 100%)",
            }}
          />
          <div className={aboutUsStyles.heroTint} />
          <div className={aboutUsStyles.heroContent}>
            <div className={aboutUsStyles.trustBadge}>
              <Star className={aboutUsStyles.trustIcon} /> Trusted by 50,000+ students worldwide
            </div>
            <h1 className={aboutUsStyles.mainHeading}>About LearnHub</h1>
            <p className={aboutUsStyles.subHeading}>
              Empowering millions to archieve dreams through{" "}
              <span className={aboutUsStyles.inlineHighlight}>accessible education</span>
            </p>

            <div className={aboutUsStyles.statsGrid}>
              {statsMeta.slice(0, 4).map((stat, index) => (
                <div key={index} className={aboutUsStyles.statCard} style={{ minWidth: 120 }}>
                  <div className={aboutUsStyles.statNumber}>{formatStatNumber(stat.key)}</div>
                  <div className={aboutUsStyles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values Sections */}
      {missionVisionValues.map((section, index) => {
        const Icon = section.icon;
        return (
          <section
            key={section.type}
            className={`${aboutUsStyles.sectionContainer} ${section.bgColor} ${index % 2 === 1 ? "bg-white" : ""}`}
          >
            <div className={aboutUsStyles.sectionGrid}>
              <div
                className={`${aboutUsStyles.sectionContentGrid} ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
                <div className={aboutUsStyles.sectionImage}>
                  <DotLottieReact src={section.dotLottie} loop autoplay />
                </div>
              </div>

              <div
                className={`${aboutUsStyles.sectionContent} ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}
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
            </div>
          </section>
        );
      })}

      {/* Values Section */}
      <section className={aboutUsStyles.valuesSection}>
        <div className={aboutUsStyles.sectionGrid}>
          <div className={aboutUsStyles.valuesHeader}>
            <div className={aboutUsStyles.valuesBadge}>
              <ShieldUser className={aboutUsStyles.valuesBadgeIcon} />
              <span className={aboutUsStyles.valuesBadgeText}>Our Guiding Principles</span>
            </div>
            <h2 className={aboutUsStyles.valuesTitle}>Core Values That Define Us</h2>
            <p className={aboutUsStyles.valuesSubtitle}>The foundation of everything we do at LearnHub</p>
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
            Join millions of learners who have transform their lives with LearnHub. Start your Journey today with a 7-day free trial.
          </p>
          <a href="/contact" className={aboutUsStyles.ctaButton}>
            <MessageCircleCode className={aboutUsStyles.ctaButtonIcon} /> Talk to Advisor
          </a>
        </div>
      </section>

      <style jsx>{aboutUsAnimations}</style>
    </div>
  );
};

export default AboutPage;

// testing git changes ahahahahahaha
