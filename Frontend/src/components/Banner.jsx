import React from "react";
import bannerImage from "../assets/banner.png";

const Banner = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm font-medium text-blue-800 mb-3">
            New Features Available
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight mb-4">
            Build Amazing <br />
            Digital Products
          </h1>

          <p className="text-gray-600 text-base max-w-md mb-6">
            Create beautiful, responsive web applications with our powerful tools.
          </p>

          <ul className="space-y-2 text-gray-700 mb-8">
            <li>✔ Fast Performance</li>
            <li>✔ Responsive Design</li>
            <li>✔ Easy to Use</li>
            <li>✔ Free Updates </li>
          </ul>

          <button
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

        {/* RIGHT IMAGE */}
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
