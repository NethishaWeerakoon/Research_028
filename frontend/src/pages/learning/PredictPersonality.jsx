import React, { useState } from "react";
import Quiz from "./quiz";
import PersonalityQuiz from "./PersonalityQuiz"; // Text-based prediction

const PredictPersonality = () => {
  const [activeView, setActiveView] = useState("quiz"); // 'quiz' or 'text'

  const toggleView = () => {
    setActiveView((prev) => (prev === "quiz" ? "text" : "quiz"));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">
        Predict Your Personality
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={toggleView}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Switch to {activeView === "quiz" ? "Text-Based Prediction" : "Quiz-Based Prediction"}
        </button>
      </div>

      <div>
        {activeView === "quiz" ? <Quiz /> : <PersonalityQuiz />}
      </div>
    </div>
  );
};

export default PredictPersonality;
