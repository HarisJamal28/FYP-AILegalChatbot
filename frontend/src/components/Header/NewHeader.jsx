import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NewHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <nav
        className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between"
        style={{ fontFamily: "'Inria Sans'" }}
      >
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">
          <Link to="/home"></Link>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex text-gray-600 font-medium gap-8">
          <li>
            <Link to="/home" className="hover:text-green-600 hover:border-b-2 hover:border-green-600">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-green-600 hover:border-b-2 hover:border-green-600">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-green-600 hover:border-b-2 hover:border-green-600">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-green-600 hover:border-b-2 hover:border-green-600">
              FAQ's
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-green-600 flex items-center space-x-1">
              <i className="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-green-600 flex items-center space-x-1">
              <i className="fas fa-user-plus"></i>
              <span>Register</span>
            </Link>
          </li>
        </ul>

        {/* Hamburger Button (Mobile Only) */}
        <div className="md:hidden">
          <button
            className="text-gray-600 hover:text-green-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col text-gray-700 font-medium space-y-4">
            <li>
              <Link to="/home" onClick={toggleMenu} className="hover:text-green-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu} className="hover:text-green-600">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenu} className="hover:text-green-600">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" onClick={toggleMenu} className="hover:text-green-600">
                FAQ's
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleMenu} className="hover:text-green-600 flex items-center space-x-1">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={toggleMenu} className="hover:text-green-600 flex items-center space-x-1">
                <i className="fas fa-user-plus"></i>
                <span>Register</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
