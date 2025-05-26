import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Ensure Swal is imported for error handling

const Reference = () => {
  const [quizData, setQuizData] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [loadingResults, setLoadingResults] = useState(true); // Added loading state
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Handle potential null user

  // Predefined file links
  const fileLinks = {
    "Java_tutorial.pdf":
      "https://rp-projects-public.s3.amazonaws.com/resumes/6799f6abfedcb361443ad0da/1738945110585-java_tutorial.pdf",
    "html_tutorial.pdf":
      "https://rp-projects-public.s3.amazonaws.com/resumes/6799f6abfedcb361443ad0da/1738945082496-html_tutorial.pdf",
    "Python_tutorial.pdf":
      "https://rp-projects-public.s3.amazonaws.com/resumes/6799f6abfedcb361443ad0da/1738945143707-python_tutorial.pdf",
    "React Native_tutorial.pdf":
      "https://rp-projects-public.s3.amazonaws.com/resumes/6799f6abfedcb361443ad0da/1738945176122-react_native_tutorial.pdf",
    "SQL_tutorial.pdf":
      "https://rp-projects-public.s3.amazonaws.com/resumes/6799f6abfedcb361443ad0da/1738945219771-sql_tutorial.pdf",
    "CPP_tutorial.pdf":
      "https://rp-projects-public.s3.amazonaws.com/resumes/6799f6abfedcb361443ad0da/1738945247831-cpp_tutorial.pdf",
    "Flutter_tutorial.pdf":
      "https://rp-projects-public.s3.amazonaws.com/resumes/6799f6abfedcb361443ad0da/1738945270153-flutter_tutorial.pdf",
  };

  // Fetch quiz results from the backend for the logged-in user
  useEffect(() => {
    const fetchQuizResults = async () => {
      setLoadingResults(true); // Start loading
      try {
        if (!user || !user._id) {
          // Handle case where user is not logged in
          setLoadingResults(false);
          Swal.fire({
            icon: "info",
            title: "Not Logged In",
            text: "Please log in to view your learning progress.",
            confirmButtonText: "Go to Login",
            confirmButtonColor: "#3B82F6", // Blue 500
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login"); // Adjust to your login route
            }
          });
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results/${
            user._id
          }`
        );

        if (response.data && response.data.results) {
          const quizResults = response.data.results.quizAttempts;

          // Get the most recent quiz result (last item in the quizAttempts array)
          const recentQuiz = quizResults[quizResults.length - 1];

          setQuizData({
            ...response.data.results,
            ...recentQuiz, // Merge the most recent quiz attempt with the rest of the data
          });

          // Match filename with the corresponding download link
          const filename = recentQuiz.filename;
          if (fileLinks[filename]) {
            setDownloadLink(fileLinks[filename]);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Results",
          text: "There was an issue fetching your quiz data. Please try again later.",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444", 
        });
      } finally {
        setLoadingResults(false); 
      }
    };

    fetchQuizResults();
  }, [user._id, navigate]); 

  // Compute selected topic from filename
  const selectedTopic =
    quizData && quizData.filename
      ? quizData.filename.replace("_tutorial.pdf", "")
      : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.01] animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6 flex items-center justify-center gap-3">
          Your Learning Journey Snapshot <span className="text-4xl">🚀</span>
        </h2>

        {loadingResults ? (
          <div className="flex flex-col items-center justify-center py-10">
           
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-75 mb-4"></div>
            <p className="text-center text-gray-600 text-lg">
              Gathering your latest insights...
            </p>
          </div>
        ) : quizData ? (
          <div className="space-y-6">
            {/* Learning Type Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg shadow-md border border-blue-200 flex justify-between items-center animate-slideInLeft">
              <strong className="text-blue-600 text-xl">Learning Style:</strong>
              <span className="font-bold text-2xl text-indigo-700 bg-indigo-100 px-4 py-2 rounded-full shadow-inner transform hover:scale-105 transition-transform duration-200">
                {quizData.learningType}
              </span>
            </div>

            {/* Selected Topic Card */}
            {selectedTopic && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-lg shadow-md border border-green-200 flex justify-between items-center animate-slideInRight">
                <strong className="text-green-600 text-xl">Topic Explored:</strong>
                <span className="font-bold text-2xl text-teal-700 transform hover:scale-105 transition-transform duration-200">
                  {selectedTopic}
                </span>
              </div>
            )}

            {/* Quiz Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeInUp">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
                <p className="text-gray-700 text-md mb-1">Your Score</p>
                <span className="text-5xl font-extrabold text-purple-600">
                  {quizData.score}
                </span>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200">
                <p className="text-gray-700 text-md mb-1">Time Elapsed</p>
                <span className="text-5xl font-extrabold text-purple-600">
                  {quizData.timeTaken.toFixed(1)}{" "}
                  <span className="text-xl font-normal">s</span>
                </span>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center col-span-1 md:col-span-2 transform hover:scale-105 transition-transform duration-200">
                <p className="text-gray-700 text-md mb-1">Accuracy</p>
                <span className="text-5xl font-extrabold text-purple-600">
                  {quizData.correctAnswers} / {quizData.totalQuestions}
                </span>
                <p className="text-gray-500 text-sm mt-1">Correct Answers</p>
              </div>
            </div>

            {/* Special Message / Download Link */}
            {quizData.learningType === "Speed Type Learner" ? (
              <div className="bg-green-100 text-green-700 p-5 rounded-lg text-center border border-green-300 shadow-md flex flex-col items-center justify-center gap-2 animate-bounce-subtle">
                <span className="text-4xl">⚡</span>
                <p className="font-semibold text-xl">
                  You're a **Speed Type Learner!** Keep that momentum going! No
                  additional resources are needed for you right now.
                </p>
              </div>
            ) : (
              downloadLink && (
                <div className="text-center mt-6 animate-pulse-subtle">
                  <a
                    href={downloadLink}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-xl hover:bg-purple-700 transition duration-300 transform hover:scale-105 text-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Grab Your {selectedTopic} Tutorial PDF
                  </a>
                </div>
              )
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8 animate-fadeInUp">
              <button
                onClick={() => navigate("/my-profile")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                My Profile
              </button>
              
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 py-10 text-lg">
            Looks like you haven't completed a quiz yet!
            <button
              onClick={() => navigate("/select-topic")}
              className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-300 font-semibold"
            >
              Start Your First Quiz!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reference;