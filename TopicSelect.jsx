import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const TopicSelect = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  // Predefined list of tutorial topics to select from
  const topics = [
    { name: "Java", description: "Versatile programming language for building large-scale apps.", color: "bg-red-100" },
    { name: "Python", description: "Great for data science, machine learning, and web development.", color: "bg-blue-100" },
    { name: "React Native", description: "Powerful framework for building cross-platform mobile apps.", color: "bg-green-100" },
    { name: "SQL", description: "Essential for managing and querying databases.", color: "bg-purple-100" },
    { name: "C++", description: "Used for systems programming and performance-critical applications.", color: "bg-yellow-100" },
    { name: "Flutter", description: "Toolkit for building beautiful, natively compiled apps.", color: "bg-pink-100" },
    { name: "HTML", description: "Fundamental for creating web pages and applications.", color: "bg-indigo-100" },
  ];

  // Function to handle the filename update
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
        navigate("/learning-type-quiz");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.error || "An unexpected error occurred.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle selecting a topic
  const handleCardClick = (topic) => {
    setSelectedTopic(topic.name);
    setSelectedCard(topic.name);

    Swal.fire({
      title: `Selected Topic: ${topic.name}`,
      text: topic.description,
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Select Your Learning Topic
        </h2>
        <p className="text-lg text-center text-gray-700 mb-6">
          Choose a tutorial topic to get started with learning. Select one of
          the options below and proceed to the quiz!
        </p>

        {/* Render Topic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.name}
              onClick={() => handleCardClick(topic)}
              className={`p-6 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out 
                ${selectedCard === topic.name ? "shadow-2xl scale-105" : "hover:scale-105"} ${topic.color}`}
            >
              <h3 className="text-xl font-semibold text-blue-600">{topic.name}</h3>
              <p className="text-gray-600 mt-2">{topic.description}</p>
            </div>
          ))}
        </div>

      
        <div className="mt-6">
          <button
            onClick={handleUpdateFilename}
            disabled={isLoading || !selectedTopic}
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
