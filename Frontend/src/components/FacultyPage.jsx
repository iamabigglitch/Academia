import React from 'react';
import {facultyStyles} from "../assets/dummyStyles";
import {Instagram, Linkedin, Mail, Star} from "lucide-react";
// import teacher4 from "../assets/teacher4.png"

// Faculty data
const sampleTeachers = [
  {
    id: 1,
    name: "Dr. Kasha Kc",
    qualification: "Ph.D. in Artificial Intelligence",
    bio: "Specialized in Machine Learning and Deep Neural Networks",
    // image: teacher4,
    experience: "12+ years",
    linkedin: "https://www.linkedin.com/in/kasha-kc/",
    instagram: "https://www.instagram.com/kashakc/",
    email: "kasha.kc@example.com",
    initialRating: 2.8,
  },
  {
    id: 2,
    name: "Mr. Shashank Shrestha",
    qualification: "M.Tech in Computer Science",
    bio: "Frontend Architect with expertise in React and Vue",
    experience: "8+ years",
    linkedin: "https://www.linkedin.com/in/shashank-shrestha/",
    instagram: "https://www.instagram.com/shashanks.frontend/",
    email: "shashank.shrestha@example.com",
    initialRating: 1.5,
  },
  {
    id: 3,
    name: "Mrs. Yukta Verma",
    qualification: "M.S. in Cloud Computing",
    bio: "DevOps Engineer and Cloud Infrastructure Specialist",
    experience: "10+ years",
    linkedin: "https://www.linkedin.com/in/yukta-verma-cloud/",
    instagram: "https://www.instagram.com/yukta.cloud/",
    email: "yukta.verma@example.com",
    initialRating: 3.6,
  },
  {
    id: 4,
    name: "Mr. Kartik Shakya",
    qualification: "Ph.D. in Data Science",
    bio: "Data Scientist and Machine Learning Researcher",
    experience: "9+ years",
    linkedin: "https://www.linkedin.com/in/kartik-shakya-ds/",
    instagram: "https://www.instagram.com/kartiks.datascience/",
    email: "kartik.shakya@example.com",
    initialRating: 3.9,
  },
];

const MotionWrapper = {
    div: ({children, className}) => (
        <div className={className}>{children}</div>
    ),
};

const FacultyPage = () => {
    return (
        <div className={facultyStyles.container}>
            <div className={facultyStyles.header}>
                <div className={facultyStyles.headerContent}>
                    <h1 className={facultyStyles.title} style={{ color: '#1c398e' }}>Meet Our Faculty</h1>
                    <div className={facultyStyles.titleDivider}></div>
                    <p 
                    className={facultyStyles.subtitle}
                    style={{ color: '#051546' }}>
                        Learn from industry experts and academic pioneers dedicated to your success.
                    </p>
            </div>
        </div>

        {/* faculty grid */}
        <div className={facultyStyles.facultySection}>
            <div className={facultyStyles.facultyContainer}>
                <div className={facultyStyles.facultyGrid}>
                    {sampleTeachers.map((teacher, index) => (
                       
                <MotionWrapper.div
                key={teacher.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={facultyStyles.card}
              >
                <div className={facultyStyles.teacherCard}>
                    <div className={facultyStyles.imageContainer}>
                        <div className={facultyStyles.imageWrapper}>
                            <img
                                src={teacher.image || "https://via.placeholder.com/300"}
                                alt={teacher.name}
                                className={facultyStyles.image}
                            />
                </div>

                <div className={facultyStyles.experienceBadge}>
                    <div className={facultyStyles.experienceBadgeContent}>
                        {teacher.experience} Exp
                </div>
                </div>
                </div>

                <div className={facultyStyles.teacherInfo}>
                    <h3
                    className={facultyStyles.teacherName}>
                        {teacher.name}
                    </h3>
                    <p className={facultyStyles.teacherQualification}>
                        {teacher.qualification}
                    </p>
                    <p className={facultyStyles.teacherBio}>
                        {teacher.bio}
                    </p>
                </div>

                <div className={facultyStyles.ratingContainer}>
                    <div className={facultyStyles.starRating}>
                        {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`${facultyStyles.starIcon} ${
                            i < Math.round(teacher.initialRating)
                              ? facultyStyles.starButtonActive
                              : facultyStyles.starButtonInactive
                          }`}
                        />
                      ))}   
                    </div>
                </div>

                <div className={facultyStyles.socialContainer}>
                    <a href={`mailto:${teacher.email}`} 
                    className={`
                        ${facultyStyles.socialIcon}
                        ${facultyStyles.socialIconEmail}`}
                        title={`Email ${teacher.name}`}
                    >

                    <Mail className={facultyStyles.socialIconSvg} />
                 </a>

                 <a 
                 href = {teacher.linkedin} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className={`
                    ${facultyStyles.socialIcon} 
                    ${facultyStyles.socialIconLinkedin}
                    `}
                >
                    <Linkedin className={facultyStyles.socialIconSvg} />
                </a>

                 <a 
                 href = {teacher.instagram} 
                 target="_blank"
                 rel="noopener noreferrer" 
                 className={`
                    ${facultyStyles.socialIcon} 
                    ${facultyStyles.socialIconInstagram}
                    `}
                >
                    <Instagram className={facultyStyles.socialIconSvg} />
                </a>
                </div>
                </div>
              </MotionWrapper.div>
                ))}
                </div>
            </div>
        </div>
        <style jsx>{facultyStyles.animations}</style>
        </div>
    );
}
export default FacultyPage;