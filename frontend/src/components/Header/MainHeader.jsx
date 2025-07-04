import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MainHeader() {
  const phrases = [
    "Fast, accurate, and reliable legal advice powered by AI technology",
    "Get legal guidance tailored to Pakistan's constitution",
    "Your AI-powered companion for everyday legal queries",
    "Quick legal help—no appointments, just answers",
    "Accessible justice for all, powered by smart tech"
  ];

  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      const updatedText = isDeleting
        ? currentPhrase.substring(0, charIndex - 1)
        : currentPhrase.substring(0, charIndex + 1);

      setText(updatedText);
      setCharIndex(isDeleting ? charIndex - 1 : charIndex + 1);

      if (!isDeleting && updatedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1500);
      }

      if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setCharIndex(0);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <header className="relative h-[24rem] sm:h-[28rem] md:h-[36rem] w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=1411&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Text Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
        <div className="text-white w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Inria Sans'", lineHeight: '1.2' }}
          >
            Empowering Justice with AI:{" "}
            <span className="block sm:inline">Your Legal Guide for Pakistan</span>
          </h1>

          {/* Typing Text Animation */}
          <p className="text-base sm:text-lg md:text-xl mb-6 min-h-[2.5rem]">
            {text}
            <span className="border-r-2 border-white animate-pulse ml-1" />
          </p>

          <div className="flex justify-center sm:justify-center">
            <Link
              to="/login"
              className="inline-block text-sm sm:text-base bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300 hover:bg-green-900"
            >
              Try AI Legal Chatbot
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
