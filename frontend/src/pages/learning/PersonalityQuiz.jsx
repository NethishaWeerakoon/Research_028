import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const PersonalityQuiz = () => {
  const [personalityText, setPersonalityText] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async () => {
    if (!personalityText.trim()) {
      Swal.fire({ icon: "warning", title: "Oops...!", text: "Please describe yourself before submitting.", confirmButtonText: "OK", confirmButtonColor: "red" });
      return;
    }
    if (charCount < 200 || charCount > 800) {
      Swal.fire({ icon: "warning", title: "Invalid Character Length", text: "Your response should be between 200 and 800 characters long.", confirmButtonText: "OK", confirmButtonColor: "red" });
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id : null;
      if (!userId) {
        Swal.fire({ icon: "error", title: "Not Logged In", text: "Please log in to update your personality text.", confirmButtonText: "OK", confirmButtonColor: "red" });
        setLoading(false);
        return; 
      }

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}resumes/update-personality-text`, { userId, personalityText }, { headers: { "Content-Type": "application/json" } });
      Swal.fire({ icon: "success", title: "Success!", text: "Your personality text has been updated.", confirmButtonText: "OK", confirmButtonColor: "green" });
      setPersonalityText("");
      setCharCount(0);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "An error occurred while updating personality text.", confirmButtonText: "OK", confirmButtonColor: "red" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setPersonalityText(e.target.value);
    setCharCount(e.target.value.length);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        <Loading />
        <p className="text-center text-gray-600">Submitting your personality text...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-6 bg-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl w-full border border-gray-300"
        variants={itemVariants}
      >
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
          variants={itemVariants}
        >
          Take the Challenge!
        </motion.h1>

        <motion.div className="space-y-6" variants={itemVariants}>
          <motion.div className="bg-gray-50 rounded-lg p-6 shadow-md border border-gray-200" variants={itemVariants}>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              You have been assigned to lead a project for your company that requires collaboration with a team of people from different departments. The deadline is tight, and there is a conflict between two team members about how to proceed. One prefers a structured, detailed approach, while the other wants to keep things flexible and open-ended. You also need to present your progress to upper management soon. How would you handle this situation?
            </label>
            <br></br>
            <textarea
              rows={15}
              value={personalityText}
              onChange={handleInputChange}
              placeholder="Describe how you would handle this situation, focusing on your approach to leadership, teamwork, and problem-solving. Please aim for 200-800 characters."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white shadow-sm transition-all duration-300"
            ></textarea>
            <div className="text-sm text-gray-600 mt-2">{charCount} characters (between 200 and 800 characters)</div>
          </motion.div>
        </motion.div>

        <motion.div className="flex justify-center mt-6" variants={itemVariants}>
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-bold transition-all duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-gray-700 shadow-md"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Submitting..." : "Submit"}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalityQuiz;
