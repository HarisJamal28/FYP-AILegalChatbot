import React, { useState, useRef, useEffect } from "react";

function useOnScreen(ref, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isIntersecting;
}

const faqs = [
  {
    question: "What legal topics does your AI cover?",
    answer:
      "Our AI provides guidance on family law, criminal law, digital rights, property issues, employment law, and more, all tailored to Pakistan’s legal framework.",
  },
  {
    question: "Is this a replacement for a lawyer?",
    answer:
      "No. Our AI gives general legal direction. For legal representation or advice on complex cases, consulting a certified lawyer is essential.",
  },
  {
    question: "Can I get help with cybercrime or harassment?",
    answer:
      "Absolutely. We provide guidance on digital threats like online harassment, fraud, cyberbullying, and privacy violations under Pakistani cyber laws.",
  },
  {
    question: "Is this service completely free?",
    answer:
      "Yes, all general legal guidance via the AI is free. We may introduce advanced features later that could include premium services.",
  },
  {
    question: "How trustworthy is the information?",
    answer:
      "Our content is based on verified legal sources. However, for legal accuracy in sensitive or complex matters, please consult a legal expert.",
  },
];

const userQuestions = [
  {
    name: "Ayesha Khan",
    email: "ayesha.khan@gmail.com",
    question: "Can your AI help me with tenancy law issues in Karachi?",
    answer:
      "Yes, our AI can provide guidance related to tenancy agreements and landlord-tenant rights specific to Karachi.",
    pfp: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Bilal Ahmed",
    email: "bilal.ahmed@hotmail.com",
    question: "What should I do if I receive an online harassment threat?",
    answer:
      "We recommend documenting the threat, reporting it to local authorities, and our AI can guide you on legal steps under Pakistan’s cybercrime laws.",
    pfp: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Sana Malik",
    email: "sana.malik@yahoo.com",
    question: "Is there any AI advice for family disputes involving inheritance?",
    answer:
      "Our AI can provide general information about inheritance laws in Pakistan, but complex cases should involve a qualified lawyer.",
    pfp: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [openUserIndex, setOpenUserIndex] = useState(null);
  const [visibleFaqs, setVisibleFaqs] = useState([]);

  const toggle = (index, isUserSection = false) => {
    if (isUserSection) {
      setOpenUserIndex(openUserIndex === index ? null : index);
    } else {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  useEffect(() => {
    faqs.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFaqs((prev) => [...prev, index]);
      }, index * 200);
    });
  }, []);

  return (
    <section
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-10"
      style={{ fontFamily: "'Inria Sans', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* FAQ Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Find answers to the most common legal questions our users ask.
          </p>
        </div>

        <div className="space-y-5 mb-20">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`bg-white border border-green-600 rounded-xl shadow-md transition-all duration-700 transform ${
                visibleFaqs.includes(idx)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="group w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
              >
                <span className="text-base sm:text-lg font-medium text-green-800">
                  {faq.question}
                </span>
                <span className="text-green-600 text-xl font-semibold">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>

              <div
                className={`overflow-hidden px-6 transition-all duration-300 ease-in-out ${
                  openIndex === idx ? "max-h-[250px] py-2" : "max-h-0 py-0"
                }`}
              >
                <p className="text-gray-700 text-sm sm:text-base p-2">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* User Questions Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">
            User Questions
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Real questions from users across Pakistan with AI's responses.
          </p>
        </div>

        <div className="space-y-8">
          {userQuestions.map((user, idx) => {
            const ref = useRef();
            const isVisible = useOnScreen(ref, "-100px");

            return (
              <div
                key={idx}
                ref={ref}
                className={`bg-white border border-green-600 rounded-xl shadow-md p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 transition-all duration-700 transform ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src={user.pfp}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-600"
                />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-green-800">
                      {user.name}
                    </h3>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-sm text-green-600 hover:underline"
                    >
                      {user.email}
                    </a>
                  </div>

                  <button
                    onClick={() => toggle(idx, true)}
                    className="w-full text-left text-gray-900 hover:text-green-700 focus:outline-none"
                  >
                    <p className="text-sm sm:text-base font-medium mb-2">
                      {user.question}
                    </p>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openUserIndex === idx
                        ? "max-h-[250px] py-2"
                        : "max-h-0 py-0"
                    }`}
                  >
                    <p className="text-gray-700 text-sm sm:text-base">
                      {user.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
