import { Dialog, Transition } from "@headlessui/react";
import { useState, useEffect, Fragment } from "react"; // Import Fragment for Transition
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading"; // Assuming this is a custom loading component
import Swal from "sweetalert2";

const LearningTypeQuiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submit button loading

  // Fetch questions when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}"); // Handle potential null user
        const token = localStorage.getItem("token");

        if (!user || !user._id || !token) {
          // If no user is logged in, show an alert and redirect
          Swal.fire({
            icon: "info",
            title: "Authentication Required",
            text: "Please log in to take the quiz.",
            confirmButtonText: "Go to Login",
            confirmButtonColor: "#3B82F6",
          }).then(() => {
            navigate("/login"); // Adjust to your actual login route
          });
          return; // Stop execution if not logged in
        }

        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-questions`,
          { userId: user._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setQuestions(response.data.questions);
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.message ||
          "Failed to load questions. Please try again.";

        if (errorMsg === "You reached maximum attempt") {
          Swal.fire({
            icon: "error",
            title: "Quiz Attempts Exhausted",
            text: "You've reached the maximum number of attempts for this quiz. Please check your learning progress.",
            confirmButtonText: "View Progress",
            confirmButtonColor: "#EF4444",
          }).then(() => {
            navigate("/learning-progress");
          });
        } else {
          setError(errorMsg);
          Swal.fire({
            icon: "error",
            title: "Error Loading Quiz",
            text: errorMsg,
            confirmButtonText: "OK",
            confirmButtonColor: "#EF4444",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]); // Added navigate to dependency array

  // Timer to track the elapsed time during the quiz
  useEffect(() => {
    let timer;
    if (quizStarted) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted]);

  // Handle when a user selects an option for a question
  const handleOptionSelect = (questionIndex, option) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionIndex]: option }));
  };

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    setElapsedTime(0); // Reset elapsed time
  };

  // Handle quiz submission with updated learning type logic based on score
  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Quiz",
        text: "Please answer all questions before submitting.",
        confirmButtonText: "Understood",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    setIsSubmitting(true); // Start submission loading

    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds

    // Calculate correct answers and score
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        correctAnswers++;
      }
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100); // Score as percentage

    // Determine learning type based solely on the score
    let learningType = "";
    if (score > 80) {
      learningType = "Speed Type Learner";
    } else if (score >= 40 && score <= 80) {
      learningType = "Medium Type Learner";
    } else {
      learningType = "Slow Type Learner";
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!user || !user._id || !token) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          confirmButtonText: "Login",
          confirmButtonColor: "#EF4444",
        }).then(() => {
          navigate("/login");
        });
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}learn/submit-quiz`,
        {
          userId: user._id,
          score,
          timeTaken,
          correctAnswers,
          totalQuestions,
          learningType,
          filename: "LearningTypeQuiz.pdf" // Placeholder filename for the quiz
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Quiz results saved:", response.data);

      setResults({
        score,
        correctAnswers,
        totalQuestions,
        timeTaken: timeTaken.toFixed(1), // Show one decimal place for time
        learningType,
      });
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.error || "Failed to submit quiz results. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsSubmitting(false); // End submission loading
    }
  };

  const handleCloseModal = () => {
    setIsPopupOpen(false);
    navigate("/learning-progress");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <Loading />
        <p className="text-xl text-gray-700 mt-4 animate-pulse">
          Fetching quiz questions for you...
        </p>
      </div>
    );
  }

  if (error && !quizStarted) { // Only show global error if quiz hasn't started
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-red-500">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple refresh to retry
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.01] animate-fadeIn">
        {!quizStarted ? (
          <div className="text-center mt-10">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-6 animate-fadeInDown">
              Ready to Discover Your Learning Type? 🚀
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              This quick quiz will help us understand your unique learning style.
              Your personalized results will guide you to the most effective
              learning resources.
            </p>
            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-all duration-300 transform hover:scale-105 animate-bounce-subtle"
            >
              Start Learning Journey
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-extrabold text-blue-700 animate-fadeInLeft">
                Quiz in Progress...
              </h1>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-semibold shadow-inner animate-fadeInRight">
                Time: {elapsedTime}s
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {questions.map((q, index) => (
                <div
                  key={q._id || index} // Use _id if available, otherwise index
                  className="bg-gray-50 p-6 shadow-lg rounded-lg border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
                >
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    {index + 1}. {q.question}
                  </p>
                  <ul className="space-y-3">
                    {q.answer_choices.map((option) => (
                      <li key={option}>
                        <label
                          className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out
                          ${
                            answers[index] === option
                              ? "bg-blue-100 border-blue-500 shadow-md text-blue-800 font-medium"
                              : "bg-white border-gray-300 hover:bg-gray-100"
                          }
                          border`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={answers[index] === option}
                            onChange={() => handleOptionSelect(index, option)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 mr-3 accent-blue-600" // accent for better default radio styling
                            required
                          />
                          <span className="text-base text-gray-700">
                            {option}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length !== questions.length}
                className={`px-10 py-4 text-xl font-bold rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg
                  ${
                    isSubmitting || Object.keys(answers).length !== questions.length
                      ? "bg-gray-400 cursor-not-allowed text-gray-700"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                  }
                `}
              >
                {isSubmitting ? "Submitting Answers..." : "Finish Quiz"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Results Popup Dialog */}
      <Transition appear show={isPopupOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
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
                    Quiz Completed! <span className="text-4xl">🎉</span>
                  </Dialog.Title>
                  <div className="mt-4 text-center">
                    <p className="text-xl text-gray-700 mb-2">
                      Your Learning Type:
                    </p>
                    <p className="text-4xl font-extrabold text-blue-600 animate-pulse mb-4">
                      {results?.learningType}
                    </p>
                    <p className="text-lg text-gray-600">
                      You scored{" "}
                      <span className="font-semibold text-purple-600">
                        {results?.score}%
                      </span>{" "}
                      correct answers.
                      <br />
                      Time taken:{" "}
                      <span className="font-semibold text-purple-600">
                        {results?.timeTaken} seconds
                      </span>
                    </p>
                    <p className="text-md text-gray-500 mt-4">
                      Head over to your learning progress to see more details and tailored recommendations!
                    </p>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition duration-200 transform hover:scale-105"
                      onClick={handleCloseModal}
                    >
                      View My Progress
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

export default LearningTypeQuiz;