import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

// Function to return appropriate badge based on the index (medals)
const getBadge = (index) => {
  if (index === 0) return "🥇"; // Gold Medal
  if (index === 1) return "🥈"; // Silver Medal
  if (index === 2) return "🥉"; // Bronze Medal
  return "";
};

const LearningProgress = () => {
  const [data, setData] = useState([]); // Store the fetched data
  const [filteredData, setFilteredData] = useState([]); // Store the filtered data
  const [currentUser, setCurrentUser] = useState(null); // Store current user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedFilter, setSelectedFilter] = useState("All"); // Filter by learner type
  const navigate = useNavigate(); // Use navigate for routing

  // Fetch quiz results on component mount
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated.");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update state with API response
        setData(response.data.results);
        setFilteredData(response.data.results); // Set initial filtered data
      } catch (err) {
        setError(err.message || "Failed to fetch quiz results.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, []);

  // Check localStorage for user data and token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const user = JSON.parse(userData); // Parse stored user data
      setCurrentUser(user); // Store user info in state
    }
  }, []);

  // Handle filter change
  const handleFilterChange = (type) => {
    setSelectedFilter(type);
    if (type === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((item) => item.learningType.startsWith(type))
      );
    }
  };

  // Render loading state if data is still being fetched
  if (loading) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        <Loading />
        <p className="text-center text-gray-600">Loading ...</p>
      </div>
    );
  }

  // Render error message if an error occurred during data fetching
  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  // Filter out users with a score equal to 0
  const nonZeroData = filteredData.filter((item) => item.score > 0);

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      {/* Dashboard Section */}
      <div className="flex gap-6 mb-10 justify-between">
        <h1 className="text-4xl font-semibold text-blue-700">
          Track Your Learning Progress
        </h1>

        <div className="flex gap-6">
          <div
            onClick={() => handleFilterChange("Speed")}
            className={`bg-blue-600 text-white p-2 rounded-lg shadow-md cursor-pointer ${
              selectedFilter === "Speed" ? "ring-4 ring-blue-400" : ""
            }`}
          >
            <h3 className="text-md font-semibold">
              Speed Type Learners{" "}
              {
                data.filter(
                  (item) => item.learningType === "Speed Type Learner"
                ).length
              }
            </h3>
          </div>
          <div
            onClick={() => handleFilterChange("Medium")}
            className={`bg-green-600 text-white p-2 rounded-lg shadow-md cursor-pointer ${
              selectedFilter === "Medium" ? "ring-4 ring-green-400" : ""
            }`}
          >
            <h3 className="text-md font-semibold">
              Medium Type Learners{" "}
              {
                data.filter(
                  (item) => item.learningType === "Medium Type Learner"
                ).length
              }
            </h3>
          </div>
          <div
            onClick={() => handleFilterChange("Slow")}
            className={`bg-red-600 text-white p-2 rounded-lg shadow-md cursor-pointer ${
              selectedFilter === "Slow" ? "ring-4 ring-red-400" : ""
            }`}
          >
            <h3 className="text-md font-semibold">
              Slow Type Learners{" "}
              {
                data.filter((item) => item.learningType === "Slow Type Learner")
                  .length
              }
            </h3>
          </div>
          <div
            onClick={() => handleFilterChange("All")}
            className={`bg-gray-400 text-white p-2 rounded-lg shadow-md cursor-pointer ${
              selectedFilter === "All" ? "ring-2 ring-gray-600" : ""
            }`}
          >
            <h3 className="text-md font-semibold">Show All</h3>
          </div>{" "}
          {currentUser?.roleType !== "Recruiter" && (
            <button
              onClick={() => navigate("/reference")}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Reference
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Score (%)</th>
              <th className="py-3 px-4 text-left">Correct Answers</th>
              <th className="py-3 px-4 text-left">Total Questions</th>
              <th className="py-3 px-4 text-left">Time (sec)</th>
            </tr>
          </thead>
          <tbody>
            {nonZeroData.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-100`}
              >
                <td className="py-3 px-4">
                  {index < 3 && (
                    <span className="mr-2 text-2xl">{getBadge(index)}</span>
                  )}
                  {item.fullName}
                </td>
                <td className="py-3 px-4">{(item.score || 0).toFixed(2)}</td>
                <td className="py-3 px-4">{item.correctAnswers || 0}</td>
                <td className="py-3 px-4">{item.totalQuestions || 0}</td>
                <td className="py-3 px-4">
                  {(item.timeTaken || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LearningProgress;
