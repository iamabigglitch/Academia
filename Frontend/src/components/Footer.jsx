import React from "react";
import { footerStyles, footerBackgroundStyles, contactIconGradients, iconColors, } from "../assets/dummyStyles";
import { supportLinks, contactInfo, socialIcons, quickLinks, } from "../assets/dummyFooter";
import { Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, BookOpen, Users, FileText, HelpCircle, Shield, HandHelping, } from "lucide-react";

const iconMap = { Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, BookOpen, Users, FileText, HelpCircle, Shield, HandHelping, };

const Footer = () => {
  return (
    <footer className={footerStyles.footer}>

      {/* grid overlay */}
      <div className={footerBackgroundStyles.gridOverlay}>
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className={footerStyles.container}>
        <div className={footerStyles.grid}>
          {/* QUICK LINKS */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.cyan}`}>
              <ArrowRight className={footerStyles.sectionIcon} />
              Quick Links
            </h4>

            <ul className={footerStyles.linkedList}>
              {quickLinks.map((link, index) => {
                const Icon = iconMap[link.iconKey] || ArrowRight;

                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`${footerStyles.linkItem} ${iconColors.cyan}`}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <Icon
                        className={`${footerStyles.linkIcon} ${iconColors.cyan}`}
                      />
                      <span className="truncate">{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* SUPPORT LINKS */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.purple}`}>
              <HandHelping className={footerStyles.sectionIcon} />
              Support
            </h4>

            <ul className={footerStyles.linksList}>
              {supportLinks.map((link, index) => {
                const Icon = iconMap[link.iconKey] || HelpCircle;

                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`${footerStyles.linkItem} ${iconColors.purple}`}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <Icon
                        className={`${footerStyles.linkIcon} ${iconColors.purple}`}
                      />
                      <span className="truncate">{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.emerald}`}>
              <Phone className={footerStyles.sectionIcon} />
              Contact Us
            </h4>

            {/* address */}
            <div className={footerStyles.contactSpace}>
              <div className={footerStyles.contactItem}>
                <div
                  className={`${footerStyles.contactIconContainer} ${contactIconGradients.address}`}
                >
                  <MapPin
                    className={`${footerStyles.contactIcon} ${iconColors.cyan}`}
                  />
                </div>

                <div className={footerStyles.contactTextContainer}>
                  <p className={footerStyles.contactTextPrimary}>
                    {contactInfo.addressLine1}
                  </p>
                  <p className={footerStyles.contactTextSecondary}>
                    {contactInfo.city}
                  </p>
                </div>
              </div>
            </div>

            {/* phone */}
            <div className={footerStyles.contactSpace}>
              <div className={footerStyles.contactItem}>
                <div
                  className={`${footerStyles.contactIconContainer} ${contactIconGradients.phone}`}
                >
                  <Phone
                    className={`${footerStyles.contactIcon} ${iconColors.purple}`}
                  />
                </div>

                <div className={footerStyles.contactTextContainer}>
                  <p className={footerStyles.contactTextPrimary}>
                    {contactInfo.phone}
                  </p>
                  <p className={footerStyles.contactTextSecondary}>
                    {contactInfo.phoneHours}
                  </p>
                </div>
              </div>
            </div>

            {/* email */}
            <div className={footerStyles.contactSpace}>
              <div className={footerStyles.contactItem}>
                <div
                  className={`${footerStyles.contactIconContainer} ${contactIconGradients.email}`}
                >
                  <Mail
                    className={`${footerStyles.contactIcon} ${iconColors.emerald600}`}
                  />
                </div>

                <div className={footerStyles.contactTextContainer}>
                  <p className={footerStyles.contactTextPrimary}>
                    {contactInfo.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SOCIAL ICONS */}
        <div className={footerStyles.socialContainer}>
          <div className={footerStyles.socialIconsContainer}>
            {socialIcons.map((social, index) => {
              const IconComponent = iconMap[social.iconKey] || Twitter;

              return (
                <a
                  key={social.name}
                  href={social.url}
                  aria-label={social.name}
                  className={footerStyles.socialIconLink}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div
                    className={`${footerStyles.socialIconContainer} ${social.bgColor}`}
                  >
                    <div className={footerStyles.socialIconInner}>
                      <IconComponent className={footerStyles.socialIcon} />
                    </div>

                    <div className={footerStyles.socialTooltip}>
                      {social.name}
                      <div className={footerStyles.socialTooltipArrow} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
