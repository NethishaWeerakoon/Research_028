// PersonalityDetails.jsx
import React from 'react';

const personalityDetails = {
  ISTJ: {
    description: "Responsible, organized, and dependable. ISTJs value tradition and loyalty.",
    pros: ["Detail-oriented", "Reliable", "Hardworking"],
    cons: ["Sometimes inflexible", "Can be overly serious", "Resistant to change"],
    careers: ["Accountant", "Auditor", "Lawyer", "Police Officer"],
    communication: "Direct and factual; prefers clear instructions.",
    environment: "Thrives in structured, stable, and predictable environments.",
    growthTips: [
      "Practice flexibility and openness to new ideas.",
      "Balance seriousness with occasional relaxation.",
    ],
  },
  ISFJ: {
    description: "Warm, nurturing, and conscientious. ISFJs are dedicated to helping others and maintaining harmony.",
    pros: ["Supportive", "Patient", "Practical"],
    cons: ["Can be overly selfless", "Avoids confrontation", "Sensitive to criticism"],
    careers: ["Nurse", "Teacher", "Social Worker", "Administrator"],
    communication: "Kind and considerate; prefers harmony in conversations.",
    environment: "Works best in cooperative, people-focused settings.",
    growthTips: [
      "Learn to set healthy boundaries.",
      "Address conflicts early rather than avoiding them.",
    ],
  },
  INFJ: {
    description: "Insightful and inspiring, INFJs have a strong sense of integrity and drive to help others.",
    pros: ["Empathetic", "Organized", "Creative"],
    cons: ["Private", "Perfectionistic", "Sensitive"],
    careers: ["Psychologist", "Writer", "Counselor", "Advisor"],
    communication: "Thoughtful and deep; values meaningful conversations.",
    environment: "Prefers quiet, reflective, and purposeful workspaces.",
    growthTips: [
      "Practice sharing feelings with trusted people.",
      "Avoid self-criticism and perfectionism traps.",
    ],
  },
  INTJ: {
    description: "Strategic and logical, INTJs are independent thinkers who love solving complex problems.",
    pros: ["Analytical", "Confident", "Determined"],
    cons: ["Sometimes arrogant", "Insensitive", "Overly critical"],
    careers: ["Scientist", "Engineer", "Strategic Planner", "Developer"],
    communication: "Concise and logical; values efficiency in discussions.",
    environment: "Thrives in innovative, challenging, and autonomous settings.",
    growthTips: [
      "Be mindful of others' feelings and perspectives.",
      "Practice patience with less analytical people.",
    ],
  },
  ISTP: {
    description: "Practical and observant, ISTPs enjoy hands-on activities and solving problems in the moment.",
    pros: ["Adaptable", "Calm under pressure", "Independent"],
    cons: ["Private", "Easily bored", "Risk-taking"],
    careers: ["Mechanic", "Engineer", "Surgeon", "Pilot"],
    communication: "Brief and to the point; prefers action over talk.",
    environment: "Excels in flexible, hands-on, and fast-paced work.",
    growthTips: [
      "Work on emotional expression and openness.",
      "Think through long-term consequences of actions.",
    ],
  },
  ISFP: {
    description: "Gentle and sensitive, ISFPs appreciate beauty and live in the moment.",
    pros: ["Kind", "Creative", "Loyal"],
    cons: ["Reserved", "Avoids conflict", "Easily stressed"],
    careers: ["Artist", "Musician", "Designer", "Veterinarian"],
    communication: "Soft-spoken and thoughtful; prefers one-on-one talks.",
    environment: "Flourishes in relaxed, aesthetically pleasing spaces.",
    growthTips: [
      "Speak up when boundaries are crossed.",
      "Learn to handle constructive criticism.",
    ],
  },
  INFP: {
    description: "Idealistic and empathetic, INFPs seek meaning and value deep connections.",
    pros: ["Passionate", "Open-minded", "Creative"],
    cons: ["Overly idealistic", "Avoids conflict", "Sensitive"],
    careers: ["Writer", "Therapist", "Humanitarian", "Artist"],
    communication: "Heartfelt and idealistic; values authenticity.",
    environment: "Prefers quiet, creative, and meaningful environments.",
    growthTips: [
      "Set realistic expectations for yourself and others.",
      "Address uncomfortable situations directly when needed.",
    ],
  },
  INTP: {
    description: "Curious and analytical, INTPs love exploring ideas and theories.",
    pros: ["Innovative", "Logical", "Open-minded"],
    cons: ["Absent-minded", "Insensitive", "Indecisive"],
    careers: ["Philosopher", "Software Developer", "Scientist", "Architect"],
    communication: "Abstract and theoretical; enjoys debates and ideas.",
    environment: "Best in unstructured, idea-rich, and research-based settings.",
    growthTips: [
      "Be aware of emotional cues in others.",
      "Work on making timely decisions.",
    ],
  },
  ESTP: {
    description: "Energetic and perceptive, ESTPs love action and new experiences.",
    pros: ["Outgoing", "Resourceful", "Practical"],
    cons: ["Impulsive", "Insensitive", "Easily bored"],
    careers: ["Entrepreneur", "Paramedic", "Sales Executive", "Athlete"],
    communication: "Bold and spontaneous; enjoys fast-paced interactions.",
    environment: "Thrives in dynamic, hands-on, and high-stakes settings.",
    growthTips: [
      "Consider the long-term effects of quick decisions.",
      "Work on listening before acting.",
    ],
  },
  ESFP: {
    description: "Playful and enthusiastic, ESFPs enjoy life and love being the center of attention.",
    pros: ["Friendly", "Spontaneous", "Practical"],
    cons: ["Easily distracted", "Avoids planning", "Sensitive"],
    careers: ["Performer", "Event Planner", "Sales Rep", "Hospitality Manager"],
    communication: "Lively and expressive; uses stories and humor.",
    environment: "Flourishes in sociable, fun, and interactive settings.",
    growthTips: [
      "Create a routine to manage responsibilities.",
      "Handle emotional feedback with maturity.",
    ],
  },
  ENFP: {
    description: "Enthusiastic and imaginative, ENFPs are free spirits who inspire others.",
    pros: ["Energetic", "Creative", "Empathetic"],
    cons: ["Easily stressed", "Overthinker", "Disorganized"],
    careers: ["Public Relations", "Coach", "Marketer", "Creative Director"],
    communication: "Energetic and idea-rich; thrives on inspiration.",
    environment: "Best in flexible, people-centered, and expressive spaces.",
    growthTips: [
      "Stick with tasks through completion.",
      "Simplify thoughts to avoid overwhelm.",
    ],
  },
  ENTP: {
    description: "Inventive and curious, ENTPs love debating and exploring new ideas.",
    pros: ["Innovative", "Energetic", "Quick thinker"],
    cons: ["Argumentative", "Insensitive", "Easily bored"],
    careers: ["Entrepreneur", "Lawyer", "Inventor", "Consultant"],
    communication: "Witty and engaging; enjoys challenge and banter.",
    environment: "Ideal in fast-paced, change-driven, and idea-focused spaces.",
    growthTips: [
      "Practice follow-through on projects.",
      "Respect differing viewpoints in discussions.",
    ],
  },
  ESTJ: {
    description: "Organized and decisive, ESTJs are natural leaders who value tradition and order.",
    pros: ["Efficient", "Practical", "Strong-willed"],
    cons: ["Stubborn", "Insensitive", "Uncomfortable with change"],
    careers: ["Manager", "Military Officer", "Judge", "Banker"],
    communication: "Clear and authoritative; values structure and facts.",
    environment: "Thrives in structured, results-driven, and hierarchical systems.",
    growthTips: [
      "Be open to alternate methods and ideas.",
      "Nurture personal relationships with empathy.",
    ],
  },
  ESFJ: {
    description: "Warm and caring, ESFJs enjoy helping others and maintaining harmony.",
    pros: ["Supportive", "Organized", "Loyal"],
    cons: ["Overly sensitive", "Avoids conflict", "Needy"],
    careers: ["Nurse", "Teacher", "Office Manager", "Customer Service"],
    communication: "Friendly and accommodating; values social connection.",
    environment: "Ideal in cooperative, people-centric, and orderly environments.",
    growthTips: [
      "Learn to manage criticism constructively.",
      "Focus on personal goals, not just helping others.",
    ],
  },
  ENFJ: {
    description: "Charismatic and inspiring, ENFJs are natural motivators and empathetic leaders.",
    pros: ["Empathetic", "Organized", "Supportive"],
    cons: ["Overcommitted", "Sensitive to criticism", "People-pleaser"],
    careers: ["Teacher", "Coach", "HR Manager", "Diplomat"],
    communication: "Empowering and persuasive; uses emotional intelligence.",
    environment: "Flourishes in collaborative, structured, and goal-driven places.",
    growthTips: [
      "Set personal boundaries to avoid burnout.",
      "Allow others to solve their own problems sometimes.",
    ],
  },
  ENTJ: {
    description: "Confident and strategic, ENTJs excel at leadership and long-term planning.",
    pros: ["Decisive", "Efficient", "Strategic"],
    cons: ["Can be stubborn", "Impatient", "Sometimes intimidating"],
    careers: ["Executive", "Lawyer", "Consultant", "Project Manager"],
    communication: "Direct and commanding; thrives on vision and logic.",
    environment: "Best in competitive, high-achieving, and organized fields.",
    growthTips: [
      "Show appreciation and emotional support to team members.",
      "Practice patience and listen actively.",
    ],
  },
};

const PersonalityDetails = ({ personalityType }) => {
  if (!personalityType || !personalityDetails[personalityType]) return null;

  const {
    description,
    pros,
    cons,
    careers,
    communication,
    environment,
    growthTips,
  } = personalityDetails[personalityType];

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6 border border-gray-300 transition-transform transform hover:scale-[1.02] grid grid-cols-2 gap-6">
      {/* Header */}
      <div className="col-span-2">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-4">
          Personality Type: {personalityType}
        </h2>
      </div>

      {/* Description */}
      <div className="col-span-2">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
        <p className="text-gray-700 leading-relaxed text-sm">{description}</p>
      </div>
      {/* Pros */}
      <div>
        <h3 className="text-lg font-semibold text-green-600 mb-2">Pros</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {pros.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Cons</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {cons.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Careers */}
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-2">Ideal Careers</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {careers.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Communication */}
      <div>
        <h3 className="text-lg font-semibold text-purple-600 mb-2">Communication Style</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{communication}</p>
      </div>

      {/* Environment */}
      <div>
        <h3 className="text-lg font-semibold text-yellow-600 mb-2">Preferred Work Environment</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{environment}</p>
      </div>

      {/* Growth Tips */}
      <div>
        <h3 className="text-lg font-semibold text-pink-600 mb-2">Personal Growth Tips</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {growthTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PersonalityDetails;


