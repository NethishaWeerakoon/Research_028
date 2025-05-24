import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const Reference = () => {
  const [quizData, setQuizData] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Predefined file links
  const fileLinks = {
    "Java_tutorial.pdf":
      "https://rp-projects-public.s3.amazonaws.com/resumes/6799f6abfedcb361443ad0da/1738945110585-java_tutorial.pdf",
    "HTML_tutorial.pdf":
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

  // Detailed advice based on learning type
  const learningAdvice = {
    "Slow Learner": {
      advice: "You may need more time to grasp concepts, but with consistent effort, you can achieve your goals.",
      tips: [
        "Break down complex topics into smaller, manageable parts.",
        "Revise regularly to reinforce your understanding.",
        "Seek help from mentors or peers when needed.",
        "Use visual aids or hands-on activities to better understand concepts.",
      ],
    },
    "Medium Speed Learner": {
      advice: "You have a good pace of learning. Focus on improving your understanding and retention of concepts.",
      tips: [
        "Practice regularly to strengthen your knowledge.",
        "Use a mix of reading, writing, and hands-on activities to learn.",
        "Set achievable goals and track your progress.",
      ],
    },
    "Speed Learner": {
      advice: "You are a fast learner! Keep up the good work and challenge yourself with more advanced topics.",
      tips: [
        "Focus on mastering advanced concepts in your field.",
        "Try solving complex problems to further enhance your skills.",
        "Engage in peer discussions to share and gain knowledge.",
      ],
    },
  };

  // Suggested online materials based on quiz type
  const suggestedMaterials = {
    Java: [
      { name: "Oracle Java Tutorials", link: "https://docs.oracle.com/javase/tutorial/" },
      { name: "W3Schools Java", link: "https://www.w3schools.com/java/" },
      { name: "Java Code Geeks", link: "https://www.javacodegeeks.com/" },
    ],
    HTML: [
      { name: "MDN Web Docs (HTML)", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
      { name: "W3Schools HTML", link: "https://www.w3schools.com/html/" },
      { name: "HTML.com Tutorials", link: "https://html.com/" },
    ],
    Python: [
      { name: "Python Official Docs", link: "https://docs.python.org/3/" },
      { name: "Real Python", link: "https://realpython.com/" },
      { name: "W3Schools Python", link: "https://www.w3schools.com/python/" },
    ],
    "React Native": [
      { name: "React Native Docs", link: "https://reactnative.dev/docs/getting-started" },
      { name: "Expo Documentation", link: "https://docs.expo.dev/" },
      { name: "React Native School", link: "https://reactnativeschool.com/" },
    ],
    SQL: [
      { name: "W3Schools SQL", link: "https://www.w3schools.com/sql/" },
      { name: "SQLZoo", link: "https://sqlzoo.net/" },
      { name: "Mode Analytics SQL Tutorial", link: "https://mode.com/sql-tutorial/" },
    ],
    CPP: [
      { name: "C++ Official Docs", link: "https://en.cppreference.com/w/" },
      { name: "LearnCPP", link: "https://www.learncpp.com/" },
      { name: "GeeksforGeeks C++", link: "https://www.geeksforgeeks.org/c-plus-plus/" },
    ],
    Flutter: [
      { name: "Flutter Official Docs", link: "https://flutter.dev/docs" },
      { name: "Flutter School", link: "https://www.flutterschool.com/" },
      { name: "Flutter Awesome", link: "https://flutterawesome.com/" },
    ],
  };

  // Fetch quiz results from the backend for the logged-in user
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results/${user._id}`
        );

        if (response.data && response.data.results) {
          setQuizData(response.data.results);

          // Match filename with link
          const filename = response.data.results.filename;
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

  // Data for the bar chart
  const chartData = quizData
    ? [
        { name: "Correct Answers", value: quizData.correctAnswers },
        { name: "Wrong Answers", value: quizData.totalQuestions - quizData.correctAnswers },
      ]
    : [];

  // Get suggested materials based on the quiz type
  const quizType = quizData?.filename?.split("_")[0]; // Extract quiz type from filename (e.g., "Java_tutorial.pdf" -> "Java")
  const materials = quizType ? suggestedMaterials[quizType] : [];

  // Get detailed advice based on learning type
  const learningType = quizData?.learningType?.trim(); // Trim any extra spaces
  const advice = learningType ? learningAdvice[learningType] : null;

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
            <p className="text-lg">
              <strong className="text-gray-700">Score:</strong> {quizData.score}
            </p>
            <p className="text-lg">
              <strong className="text-gray-700">Time Taken:</strong>{" "}
              {quizData.timeTaken.toFixed(2)} seconds
            </p>




            {/* Graphical representation of correct and wrong answers */}
            <div className="mt-6">
              <BarChart width={500} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Correct Answers" ? "#4CAF50" : "#F44336"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </div>

            {/* Suggested online materials */}
            {materials.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-700 mb-4">
                  Suggested Online Materials for {quizType}
                </h3>
                <ul className="space-y-2">
                  {materials.map((material, index) => (
                    <li key={index}>
                      <a
                        href={material.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {material.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {downloadLink && (
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
            )}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/my-profile")}
                className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-300"
              >
                👤 Go to My Profile
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
