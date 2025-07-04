import React, { useEffect, useRef, useState } from 'react';

// Updated team data
const team = [
  {
    name: "Haris Jamal",
    role: "Full Stack Developer",
    description:
      "Built the frontend and backend for an AI-powered legal assistant tailored to Pakistan's needs.",
    contact: "21pwbcs0874@uetpeshawar.edu.pk",
    image: "https://avatars.githubusercontent.com/u/000000?v=4", // Replace with real image
    direction: "left",
  },
  {
    name: "Ahsen Khalil",
    role: "AI Specialist",
    description:
      "Developed and trained the AI chatbot using local legal data for smart assistance.",
    contact: "21pwbcs0885@uetpeshawar.edu.pk",
    image: "https://avatars.githubusercontent.com/u/000000?v=4", // Replace with real image
    direction: "right",
  },
  {
    name: "Dr. XYZ Supervisor", // Replace with real name
    role: "Project Supervisor",
    description:
      "Guided the development process and ensured the project's alignment with legal and academic standards.",
    contact: "supervisor@uetpeshawar.edu.pk", // Replace with real email
    image: "https://avatars.githubusercontent.com/u/000000?v=4", // Replace with real image
    direction: "left",
  },
  {
    name: "Dr. XYZ Coordinator", // Replace with real name
    role: "FYP Coordinator",
    description:
      "Guided the development process and ensured the project's alignment with legal and academic standards.",
    contact: "coordinator@uetpeshawar.edu.pk", // Replace with real email
    image: "https://avatars.githubusercontent.com/u/000000?v=4", // Replace with real image
    direction: "right",
  }
];

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

export default function DeveloperCards() {
  return (
    <section className="py-20 bg-green-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {team.map((member, index) => {
            const [ref, inView] = useScrollAnimation();
            const slideClass =
              member.direction === "left"
                ? "translate-x-[-100px]"
                : "translate-x-[100px]";
            return (
              <div
                key={index}
                ref={ref}
                className={`bg-white rounded-2xl shadow-xl p-6 transition-all duration-700 ease-out opacity-0 transform ${
                  inView ? "opacity-100 translate-x-0" : slideClass
                }`}
              >
                <div className="flex items-start space-x-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-md font-medium text-gray-600 mb-2">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {member.description}
                    </p>
                    <a
                      href={`mailto:${member.contact}`}
                      className="text-sm text-blue-600 underline"
                    >
                      {member.contact}
                    </a>
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
