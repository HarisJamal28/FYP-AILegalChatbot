import React, { useEffect, useState } from "react";

const slides = [
  {
    background:
      "https://images.pexels.com/photos/8369518/pexels-photo-8369518.jpeg",
    useCases: [
      "Family Law Assistance",
      "Criminal Law Queries",
      "Constitutional Rights Guidance",
      "Employment & Labor Advice",
      "Property & Inheritance Help",
    ],
    text: `Our AI-based system helps individuals across various domains of Pakistani law. Whether you're dealing with personal issues or professional concerns, we guide you clearly and quickly.`,
  },
  {
    background:
      "https://www.irishexaminer.com/cms_media/module_img/8811/4405904_7_articlelarge_iStock-1472917612_1_.jpg",
    useCases: [
      "Cybercrime Support",
      "Harassment & Abuse Help",
      "Digital Rights Queries",
      "Online Fraud Guidance",
      "Internet Privacy Concerns",
    ],
    text: `Stay protected in the digital world. Our AI helps you understand cyber laws, digital rights, and your options in case of online threats or abuse.`,
  },
  {
    background:
      "https://community.thriveglobal.com/wp-content/uploads/2019/01/Lawyer.jpeg",
    useCases: [
      "Tax & Financial Regulations",
      "Startup Legal Support",
      "Business Registration",
      "Contract & Agreement Advice",
      "Banking Law Clarification",
    ],
    text: `Running a business in Pakistan? Get quick legal guidance on taxes, company registration, contracts, and much more—all in one place.`,
  },
];

export default function UseCasesSection() {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevious(current);
      setCurrent((prev) => (prev + 1) % slides.length);
      setAnimating(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [current]);

  useEffect(() => {
    if (animating) {
      const timeout = setTimeout(() => setAnimating(false), 900);
      return () => clearTimeout(timeout);
    }
  }, [animating]);

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 md:px-8 overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-100"
          style={{ backgroundImage: `url(${slides[previous].background})` }}
        ></div>

        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            animating ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${slides[current].background})` }}
        ></div>
      </div>

      {/* Content Box */}
      <div
        className={`relative z-10 bg-white bg-opacity-90 backdrop-blur-md max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-10 rounded-lg shadow-xl transform transition-all duration-700 ease-in-out ${
          animating
            ? "translate-x-[-50px] opacity-0"
            : "translate-x-0 opacity-100"
        }`}
        style={{ fontFamily: "'Inria Sans'" }}
      >
        {/* Use Case Cards */}
        <div className="flex flex-col items-center md:items-start">
          <ul className="w-full flex flex-col items-center md:items-start gap-4">
            {slides[current].useCases.map((useCase, idx) => (
              <li
                key={idx}
                className="bg-green-600 text-white px-5 sm:px-6 py-3 w-full sm:w-4/5 text-center md:text-left rounded text-sm sm:text-base"
              >
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        {/* Description Text */}
        <div className="flex items-center justify-center">
          <p className="text-gray-700 text-center md:text-left px-2 sm:px-6 text-sm sm:text-base md:text-lg leading-relaxed">
            {slides[current].text}
          </p>
        </div>
      </div>

      {/* Slide Dots */}
      <div className="relative z-10 flex justify-center mt-8 gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (current !== idx) {
                setPrevious(current);
                setCurrent(idx);
                setAnimating(true);
              }
            }}
            className={`h-3 w-3 rounded-full transition duration-300 ${
              idx === current
                ? "bg-green-700"
                : "bg-white border border-green-700"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
