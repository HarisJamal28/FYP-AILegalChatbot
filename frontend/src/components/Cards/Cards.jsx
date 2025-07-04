import React from 'react';

export default function InfoCards() {
  return (
    <section
      className="bg-white py-12 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "'Inria Sans'" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-green-700 text-white shadow-md p-6 text-center min-h-[220px] md:min-h-[320px] rounded-lg
                        hover:bg-green-800 transition-colors duration-300 group">
          <i className="fas fa-balance-scale text-4xl sm:text-5xl mb-4 transition-transform duration-500 ease-in-out group-hover:rotate-180"></i>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Legal Guidance</h3>
          <p className="text-sm sm:text-base">
            Get clear legal assistance based on Pakistan's laws. Understand your rights confidently with AI-powered help.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-green-600 text-white shadow-lg p-6 text-center min-h-[220px] md:min-h-[320px] rounded-lg
                        hover:bg-green-700 transition-colors duration-300 group">
          <i className="fas fa-robot text-4xl sm:text-5xl mb-4 transition-transform duration-500 ease-in-out group-hover:rotate-180"></i>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">AI Accuracy</h3>
          <p className="text-sm sm:text-base">
            Instant legal answers from AI trained on real-world laws. Fast, reliable, and constantly learning.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-green-700 text-white shadow-md p-6 text-center min-h-[220px] md:min-h-[320px] rounded-lg
                        hover:bg-green-800 transition-colors duration-300 group">
          <i className="fas fa-shield-alt text-4xl sm:text-5xl mb-4 transition-transform duration-500 ease-in-out group-hover:rotate-180"></i>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Data Privacy</h3>
          <p className="text-sm sm:text-base">
            Your data stays safe. We use encryption and secure systems to ensure privacy and trust.
          </p>
        </div>
      </div>
    </section>
  );
}
