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

// Register chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const QuizResults = () => {
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [barChartData, setBarChartData] = useState([]); // To store bar chart data
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        // Fetch quiz results from the API
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results/${
            user._id
          }`
        );

        if (response.data && response.data.results) {
          const results = response.data.results;
          setQuizResults(results);

          // Prepare data for Bar chart
          const barChartDataset = results.quizAttempts.map((quiz, index) => {
            const topic = prettifyFilename(quiz.filename); // Use prettifyFilename function to clean filenames
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
    // Remove the .pdf extension and replace underscores with spaces
    const nameWithoutExt = filename.replace(".pdf", "");
    const nameWithoutTutorial = nameWithoutExt.replace("_tutorial", ""); // Remove '_tutorial' from the filename
    const nameWithSpaces = nameWithoutTutorial.replace(/_/g, " "); // Replace underscores with spaces
    return nameWithSpaces;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full mb-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Quiz Results
      </h1>

      {/* Loading state */}
      {loading ? (
        <div>
          <Loading />
          <p className="text-left text-gray-600">Loading quiz results...</p>
        </div>
      ) : (
        <>
          {/* Quiz Data Table */}
          {quizResults ? (
            <div>
              <p className="text-lg">
                Learning Type Score - {quizResults.learningTypePoints}
              </p>
              <p className="text-lg my-2">
                Learning Type - {quizResults.learningType}
              </p>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                        Topic
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                        Technical Quiz Score
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                        Time Taken (s)
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                        Correct Answers
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                        Total Questions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResults.quizAttempts.map((quiz, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border border-gray-300">
                          {prettifyFilename(quiz.filename) || "N/A"}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {quiz.score}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {quiz.timeTaken}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {quiz.correctAnswers}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {quiz.totalQuestions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 mt-4">
              <p>You have not attempted the quiz yet.</p>
            </div>
          )}

          {/* Bar Chart - Scores per Topic */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Quiz Performance by Topic
            </h2>
            {barChartData.length > 0 ? (
              <div className="h-96">
                {" "}
                {/* Fixed height container */}
                <Bar
                  data={{
                    labels: barChartData.map(
                      (item) => item.label.split(" - ")[1] || item.label // Show just the topic name
                    ),
                    datasets: [
                      {
                        label: "Score (%)",
                        data: barChartData.map((item) => item.score),
                        backgroundColor: [
                          "rgba(54, 162, 235, 0.7)",
                          "rgba(255, 99, 132, 0.7)",
                          "rgba(75, 192, 192, 0.7)",
                          "rgba(255, 159, 64, 0.7)",
                          "rgba(153, 102, 255, 0.7)",
                        ],
                        borderColor: [
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 99, 132, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(255, 159, 64, 1)",
                          "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 2,
                        borderRadius: 4,
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
                          font: {
                            size: 14,
                            family: "'Inter', sans-serif",
                          },
                          padding: 20,
                          usePointStyle: true,
                          pointStyle: "circle",
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                        titleFont: {
                          size: 16,
                          weight: "bold",
                        },
                        bodyFont: {
                          size: 14,
                        },
                        padding: 12,
                        usePointStyle: true,
                        callbacks: {
                          label: (context) => {
                            return `Score: ${context.raw}%`;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        ticks: {
                          font: {
                            size: 12,
                          },
                          callback: (value) => `${value}%`,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          font: {
                            size: 12,
                            weight: "bold",
                          },
                        },
                      },
                    },
                    animation: {
                      duration: 2000,
                      easing: "easeOutQuart",
                    },
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No quiz data available to display chart
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizResults;
