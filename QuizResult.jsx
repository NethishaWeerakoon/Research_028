import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Loading from "../Loading";

const QuizResults = () => {
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results/${user._id}`
        );
        setQuizResults(response.data.results);
      } catch (err) {
        console.error("Error fetching quiz results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [user._id]);

  const prettifyFilename = (filename) => {
    if (!filename) return "";
    return filename.replace(".pdf", "").replace(/_/g, " ");
  };
//learning type verify
  const getLearningTypeFromPoints = (points) => {
    if (points >= 80) return "Speed Type Learner";
    if (points >= 50) return "Medium Type Learner";
    return "Slow Type Learner";
  };

  if (loading) {
    return (
      <div>
        <Loading />
        <p className="text-left text-gray-600">Loading quiz results...</p>
      </div>
    );
  }

  if (!quizResults) {
    return (
      <div className="text-center text-gray-600 mt-4">
        <p>You have not attempted the quiz yet.</p>
      </div>
    );
  }

  const learningType = getLearningTypeFromPoints(quizResults.learningTypePoints);
  const quizScoreType = quizResults.learningType;
  const isSameType = learningType === quizScoreType;

  const pieData = [
    { name: "Correct Answers", value: quizResults.correctAnswers },
    { name: "Wrong Answers", value: quizResults.totalQuestions - quizResults.correctAnswers },
  ];

  const COLORS = ["#4CAF50", "#FF5722"];

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full mb-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Quiz Results</h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>

            //table
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Learning Type Score</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Technical Quiz Score</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Time Taken (s)</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Correct Answers</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Total Questions</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Topic</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                {quizResults.learningTypePoints} - {learningType}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {quizResults.score} - {quizScoreType}
              </td>
              <td className="px-4 py-2 border border-gray-300">{quizResults.timeTaken}</td>
              <td className="px-4 py-2 border border-gray-300">{quizResults.correctAnswers}</td>
              <td className="px-4 py-2 border border-gray-300">{quizResults.totalQuestions}</td>
              <td className="px-4 py-2 border border-gray-300">{prettifyFilename(quizResults.filename) || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Matching Learning Type Indicator */}
     {isSameType ? (
  <div className="mt-6 p-4 bg-green-100 text-green-800 text-center rounded-lg">
    ✅ Your Learning Type and Technical Quiz Score Type match: <strong>{learningType}</strong>
  </div>
) : (
  <div className="mt-6 p-4 bg-red-100 text-red-800 text-center rounded-lg">
    ⚠️ Your Learning Type (<strong>{learningType}</strong>) and Technical Quiz Score Type (<strong>{quizScoreType}</strong>) do not match.
  </div>
)}

      {/* Pie Chart for Correct Answers */}
      <div className="mt-6 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-700">Correct Answers vs. Total Questions </h2>
        <h2 className="text-xl font-semibold text-gray-700">(According to the technical quiz)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuizResults;
