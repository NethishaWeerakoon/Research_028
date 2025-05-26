import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
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

  // Fetch questions when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !user._id || !token) {
          throw new Error("User not logged in or invalid data.");
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
        // Check if the error message matches the maximum attempt error
        if (errorMsg === "You reached maximum attempt") {
          Swal.fire({
            icon: "error",
            title: "Maximum Attempt Reached",
            text: errorMsg,
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/learning-progress");
          });
        } else {
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

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
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !user._id || !token) {
        throw new Error("User not logged in or invalid data.");
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
        timeTaken: elapsedTime, // Use real-time elapsed time
        learningType,
      });
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      setError("Failed to submit quiz results. Please try again.");
    }
  };

  // Handle closing the popup and navigating to the learning progress page
  const handleCloseModal = () => {
    setIsPopupOpen(false);
    navigate("/learning-progress");
  };

  // Display loading screen while fetching questions
  if (loading) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        <Loading />
        <p className="text-center text-gray-600">Loading Questions...</p>
      </div>
    );
  }

  // Display error message if there is an error (other than maximum attempt error)
  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      {!quizStarted ? (
        <div className="text-center mt-36">
          <h1 className="text-4xl font-semibold text-blue-700">
            Identify Learning Type
          </h1>
          <p className="text-gray-600 my-4">
            Start the quiz to identify your learning type.
          </p>
          <button
            onClick={startQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-semibold text-blue-700">
            Quiz In Progress
          </h1>
          <p className="text-xl text-gray-700 mt-4">
            Time: {elapsedTime} seconds
          </p>
          <div className="space-y-6 mt-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-gray-200 rounded-lg p-4 shadow-md">
                <p className="text-lg font-semibold mb-2">{q.question}</p>
                <ul className="space-y-2">
                  {q.answer_choices.map((option) => (
                    <li key={option}>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={() => handleOptionSelect(index, option)}
                          className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </div>
        </>
      )}

      {isPopupOpen && (
        <Dialog
          open={isPopupOpen}
          onClose={handleCloseModal}
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
                <span className="font-semibold">{results?.learningType}</span>
                <br />
                Score: <span className="font-semibold">{results?.score}%</span>
                <br />
                Time Taken:{" "}
                <span className="font-semibold">
                  {results?.timeTaken} seconds
                </span>
              </Dialog.Description>
              <button
                onClick={handleCloseModal}
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

export default LearningTypeQuiz;
