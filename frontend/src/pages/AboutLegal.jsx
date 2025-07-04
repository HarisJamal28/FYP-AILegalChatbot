import React from 'react';
import AboutHeader from '../components/Header/AboutHeader.jsx';
import AboutCards from '../components/Cards/AboutCards.jsx';

export default function About() {
  return (
    <div className="font-inria">
      {/* Responsive header with image and typing effect */}
      <AboutHeader />

      {/* Main About Text Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 text-gray-800 animate-fadeIn">
        <div className="space-y-12">
          {/* Who We Are */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 relative inline-block header-underline">
              Who We Are
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mt-4">
              We are a team of developers, legal experts, and AI enthusiasts committed to making legal help more accessible to everyone in Pakistan. Our AI chatbot is trained on Pakistani law to help people navigate legal challenges with clarity and confidence.
            </p>
          </div>

          {/* Our Vision */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 relative inline-block header-underline">
              Our Vision
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mt-4">
              To democratize access to justice by blending cutting-edge AI technology with deep knowledge of local legal systems.
            </p>
          </div>

          {/* Why It Matters */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 relative inline-block header-underline">
              Why It Matters
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mt-4">
              Legal support can be expensive, confusing, and inaccessible to many. We aim to bridge that gap by offering an AI-driven solution that is fast, user-friendly, and tailored to Pakistan’s legal landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <AboutCards />
    </div>
  );
}
