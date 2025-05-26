import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react"; 
import { Fragment } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 

const LearningType = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
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

  const handleOptionChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // Calculate the learning type based on the user's answers and calculate a percentage score
  const calculateLearningType = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      Swal.fire({
        icon: "warning",
        title: "Please Answer All Questions",
        text: "You need to answer all questions to determine your learning type.",
        confirmButtonText: "Got It",
        confirmButtonColor: "#F59E0B", 
      });
      return;
    }

    setIsSubmitting(true); 

    const totalScore = Object.values(answers).reduce(
      (acc, curr) => acc + curr,
      0
    );
    let learningType = "";

    if (totalScore >= 6 && totalScore <= 11) {
      learningType = "Slow Type Learner"; 
    } else if (totalScore >= 12 && totalScore <= 16) {
      learningType = "Medium Type Learner"; 
    } else if (totalScore >= 17 && totalScore <= 30) { 
      learningType = "Speed Type Learner";
    }

  
    const percentageScore = Number(((totalScore / 30) * 100).toFixed(0)); 
    setResult({ type: learningType, points: percentageScore });
    setIsPopupOpen(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!user || !user._id || !token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to save your learning type.",
        confirmButtonText: "Login",
        confirmButtonColor: "#EF4444",
      }).then(() => {
        navigate("/login"); 
      });
      setIsSubmitting(false);
      return;
    }

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
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.response?.data?.error || "Could not save your learning type. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsSubmitting(false); // End submission loading
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.01] animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 animate-fadeInDown">
          Discover Your Learning Style! 🧠
        </h1>
        <p className="text-lg text-center text-gray-700 mb-10 leading-relaxed">
          Answer these questions to understand how you learn best. This will
          help us tailor your learning experience on the platform!
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((question, qIndex) => (
            <div
              key={question.id}
              className="bg-gray-50 p-6 shadow-lg rounded-lg border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeInUp"
              style={{ animationDelay: `${qIndex * 0.1}s` }}
            >
              <p className="text-xl font-semibold text-gray-800 mb-4">
                {qIndex + 1}. {question.text}
              </p>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out
                      ${
                        answers[question.id] === index + 1
                          ? "bg-blue-100 border-blue-500 shadow-md text-blue-800 font-medium"
                          : "bg-white border-gray-300 hover:bg-gray-100"
                      }
                      border`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={index + 1}
                      checked={answers[question.id] === index + 1}
                      onChange={() => handleOptionChange(question.id, index + 1)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 mr-3"
                      required
                    />
                    <span className="text-base">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(answers).length !== questions.length}
              className={`px-10 py-4 text-xl font-bold rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-gray-700"
                    : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                }
              `}
            >
              {isSubmitting ? "Analyzing..." : "Submit My Answers"}
            </button>
          </div>
        </form>
      </div>

      <Transition appear show={isPopupOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleDialogClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all border-t-4 border-blue-500">
                  <Dialog.Title
                    as="h3"
                    className="text-3xl font-bold leading-6 text-gray-900 text-center flex items-center justify-center gap-2 mb-4"
                  >
                    Great Job! <span className="text-4xl">🎉</span>
                  </Dialog.Title>
                  <div className="mt-4 text-center">
                    <p className="text-xl text-gray-700 mb-2">
                      Based on your answers, your estimated learning style is:
                    </p>
                    <p className="text-4xl font-extrabold text-blue-600 animate-pulse mb-4">
                      {result?.type}
                    </p>
                    <p className="text-lg text-gray-600">
                      Your score reflects a{" "}
                      <span className="font-semibold text-purple-600">
                        {result?.points}%
                      </span>{" "}
                      tendency towards this style.
                    </p>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition duration-200 transform hover:scale-105"
                      onClick={handleDialogClose}
                    >
                      Continue to Topic Selection
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default LearningType;