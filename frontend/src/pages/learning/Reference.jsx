import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Reference = () => {
  const [quizData, setQuizData] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

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
      try {
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
      }
    };

    if (user && user._id) {
      fetchQuizResults();
    }
  }, []);

  // Compute selected topic from filename
  const selectedTopic =
    quizData && quizData.filename
      ? quizData.filename.replace("_tutorial.pdf", "")
      : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Your Learning Progress 📚
        </h2>

        {quizData ? (
          <div className="space-y-4">
            <p className="text-lg">
              <strong className="text-gray-700">Learning Type:</strong>{" "}
              <span className="text-blue-500 font-semibold">
                {quizData.learningType}
              </span>
            </p>
            {selectedTopic && (
              <p className="text-lg">
                <strong className="text-gray-700">Your selected Topic:</strong>{" "}
                <span className="text-blue-500 font-semibold">
                  {selectedTopic}
                </span>
              </p>
            )}
            <p className="text-lg">
              <strong className="text-gray-700">Score:</strong> {quizData.score}
            </p>
            <p className="text-lg">
              <strong className="text-gray-700">Time Taken:</strong>{" "}
              {quizData.timeTaken.toFixed(2)} seconds
            </p>
            <p className="text-lg">
              <strong className="text-gray-700">Correct Answers:</strong>{" "}
              {quizData.correctAnswers} / {quizData.totalQuestions}
            </p>

            {quizData.learningType === "Speed Type Learner" ? (
              <div className="bg-green-100 text-green-700 p-4 rounded-md text-center">
                🚀 You are a <strong>Speed Type Learner!</strong> Keep going
                strong! No additional resources needed.
              </div>
            ) : (
              downloadLink && (
                <div className="text-center">
                  <a
                    href={downloadLink}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-300"
                  >
                    📥 Download {quizData.filename}
                  </a>
                </div>
              )
            )}

            {/* Button to navigate to user profile page */}
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/my-profile")}
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-300"
              >
                Go to Profile
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading quiz results...</p>
        )}
      </div>
    </div>
  );
};

export default Reference;
