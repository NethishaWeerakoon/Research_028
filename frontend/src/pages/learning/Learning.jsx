import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import learningcover from "../../assets/learning/learningcover.png";

export default function Learning() {
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results/${
            user._id
          }`
        );
        setQuizResults(response.data.results);
      } catch (err) {
        console.error("Error fetching quiz results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchQuizResults();
    }
  }, [user?._id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:min-h-screen bg-gray-100 md:pt-20">
      {/* Hero Section */}
      <section>
        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
          <div className="flex justify-center md:justify-start w-full md:w-1/2 mb-6 md:mb-0">
            <img
              src={learningcover}
              alt="Learning Cover"
              className="max-w-full h-auto px-0 md:px-20"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold mb-10 text-gray-800">
              Achieve Your Goals With the Right Learning Path
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-12">
              Our Learning Type Identification platform simplifies understanding
              your unique learning style. With personalized insights,
              customizable resources, and an intuitive interface, you can
              enhance your skills and achieve your goals. Perfect for students,
              professionals, and lifelong learners. Start today and discover the
              most effective way to learn.
            </p>
            <div className="flex gap-2">
              {quizResults && quizResults.learningTypePoints ? (
                <button
                  onClick={() => navigate("/topic-select")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
                >
                  Attempt Technical Quiz
                </button>
              ) : (
                <a
                  href="/learning-type"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
                >
                  Find Learning Type
                </a>
              )}
              <a
                href="/learning-progress"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
              >
                Learning Progress Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
