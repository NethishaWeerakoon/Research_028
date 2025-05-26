import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const TopicSelect = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Predefined list of tutorial topics to select from
  const topics = [
    "Java",
    "Python",
    "React Native",
    "SQL",
    "CPP",
    "Flutter",
    "html",
  ];

  // Function to handle the filename update and navigation to quiz page
  const handleUpdateFilename = async () => {
    if (!selectedTopic) {
      return Swal.fire({
        icon: "error",
        title: "No Topic Selected",
        text: "Please select a topic to proceed.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    }

    const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
    const authToken = localStorage.getItem("token");

    if (!userId || !authToken) {
      return Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "User not authenticated.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    }

    const filename = `${selectedTopic}_tutorial.pdf`;

    setIsLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}learn/update-filename/${userId}`,
        { filename },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message) {
        // Navigate to /quiz page
        navigate("/learning-type-quiz");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.error || "An unexpected error occurred.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Select Your Learning Topic
        </h2>
        <p className="text-lg text-center text-gray-700 mb-6">
          Choose a tutorial topic to get started with learning. Select one of
          the options below and proceed to the quiz!
        </p>

        {/* Info section about each topic */}
        <div className="flex flex-col  gap-3 text-left text-gray-600 mt-4">
          <p>
            <strong className="text-xl text-blue-600">Java</strong> is a
            versatile programming language, perfect for building large-scale web
            and mobile applications.
          </p>

          <p>
            <strong className="text-xl text-blue-600">Python</strong> is known
            for its simplicity and readability. Great for data science, machine
            learning, and web development.
          </p>
          <p>
            <strong className="text-xl text-blue-600">React Native</strong> is a
            powerful framework for building cross-platform mobile apps using
            JavaScript.
          </p>
          <p>
            <strong className="text-xl text-blue-600">SQL</strong> is a language
            for managing and querying databases. It is essential for anyone
            working with data.
          </p>
          <p>
            <strong className="text-xl text-blue-600">C++</strong> is a powerful
            language for systems programming, performance-critical applications,
            and game development.
          </p>
          <p>
            <strong className="text-xl text-blue-600">Flutter</strong> is an
            open-source UI toolkit to build beautiful, natively compiled
            applications for mobile, web, and desktop.
          </p>
          <p>
            <strong className="text-xl text-blue-600">HTML</strong> is the
            fundamental building block for creating web pages and applications.
          </p>
        </div>

        <div className="space-y-4 mt-4">
          {/* Dropdown for selecting topic */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Topic</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Continue button */}
        <div className="mt-6">
          <button
            onClick={handleUpdateFilename}
            disabled={!selectedTopic || isLoading}
            className={`w-full p-3 text-lg font-semibold text-white rounded-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? "Updating..." : "Continue to Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelect;
