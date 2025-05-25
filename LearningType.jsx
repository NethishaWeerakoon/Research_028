import { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaArrowRight, FaExclamationCircle } from "react-icons/fa";

const LearningType = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isReviewPage, setIsReviewPage] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 
  const questions = [
    {
      id: 1,
      text: "When learning a new concept, how quickly do you grasp it?",
      options: [
        "I need more time and practice to fully understand",
        "After some repetition and explanation",
        "Instantly, by quickly understanding the key idea",
      ],
    },
    {
      id: 2,
      text: "How long does it take for you to memorize a list of items?",
      options: [
        "I need several attempts over time",
        "I need a few repetitions.",
        "I remember them after a quick review.",
      ],
    },
    {
      id: 3,
      text: "When watching an instructional video, how do you process the information?",
      options: [
        "I need to pause frequently and take notes.",
        "I may need to replay certain parts.",
        "I understand immediately and can apply it.",
      ],
    },
    {
      id: 4,
      text: "How do you usually feel when introduced to a new topic?",
      options: [
        "Overwhelmed, I need to break it into small parts.",
        "Curious, but I take my time to understand",
        "Excited, I grasp concepts quickly.",
      ],
    },
    {
      id: 5,
      text: "How do you approach a new skill (e.g., playing an instrument, coding, etc.)?",
      options: [
        "I require step-by-step instructions and repetition.",
        "I need structured practice and guidance.",
        "I pick up the basics quickly.",
      ],
    },
    {
      id: 6,
      text: "If you hear a new word, how quickly do you remember it?",
      options: [
        "I forget it easily and need frequent reminders.",
        "I recall it after hearing it a few times.",
        "I remember it immediately.",
      ],
    },
    {
      id: 7,
      text: "When reading a book, how fast do you absorb information?",
      options: [
        "I take a long time and may struggle with complex ideas.",
        "I need to reread parts for better understanding.",
        "I read and understand quickly.",
      ],
    },
    {
      id: 8,
      text: "How do you react when faced with a difficult problem?",
      options: [
        "I take time to understand the problem before attempting a solution.",
        "I analyze it and work through it steadily.",
        "I solve it quickly by applying logical reasoning.",
      ],
    },
    {
      id: 9,
      text: "When learning math formulas or equations, how fast do you understand them?",
      options: [
        "I struggle and require step-by-step explanations",
        "I need examples and practice problems.",
        "I quickly recognize patterns and rules.",
      ],
    },
    {
      id: 10,
      text: "When given a task with a deadline, how do you handle it?",
      options: [
        "I need extra time and tend to work slowly.",
        "I work steadily and finish on time.",
        "I finish quickly with high accuracy.",
      ],
    },
  ];

  // Update the answers state when an option is selected
  const handleOptionChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    setError(""); // Clear error when an answer is selected
  };

  // Calculate the learning type based on the user's answers
  const calculateLearningType = async () => {
    const totalScore = Object.values(answers).reduce(
      (acc, curr) => acc + curr,
      0
    );
    let learningType = "";

    if (totalScore >= 10 && totalScore <= 15) {
      learningType = "Slow Type Learner";
    } else if (totalScore >= 15 && totalScore <= 24) {
      learningType = "Medium Type Learner";
    } else if (totalScore >= 25 && totalScore <= 30) {
      learningType = "Speed Type Learner";
    }

    const percentageScore = Number(((totalScore / 30) * 100).toFixed(2));
    setResult({ type: learningType, points: percentageScore });

    
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !user._id || !token) {
      console.error("User not logged in or invalid data.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}learn/learning-type`,
        {
          userId: user._id,
          learningType,
          learningTypePoints: percentageScore,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Learning type saved successfully.");
    } catch (error) {
      console.error("Error saving learning type:", error);
    }
  };

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(answers).length === questions.length) {
      setIsReviewPage(true); // Show the review page
    } else {
      setError("Please answer all questions before submitting.");
    }
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (!answers[questions[currentQuestion].id]) {
      setError("Please select an answer to proceed.");
      return;
    }
    setError("");
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Handle moving to the previous question
  const handlePreviousQuestion = () => {
    setError("");
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle closing the popup and navigating based on learning type
  const handleDialogClose = () => {
    setIsPopupOpen(false);
    navigate("/topic-select");
  };

  // Handle proceeding to the congratulations popup after review
  const handleProceedToPopup = () => {
    calculateLearningType();
    setIsPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-purple-100 pt-20">
      <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">
        Learning Type Assessment
      </h1>
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Questions */}
        {!isReviewPage ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <p className="text-lg font-medium mb-4">
                  {questions[currentQuestion].text}
                </p>
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.label
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block mb-3"
                  >
                    <input
                      type="radio"
                      name={`question-${questions[currentQuestion].id}`}
                      value={index + 1}
                      checked={
                        answers[questions[currentQuestion].id] === index + 1
                      }
                      onChange={() =>
                        handleOptionChange(
                          questions[currentQuestion].id,
                          index + 1
                        )
                      }
                      className="mr-2"
                      required
                    />
                    {option}
                  </motion.label>
                ))}
                {error && (
                  <div className="text-red-500 text-sm mt-3 flex items-center gap-2">
                    <FaExclamationCircle />
                    {error}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
              {currentQuestion > 0 && (
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  className="bg-gray-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600"
                >
                  Previous
                </button>
              )}
              {currentQuestion < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        ) : (
          // Review Page
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Review Your Answers
            </h2>
            {questions.map((question, index) => (
              <div key={question.id} className="mb-6">
                <p className="text-lg font-medium mb-2">{question.text}</p>
                <p className="text-gray-600">
                  Your Answer:{" "}
                  <span className="font-semibold">
                    {question.options[answers[question.id] - 1]}
                  </span>
                </p>
              </div>
            ))}
            <button
              onClick={handleProceedToPopup}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
            >
              Proceed to Results <FaArrowRight />
            </button>
          </motion.div>
        )}
      </div>

      {/* Result Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <Dialog
            open={isPopupOpen}
            onClose={handleDialogClose}
            className="fixed z-10 inset-0 overflow-y-auto"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center min-h-screen"
            >
              <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
                <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
                <Dialog.Title className="text-2xl font-bold mb-4">
                  Congratulations!
                </Dialog.Title>
                <Dialog.Description className="text-lg mb-6">
                  Your Learning Type:{" "}
                  <span className="font-semibold text-blue-600">
                    {result?.type}
                  </span>
                  <br />
                  Total Score:{" "}
                  <span className="font-semibold text-green-600">
                    {result?.points}%
                  </span>
                </Dialog.Description>
                <button
                  onClick={handleDialogClose}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
                >
                  Continue <FaArrowRight />
                </button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningType;
