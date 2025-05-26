import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";


const getBadge = (index) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈"; 
  if (index === 2) return "🥉";
  return "";
};

const formatTime = (seconds) => {
  if (seconds === 0) return "0s";
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(1);
  return `${minutes}m ${remainingSeconds}s`;
};

const LearningProgress = () => {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [selectedFilter, setSelectedFilter] = useState("All"); 
  const navigate = useNavigate(); 
  // Fetch quiz results on component mount
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated. Please log in.");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Sort data by score in descending order for leaderboard-like display
        const sortedResults = response.data.results.sort((a, b) => b.score - a.score);

        setData(sortedResults);
        setFilteredData(sortedResults); 
      } catch (err) {
        setError(err.message || "Failed to fetch quiz results.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to fetch quiz results. Please try again.",
          confirmButtonColor: "#EF4444",
        });
      
        if (err.message === "User not authenticated. Please log in.") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [navigate]);

  // Check localStorage for user data and token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const user = JSON.parse(userData); 
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      // If no token or user data, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  // Handle filter change
  const handleFilterChange = (type) => {
    setSelectedFilter(type);
    if (type === "All") {
      setFilteredData(data);
    } else {
     
      setFilteredData(
        data.filter((item) => item.learningType.includes(type))
      );
    }
  };

  // Render loading state if data is still being fetched
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <Loading />
        <p className="mt-4 text-xl text-center text-gray-700 animate-pulse">
          Gathering your learning achievements...
        </p>
      </div>
    );
  }

  // Render error message if an error occurred during data fetching
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="p-8 text-center bg-white border-t-4 border-red-500 shadow-lg rounded-xl">
          <h2 className="mb-4 text-3xl font-bold text-red-600">
            Oops! An error occurred.
          </h2>
          <p className="mb-6 text-lg text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()} 
            className="px-6 py-3 font-semibold text-white transition-all duration-300 transform bg-red-500 rounded-lg shadow-md hover:bg-red-600 hover:scale-105"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Filter out users with a score equal to 0 for display in the table
  const nonZeroData = filteredData.filter((item) => item.score > 0);

  return (
    <div className="min-h-screen p-8 font-sans bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col justify-between mb-10 md:flex-row md:items-center">
          <h1 className="mb-6 text-5xl font-extrabold text-purple-800 md:mb-0 animate-fadeInDown">
            Your Learning Journey 🚀
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 md:justify-end animate-fadeInRight">
            <h3 className="mr-2 text-lg font-semibold text-gray-700">Filter by:</h3>
            {/* Filter Buttons */}
            {["All", "Speed", "Medium", "Slow"].map((type) => {
              let bgColor = "";
              let hoverColor = "";
              let ringColor = "";
              switch (type) {
                case "Speed":
                  bgColor = "bg-purple-600";
                  hoverColor = "hover:bg-purple-700";
                  ringColor = "ring-purple-400";
                  break;
                case "Medium":
                  bgColor = "bg-green-600";
                  hoverColor = "hover:bg-green-700";
                  ringColor = "ring-green-400";
                  break;
                case "Slow":
                  bgColor = "bg-red-600";
                  hoverColor = "hover:bg-red-700";
                  ringColor = "ring-red-400";
                  break;
                default: // All
                  bgColor = "bg-gray-500";
                  hoverColor = "hover:bg-gray-600";
                  ringColor = "ring-gray-300";
              }

              const count = data.filter((item) =>
                type === "All" ? true : item.learningType.includes(type)
              ).length;

              return (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  className={`${bgColor} ${hoverColor} text-white px-5 py-2 rounded-full shadow-md text-base font-medium transition-all duration-300 transform hover:scale-105
                    ${selectedFilter === type ? `ring-4 ${ringColor}` : ""}
                  `}
                >
                  {type} Learners ({count})
                </button>
              );
            })}

           
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-xl animate-fadeInUp">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="text-white bg-purple-700">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold tracking-wider text-left uppercase rounded-tl-xl">
                    Rank & Learner
                  </th>
                  <th className="px-6 py-4 text-sm font-bold tracking-wider text-left uppercase">
                    Score (%)
                  </th>
                  <th className="px-6 py-4 text-sm font-bold tracking-wider text-left uppercase">
                    Correct Answers
                  </th>
                  <th className="px-6 py-4 text-sm font-bold tracking-wider text-left uppercase">
                    Total Questions
                  </th>
                  <th className="px-6 py-4 text-sm font-bold tracking-wider text-left uppercase rounded-tr-xl">
                    Time Taken
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {nonZeroData.length > 0 ? (
                  nonZeroData.map((item, index) => (
                    <tr
                      key={item._id || index} // Use unique _id if available, fallback to index
                      className={`${
                        index % 2 === 0 ? "bg-purple-50" : "bg-white"
                      } hover:bg-purple-100 transition-all duration-200 ease-in-out
                      ${
                        currentUser && currentUser._id === item.userId
                          ? "ring-2 ring-yellow-500 font-semibold shadow-inner" // Highlight current user's row
                          : ""
                      }
                      `}
                    >
                      <td className="flex items-center px-6 py-4 text-lg text-gray-900 whitespace-nowrap">
                        {index < 3 ? (
                          <span className="mr-3 text-3xl animate-bounce-medal">
                            {getBadge(index)}
                          </span>
                        ) : (
                          <span className="w-8 mr-3 text-lg font-medium text-center text-gray-600">
                            #{index + 1}
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span className="font-semibold text-purple-700">
                            {item.fullName}
                            {currentUser && currentUser._id === item.userId && (
                              <span className="ml-2 text-sm bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </span>
                          <span className="mt-1 text-sm text-gray-500">
                            {item.learningType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-lg font-bold text-gray-800 whitespace-nowrap">
                        <span
                          className={`${
                            item.score >= 80
                              ? "text-green-600"
                              : item.score >= 40
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap text-md">
                        {item.correctAnswers || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap text-md">
                        {item.totalQuestions || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap text-md">
                        {formatTime(item.timeTaken || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-10 text-xl text-center text-gray-600">
                      No quiz results found for the selected filter.
                      <p className="mt-2 text-purple-500 cursor-pointer hover:underline" onClick={() => navigate("/learning-type-quiz")}>
                        Why not take the quiz now?
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
<br></br>
         {/* Reference Button (Conditional) */}
         {currentUser?.roleType !== "Recruiter" && (
              <button
                onClick={() => navigate("/reference")}
                className="px-6 py-2 ml-4 font-semibold text-white transition-all duration-300 transform bg-indigo-500 rounded-full shadow-md hover:bg-indigo-600 hover:scale-105 animate-pulse-once"
              >
                Get Reference Letter
              </button>
            )}
      </div>
    </div>
  );
};

export default LearningProgress;