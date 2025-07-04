import React, { useState, useEffect } from "react";

const typingSpeed = 100;
const pauseDuration = 2000;
const imageChangeInterval = 3000;

export default function AboutHeader() {
  const phrases = [
    "Dedicated to providing accessible, precise legal guidance tailored to Pakistan's unique laws and society.",
    "Your trusted AI-powered partner in navigating legal complexities.",
    "Empowering every Pakistani with clear, reliable legal support.",
    "Innovating justice with cutting-edge AI technology.",
    "Fast, accurate legal advice — anytime, anywhere.",
  ];

  const images = [
    "https://ajkhighcourt.gok.pk//userside-assets/images/sup-pak.jpg",
    "https://play-lh.googleusercontent.com/fClBz9vsrtrjG0uT1CMUU4yI8xNMmXD-DFweXWpURR4Yvh-iRL28sw0WQe4ye8x5k4Y",
    "https://i.dawn.com/primary/2016/12/5856c3f8258f7.jpg",
    "https://courtingthelaw.com/wp-content/uploads/hd-attorney-law-firm-wallpaper-Advocateslawyers.com_-640x360.jpg",
  ];

  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(null);
  const [fade, setFade] = useState(true);

  // Typing effect
  useEffect(() => {
    let timeout;

    if (!deleting && charIndex <= phrases[phraseIndex].length) {
      timeout = setTimeout(() => {
        setDisplayText(phrases[phraseIndex].substring(0, charIndex));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (deleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setDisplayText(phrases[phraseIndex].substring(0, charIndex));
        setCharIndex((prev) => prev - 1);
      }, typingSpeed / 2);
    } else if (charIndex > phrases[phraseIndex].length) {
      timeout = setTimeout(() => setDeleting(true), pauseDuration);
    } else if (charIndex < 0) {
      setDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      setCharIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex, phrases]);

  // Image fade rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImageIndex(currentImageIndex);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setFade(false);

      setTimeout(() => {
        setFade(true);
      }, 1000);
    }, imageChangeInterval);

    return () => clearInterval(interval);
  }, [currentImageIndex, images.length]);

  return (
    <header className="relative h-[24rem] sm:h-[28rem] md:h-[36rem] w-full overflow-hidden">
      {/* Previous image */}
      <div
        className={`absolute inset-0 bg-fixed bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
          fade ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage:
            prevImageIndex !== null ? `url('${images[prevImageIndex]}')` : "none",
        }}
      ></div>

      {/* Current image */}
      <div
        className={`absolute inset-0 bg-fixed bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url('${images[currentImageIndex]}')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Text Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6">
        <div className="text-white max-w-3xl text-center">
          <h1
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight sm:leading-snug md:leading-[3.5rem]"
            style={{ fontFamily: "'Inria Sans'" }}
          >
            Justice Meets AI Innovation: Reliable Legal Help for Pakistan
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl min-h-[3rem] font-inria"
            style={{ fontFamily: "'Inria Sans'" }}
          >
            {displayText}
            <span className="blinking-cursor">|</span>
          </p>
        </div>
      </div>

      {/* Cursor animation */}
      <style jsx>{`
        .blinking-cursor {
          font-weight: 100;
          font-size: 24px;
          color: white;
          animation: blink 1s infinite;
          margin-left: 2px;
        }
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
}
