import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-10 px-6" style={{ fontFamily: "'Inria Sans'" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center md:text-left">
        
        {/* About — hidden on small screens */}
        <div className="hidden md:block">
          <h4 className="text-xl font-semibold mb-3">About</h4>
          <p className="text-sm leading-relaxed">
            We offer AI-powered legal guidance rooted in the Constitution and laws of Pakistan.
            Confidential, fast, and reliable assistance at your fingertips.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Contact</h4>
          <p className="text-sm mb-1">Email: support@legalaipk.com</p>
          <p className="text-sm mb-1">Phone: +92 311 5793730</p>
          <p className="text-sm">Peshawar, Pakistan</p>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-green-200 border-t border-green-500 pt-4">
        &copy; {new Date().getFullYear()} LegalAI Pakistan. All rights reserved.
      </div>
    </footer>
  );
}
