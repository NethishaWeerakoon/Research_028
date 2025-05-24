import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaSort, FaTrophy } from "react-icons/fa";

// Function to return appropriate badge based on the index (medals)
const getBadge = (index) => {
  if (index === 0) return "🥇"; 
  if (index === 1) return "🥈";
  if (index === 2) return "🥉"; 
  return "";
};

const LearningProgress = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

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

  // Handle search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      data.filter(
        (item) =>
          item.fullName.toLowerCase().includes(query) &&
          (selectedFilter === "All" ||
            item.learningType.startsWith(selectedFilter))
      )
    );
  };

  // Reset filters and search
  const resetFilters = () => {
    setSelectedFilter("All");
    setSearchQuery("");
    setFilteredData(data);
  };

  // Handle column sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 min-h-screen p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 md:mb-0">
          Track Your Learning Progress
        </h1>
        <button
          onClick={() => navigate("/reference")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
        >
          Go to Reference
        </button>
      </div>

      {/* Filters and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex items-center w-full md:w-auto">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative flex items-center w-full md:w-auto">
          <FaFilter className="absolute left-3 text-gray-500" />
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Learners</option>
            <option value="Speed">Speed Type Learners</option>
            <option value="Medium">Medium Type Learners</option>
            <option value="Slow">Slow Type Learners</option>
          </select>
        </div>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300"
        >
          Reset Filters
        </button>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto bg-white rounded-lg shadow-lg"
      >
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                <div className="flex items-center gap-2">
                  Name
                  <FaSort className="text-sm" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort("score")}
              >
                <div className="flex items-center gap-2">
                  Score (%)
                  <FaSort className="text-sm" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort("correctAnswers")}
              >
                <div className="flex items-center gap-2">
                  Correct Answers
                  <FaSort className="text-sm" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort("totalQuestions")}
              >
                <div className="flex items-center gap-2">
                  Total Questions
                  <FaSort className="text-sm" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort("timeTaken")}
              >
                <div className="flex items-center gap-2">
                  Time (sec)
                  <FaSort className="text-sm" />
                </div>
              </th>
              
            </tr>
          </thead>
          <tbody>
            {nonZeroData.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {index < 3 && (
                      <span className="text-2xl">{getBadge(index)}</span>
                    )}
                    {item.fullName}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>

                  //profile changes
                </td>
                <td className="py-3 px-4">{item.correctAnswers}</td>
                <td className="py-3 px-4">{item.totalQuestions}</td>
                <td className="py-3 px-4">{item.timeTaken.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default LearningProgress;
