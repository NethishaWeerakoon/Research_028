import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"; // Import PieChart components from recharts

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const QuizResults = () => {
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [barChartData, setBarChartData] = useState([]); // To store bar chart data for multiple attempts
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results/${
            user._id
          }`
        );

        if (response.data && response.data.results) {
          const results = response.data.results;
          setQuizResults(results);

          // Prepare data for Bar chart (scores for each attempt)
          const barChartDataset = results.quizAttempts.map((quiz, index) => {
            const topic = prettifyFilename(quiz.filename);
            return {
              label: `Attempt ${index + 1} - ${topic}`,
              score: quiz.score,
            };
          });
          setBarChartData(barChartDataset);
        }
      } catch (err) {
        console.error("Error fetching quiz results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [user._id]);

  // Helper function to transform the filename
  const prettifyFilename = (filename) => {
    if (!filename) return "";
    const nameWithoutExt = filename.replace(".pdf", "");
    const nameWithoutTutorial = nameWithoutExt.replace("_tutorial", ""); // Remove '_tutorial' from the filename
    const nameWithSpaces = nameWithoutTutorial.replace(/_/g, " "); // Replace underscores with spaces
    return nameWithSpaces;
  };


  const getLearningTypeFromPoints = (points) => {
    if (points >= 80) return "Speed Type Learner";
    if (points >= 50) return "Medium Type Learner";
    return "Slow Type Learner";
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
        <p className="text-lg text-gray-600 ml-4">Loading quiz results...</p>
      </div>
    );
  }


  if (!quizResults || quizResults.quizAttempts.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 w-full mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Quiz Results</h1>
        <p className="text-xl text-gray-600 mt-4">
          You haven't attempted any quizzes yet. Start learning to see your
          results here!
        </p>
      </div>
    );
  }

  
  const latestQuizAttempt =
    quizResults.quizAttempts[quizResults.quizAttempts.length - 1];

  const learningType = getLearningTypeFromPoints(
    latestQuizAttempt.learningTypePoints
  );
  const quizScoreType = latestQuizAttempt.learningType; 
  const isSameType = learningType === quizScoreType;

  
  const pieData = [
    { name: "Correct Answers", value: latestQuizAttempt.correctAnswers },
    {
      name: "Wrong Answers",
      value: latestQuizAttempt.totalQuestions - latestQuizAttempt.correctAnswers,
    },
  ];
  const COLORS = ["#4CAF50", "#FF5722"]; 

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-8xl mx-auto my-8 border border-blue-100"> {/* Changed max-w-4xl to max-w-6xl */}
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 border-b-2 pb-4 border-blue-200">
        Your Quiz Performance Dashboard
      </h1>

      {/* Summary of Learning Type and Score Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-2">
            Overall Learning Profile
          </h2>
          <p className="text-lg text-gray-700">
            <strong>Learning Type Score:</strong>{" "}
            <span className="font-semibold text-indigo-600">
              {latestQuizAttempt.learningTypePoints} points
            </span>
          </p>
          <p className="text-lg text-gray-700">
            <strong>Identified Learning Type:</strong>{" "}
            <span className="font-semibold text-indigo-600">
              {learningType}
            </span>
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-xl font-bold text-green-800 mb-2">
            Technical Quiz Assessment
          </h2>
          <p className="text-lg text-gray-700">
            <strong>Technical Quiz Score:</strong>{" "}
            <span className="font-semibold text-emerald-600">
              {latestQuizAttempt.score}%
            </span>
          </p>
          <p className="text-lg text-gray-700">
            <strong>Quiz Score Type:</strong>{" "}
            <span className="font-semibold text-emerald-600">
              {quizScoreType}
            </span>
          </p>
        </div>
      </div>

      {/* Learning Type Match Indicator */}
      {isSameType ? (
        <div className="mt-4 p-4 bg-green-100 text-green-800 text-center rounded-lg shadow-inner flex items-center justify-center animate-fade-in mb-8">
          <span className="text-2xl mr-3">✅</span>
          <p className="text-lg font-medium">
            Great! Your **Learning Type** and **Technical Quiz Score Type**
            match:{" "}
            <strong className="text-green-900">{learningType}</strong>. Keep up
            the consistency!
          </p>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-red-100 text-red-800 text-center rounded-lg shadow-inner flex items-center justify-center animate-fade-in mb-8">
          <span className="text-2xl mr-3">⚠️</span>
          <p className="text-lg font-medium">
            Heads up! Your Learning Type (
            <strong className="text-red-900">{learningType}</strong>) and
            Technical Quiz Score Type (
            <strong className="text-red-900">{quizScoreType}</strong>) currently
            do not match. Reviewing your approach might be helpful.
          </p>
        </div>
      )}

      {/* Quiz Data Table - All Attempts */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Detailed Quiz Attempts History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Score (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Time Taken (s)
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Correct
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Qs
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizResults.quizAttempts.map((quiz, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {prettifyFilename(quiz.filename) || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {quiz.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {quiz.timeTaken}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {quiz.correctAnswers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {quiz.totalQuestions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar Chart - Scores per Topic */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Quiz Performance by Topic (All Attempts)
        </h2>
        {barChartData.length > 0 ? (
          <div className="h-96">
            <Bar
              data={{
                labels: barChartData.map(
                  (item) => item.label.split(" - ")[1] || item.label
                ),
                datasets: [
                  {
                    label: "Score view (%)",
                    data: barChartData.map((item) => item.score),
                    backgroundColor: [
                      "rgba(54, 162, 235, 0.8)", 
                      "rgba(255, 99, 132, 0.8)", 
                      "rgba(75, 192, 192, 0.8)", 
                      "rgba(255, 159, 64, 0.8)", 
                      "rgba(153, 102, 255, 0.8)", 
                      "rgba(201, 203, 207, 0.8)", 
                    ],
                    borderColor: [
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 99, 132, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(255, 159, 64, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(201, 203, 207, 1)",
                    ],
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: { size: 14, family: "'Inter', sans-serif" },
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: "circle",
                    },
                  },
                  tooltip: {
                    backgroundColor: "rgba(30, 41, 59, 0.9)", 
                    titleFont: { size: 16, weight: "bold" },
                    bodyFont: { size: 14 },
                    padding: 12,
                    usePointStyle: true,
                    callbacks: {
                      label: (context) => `Score: ${context.raw}%`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: "rgba(0, 0, 0, 0.08)", drawBorder: false }, 
                    ticks: {
                      font: { size: 12 },
                      callback: (value) => `${value}%`,
                      color: "#4A5568", 
                    },
                    title: {
                        display: true,
                        text: 'Score (%)',
                        color: '#2D3748',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                  },
                  x: {
                    grid: { display: false },
                    ticks: {
                      font: { size: 12, weight: "bold" },
                      color: "#4A5568",
                    },
                    title: {
                        display: true,
                        text: 'Quiz Topic',
                        color: '#2D3748',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                  },
                },
                animation: { duration: 2000, easing: "easeOutQuart" },
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No quiz data available to display chart.
          </p>
        )}
      </div>

   
      {/* <div className="mt-8 bg-green-50 p-6 rounded-lg shadow-md border border-green-200"> */}
        {/* <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Answer Breakdown (Latest Quiz)
        </h2>
        <div className="flex flex-col items-center"> */}
          {/* <ResponsiveContainer width="100%" height={300}> */}
            {/* <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationBegin={800} 
                animationDuration={1500} 
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff" 
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} answers`,
                  name === "Correct Answers" ? "Correct" : "Wrong",
                ]}
                itemStyle={{ fontWeight: "bold" }}
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "5px",
                  color: "#fff",
                }}
              />
            </PieChart> */}
          {/* </ResponsiveContainer> */}
          {/* <div className="flex justify-center mt-4 space-x-6"> */}
            {/* <div className="flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-[#4CAF50] mr-2"></span>
              <span className="text-gray-700">Correct Answers</span>
            </div> */}
            {/* <div className="flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-[#FF5722] mr-2"></span>
              <span className="text-gray-700">Wrong Answers</span>
            </div> */}
          {/* </div> */}
        {/* </div>
      </div> */}
    </div>
  );
};

export default QuizResults;