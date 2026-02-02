import React from "react";
import { useNavigate } from "react-router-dom";
import bannerImage from "../assets/banner.png";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div>
          <p className="text-sm font-medium text-blue-800 mb-3">
            Learn Without Limits
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight mb-4">
            Master New Skills <br />
            At Your Own Pace
          </h1>

          <p className="text-gray-600 text-base max-w-md mb-6">
           Access expert-led courses and transform your career with Academia's cutting-edge learning platform.
          </p>

          <ul className="space-y-2 text-gray-700 mb-8">
            <li>✔ 1000+ Expert-Led Courses</li>
            <li>✔ Learn Anytime, Anywhere</li>
            <li>✔ Easy to Use</li>
            <li>✔ Lifetime Access to Content</li>
          </ul>

          <button
            onClick={() => navigate('/login')}
            className="
              px-6 py-3
              bg-blue-900 text-white
              rounded-lg font-medium
              transition-all duration-200
              hover:bg-blue-800
              active:scale-95
            "
          >
            Get Started
          </button>
        </div>

        <div className="flex justify-center">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full max-w-md object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default Banner;