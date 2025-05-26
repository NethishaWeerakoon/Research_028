import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import PersonalityDetails from './PersonalityDetails';
import Swal from "sweetalert2";

const questions = [
  "You Often End Up Doing Things At The Last Possible Moment",
  "You Are Prone To Worrying That Things Will Take A Turn For The Worse",
  "Your Happiness Comes More From Helping Others Accomplish Things Than Your Own Accomplishments",
  "You Enjoy Going To Art Museums",
  "You Are Not Too Interested In Discussing Various Interpretations And Analyses Of Creative Works",
  "Your Mood Can Change Very Quickly",
  "You Rarely Worry About Whether You Make A Good Impression On People You Meet",
  "You Find It Easy To Empathize With A Person Whose Experiences Are Very Different From Yours",
  "You Usually Prefer Just Doing What You Feel Like At Any Given Moment Instead Of Planning A Particular Daily Routine",
  "You Feel More Drawn To Places With Busy, Bustling Atmospheres Than Quiet, Intimate Places",
  "You Have Always Been Fascinated By The Question Of What, If Anything, Happens After Death",
  "You Are More Inclined To Follow Your Head Than Your Heart",
  "You Often Make A Backup Plan For A Backup Plan",
  "You Like To Have A To-Do List For Each Day",
  "You Avoid Making Phone Calls",
  "You Like Books And Movies That Make You Come Up With Your Own Interpretation Of The Ending",
  "You Often Have A Hard Time Understanding Other People’s Feelings",
  "You Are Definitely Not An Artistic Type Of Person",
  "You Often Feel Overwhelmed",
  "You Struggle With Deadlines"
];

const colors = {
  "-3": "bg-red-300",
  "-2": "bg-orange-300",
  "-1": "bg-yellow-300",
  "0": "bg-gray-300",
  "1": "bg-sky-300",
  "2": "bg-blue-400",
  "3": "bg-green-400"
};

// Question Component
const Question = ({ question, index, selectedValue, handleChange }) => {
  const options = [
    { value: -3, label: "Strongly Disagree", size: "w-14 h-14 text-sm" },
    { value: -2, label: "Disagree", size: "w-11 h-11 text-xs" },
    { value: -1, label: "Slightly Disagree", size: "w-9 h-9 text-xs" },
    { value: 0, label: "Neutral", size: "w-7 h-7 text-xs" },
    { value: 1, label: "Slightly Agree", size: "w-9 h-9 text-xs" },
    { value: 2, label: "Agree", size: "w-11 h-11 text-xs" },
    { value: 3, label: "Strongly Agree", size: "w-14 h-14 text-sm" }
  ];

  return (
    <motion.div
      className="mb-6 py-10 px-6 rounded-xl shadow-md bg-white"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 80 }}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.label
        className="font-semibold text-2xl block mb-4"
        style={{ fontFamily: 'Arial, sans-serif' }}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.06 }}
      >
        {index + 1}. {question}
      </motion.label>

      <motion.div
        className="flex gap-6 justify-between items-center overflow-x-auto px-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
              delayChildren: index * 0.05,
            },
          },
        }}
      >
        {options.map(({ value, label, size }) => {
          const isSelected = selectedValue === value;
          return (
            <motion.div
              key={value}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-col items-center min-w-[70px]"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange(index, value)}
                className={`rounded-full flex items-center justify-center font-bold shadow transition-all
                  ${isSelected ? 'ring-4 ring-indigo-500 scale-110' : ''}
                  ${isSelected ? 'bg-indigo-600 text-white' : colors[value]} ${size}
                `}
              />
              <span className="text-xs mt-2 text-center">{label}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

// Result Component
const Result = ({ result, error }) => {
  const [hovered, setHovered] = useState(false);
  if (!result && !error) return null;
  const personalityType = result
    ? result.replace('🧠 Predicted Personality Type: ', '').trim()
    : '';
  return (
    <motion.div
      className="mt-8 text-center max-w-xl mx-auto relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {result && (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg space-x-4 cursor-pointer relative"
        >
          <CheckCircleIcon className="h-10 w-10 text-white" />
          <div>
            <h2 className="text-xl font-bold">Your Personality Type:</h2>
            <p className="text-lg mt-1">{personalityType}</p>
          </div>

          {hovered && (
            <div
              className="absolute top-1/2 left-full ml-4 -translate-y-1/2 z-50 p-4 bg-white text-black rounded-lg shadow-lg
             w-[95vw] sm:w-[600px] max-w-2xl"
            >
              <PersonalityDetails personalityType={personalityType} />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-xl shadow-lg space-x-4 mt-4">
          <XCircleIcon className="h-10 w-10 text-white" />
          <div>
            <h2 className="text-xl font-bold">Oops! Something Went Wrong</h2>
            <p className="text-lg mt-1">{error}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};


// Main Quiz Component
const Quiz = () => {
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setResult('');
  setError('');

  if (answers.includes(null)) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete',
      text: '⚠️ Please answer all questions before submitting.',
      confirmButtonColor: '#f59e0b' // Tailwind yellow-500
    });
    return;
  }

  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    Swal.fire({
      icon: 'error',
      title: 'User Not Found',
      text: '❌ User ID not found. Please log in again.',
      confirmButtonColor: '#dc2626' // Tailwind red-600
    });
    return;
  }

  let userId = null;
  try {
    userId = JSON.parse(storedUser)._id;
  } catch {
    Swal.fire({
      icon: 'error',
      title: 'Invalid User Data',
      text: '❌ Invalid user data. Please log in again.',
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:5000/api/users/submit-personality-quiz/${userId}`,
      { answers }
    );
    setResult(`🧠 Predicted Personality Type: ${response.data.predictedPersonality}`);
  } catch (err) {
    console.error('Prediction error:', err);
    Swal.fire({
      icon: 'error',
      title: 'Prediction Failed',
      text: '❌ Failed to predict personality. Please try again later.',
      confirmButtonColor: '#dc2626'
    });
  }
};
  return (
    <div className="min-h-screen flex justify-center items-center py-10 px-4">
      <motion.div>
        <h1 className="text-4xl font-semibold text-blue-700 mb-6 text-center">
          Personality Predictor Quiz
        </h1>
        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-white p-4 mb-4 rounded-lg shadow-md transform transition duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Question
                question={q}
                index={index}
                selectedValue={answers[index]}
                handleChange={handleChange}
              />
            </div>
          ))}
          <div className="text-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-green-400 hover:bg-green-700 text-white px-12 py-3 rounded-lg font-semibold shadow-md transition-all"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              🔍 Predict My Personality
            </motion.button>
          </div>
        </form>
        <Result result={result} error={error} />
      </motion.div>
    </div>
  );
};

export default Quiz;
