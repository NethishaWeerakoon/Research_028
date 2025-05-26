import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const TopicSelect = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Predefined list of tutorial topics to select from with added color associations
  const topics = [
    { name: "Java", color: "bg-red-500", hoverColor: "hover:bg-red-600", textColor: "text-red-600", borderColor: "border-red-500", shadowColor: "shadow-red-200" },
    { name: "Python", color: "bg-blue-500", hoverColor: "hover:bg-blue-600", textColor: "text-blue-600", borderColor: "border-blue-500", shadowColor: "shadow-blue-200" },
    { name: "React Native", color: "bg-purple-500", hoverColor: "hover:bg-purple-600", textColor: "text-purple-600", borderColor: "border-purple-500", shadowColor: "shadow-purple-200" },
    { name: "SQL", color: "bg-yellow-500", hoverColor: "hover:bg-yellow-600", textColor: "text-yellow-600", borderColor: "border-yellow-500", shadowColor: "shadow-yellow-200" },
    { name: "CPP", color: "bg-green-500", hoverColor: "hover:bg-green-600", textColor: "text-green-600", borderColor: "border-green-500", shadowColor: "shadow-green-200" },
    { name: "Flutter", color: "bg-teal-500", hoverColor: "hover:bg-teal-600", textColor: "text-teal-600", borderColor: "border-teal-500", shadowColor: "shadow-teal-200" },
    { name: "html", color: "bg-orange-500", hoverColor: "hover:bg-orange-600", textColor: "text-orange-600", borderColor: "border-orange-500", shadowColor: "shadow-orange-200" },
  ];

  // Function to handle the filename update and navigation to quiz page
  const handleUpdateFilename = async () => {
    if (!selectedTopic) {
      return Swal.fire({
        icon: "error",
        title: "Oops! No Topic Selected",
        text: "Please pick a topic before moving on.",
        confirmButtonText: "Got It",
        confirmButtonColor: "#EF4444", // Red 500
      });
    }

    const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
    const authToken = localStorage.getItem("token");

    if (!userId || !authToken) {
      return Swal.fire({
        icon: "error",
        title: "Authentication Needed",
        text: "It looks like you're not logged in. Please log in to continue.",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
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
        title: "Action Failed",
        text:
          error.response?.data?.error || "Something went wrong. Please try again!",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-10 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-4 animate-fadeInDown">
          Unlock Your Learning Journey!
        </h2>
        <p className="text-xl text-center text-gray-700 mb-8 leading-relaxed">
          Ready to dive into a new topic? Pick one from our vibrant selection below
          and let's get started with a quick quiz to tailor your learning experience!
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card for each topic with detailed info and dynamic colors */}
          {topics.map((topic) => (
            <div
              key={topic.name}
              className={`p-6 rounded-lg border-2 transition-all duration-300 ease-in-out
                ${
                  selectedTopic === topic.name
                    ? `${topic.borderColor} ${topic.shadowColor} bg-opacity-10 ${topic.color.replace('bg-', 'bg-')}` // Highlight with specific color tint
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }
                cursor-pointer flex flex-col items-center text-center group`}
              onClick={() => setSelectedTopic(topic.name)}
            >
              <div className={`p-3 rounded-full ${topic.color} text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {/* You could add icons here based on topic. For now, a placeholder. */}
                {topic.name === "Java" && "☕"}
                {topic.name === "Python" && "🐍"}
                {topic.name === "React Native" && "⚛️"}
                {topic.name === "SQL" && "💾"}
                {topic.name === "CPP" && "💻"}
                {topic.name === "Flutter" && "🦋"}
                {topic.name === "html" && "🌐"}
              </div>
              <h3 className={`text-2xl font-bold ${topic.textColor} mb-2`}>
                {topic.name}
              </h3>
              <p className="text-gray-700 text-sm flex-grow">
                {topic.name === "Java" &&
                  "A powerful and versatile language, perfect for enterprise-level applications, Android development, and large-scale systems."}
                {topic.name === "Python" &&
                  "Known for its simplicity and vast libraries, ideal for data science, machine learning, web development, and automation."}
                {topic.name === "React Native" &&
                  "Build native mobile apps for iOS and Android using a single codebase. Fast development and great performance."}
                {topic.name === "SQL" &&
                  "The standard language for managing and querying relational databases. Essential for data analysis and backend development."}
                {topic.name === "CPP" &&
                  "A high-performance language widely used for game development, operating systems, and performance-critical applications."}
                {topic.name === "Flutter" &&
                  "Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase."}
                {topic.name === "html" &&
                  "The backbone of the web! Learn to structure content for web pages and create the foundation for all online experiences."}
              </p>
            </div>
          ))}
        </div>

     
        <div className="mb-6">
          <label htmlFor="topic-select" className="sr-only">
            Select a Topic
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
          >
            <option value="" disabled>
              -- Or select from dropdown --
            </option>
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Continue button */}
        <div className="mt-8">
          <button
            onClick={handleUpdateFilename}
            disabled={!selectedTopic || isLoading}
            className={`w-full p-4 text-xl font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-lg"
              }
            `}
          >
            {isLoading ? "Preparing Your Path..." : "Continue to Learning Path Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelect;