import { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LearningType = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  // Array of questions with options for the learning type assessment
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
  };

  // Calculate the learning type based on the user's answers and calculate a percentage score (max 21 = 100%)
  const calculateLearningType = async () => {
    const totalScore = Object.values(answers).reduce(
      (acc, curr) => acc + curr,
      0
    );
    let learningType = "";

    if (totalScore >= 6 && totalScore <= 11) {
      learningType = "Slow Type Learner";
    } else if (totalScore >= 12 && totalScore <= 16) {
      learningType = "Medium Type Learner";
    } else if (totalScore >= 17 && totalScore <= 21) {
      learningType = "Speed Type Learner";
    }

    // Calculate percentage based on a maximum score of 21
    const percentageScore = Number(((totalScore / 30) * 100).toFixed(2));
    setResult({ type: learningType, points: percentageScore });
    setIsPopupOpen(true);

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !user._id || !token) {
      console.error("User not logged in or invalid data.");
      return;
    }

    // Send learningType and learningTypePoints (percentage) to the backend
    try {
      const response = await axios.post(
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

      console.log("Learning type saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving learning type:", error);
    }
  };

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateLearningType();
  };

  // Handle closing the popup and navigating based on learning type
  const handleDialogClose = () => {
    setIsPopupOpen(false);
    navigate("/topic-select");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <h1 className="text-4xl font-semibold text-blue-700">
        Learning Type Assessment
      </h1>
      <div className="space-y-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white p-4 shadow-md rounded-md"
            >
              <p className="text-lg font-medium mb-3">{question.text}</p>
              {question.options.map((option, index) => (
                <label key={index} className="block mb-2">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={index + 1}
                    checked={answers[question.id] === index + 1}
                    onChange={() => handleOptionChange(question.id, index + 1)}
                    className="mr-2"
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {/* Popup Dialog */}
      {isPopupOpen && (
        <Dialog
          open={isPopupOpen}
          onClose={handleDialogClose}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0" />
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
              <Dialog.Title className="text-2xl font-bold mb-4">
                Congratulations!
              </Dialog.Title>
              <Dialog.Description className="text-lg mb-6">
                Your Learning Type:{" "}
                <span className="font-semibold">{result?.type}</span>
                <br />
                Total Score:{" "}
                <span className="font-semibold">{result?.points}%</span>
              </Dialog.Description>
              <button
                onClick={handleDialogClose}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default LearningType;
