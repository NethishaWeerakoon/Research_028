import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";

const PersonalityQuiz = () => {
  const [personalityText, setPersonalityText] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Handle form submission
  const handleSubmit = async () => {
    // If no text is entered or the length is too short/long, show a warning message
    if (!personalityText.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...!",
        text: "Please describe yourself before submitting.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    if (charCount < 200 || charCount > 1000) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Character Length",
        text: "Your response should be between 200 and 800 characters long.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))._id
        : null;

      // If user is not logged in, show an error message
      if (!userId) {
        Swal.fire({
          icon: "error",
          title: "Not Logged In",
          text: "Please log in to update your personality text.",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
        setLoading(false);
        return;
      }

      // Make API request to update the personality text in the database
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}resumes/update-personality-text`,
        { userId, personalityText },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Show success message after successfully updating the personality text
      Swal.fire({
        icon: "success",
        title: "Success!",
        text:
          response.data.message || "Your personality text has been updated.",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });

      setPersonalityText("");
      setCharCount(0);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while updating personality text.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input change to track character count
  const handleInputChange = (e) => {
    setPersonalityText(e.target.value);
    setCharCount(e.target.value.length);
  };

  // Show loading screen while submitting
  if (loading) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        <Loading />
        <p className="text-center text-gray-600">
          Submitting your personality text...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <h1 className="text-4xl font-semibold text-blue-700 mb-6 text-center">
        Do you want to take a challenge?...
      </h1>

      <div className="space-y-6">
        {/* Text Area for personality description */}
        <div className="bg-gray-200 rounded-lg p-4 shadow-md">
          <label className="block text-2xl font-semibold text-gray-700 mb-2">
            You have been assigned to lead a project for your company that requires collaboration with a team of people from different departments. The deadline is tight, and there is a conflict between two team members about how to proceed. One prefers a structured, detailed approach, while the other wants to keep things flexible and open-ended. You also need to present your progress to upper management soon. How would you handle this situation?
          </label>
          <br />
          <textarea
            rows={10}
            value={personalityText}
            onChange={handleInputChange}
            placeholder="Describe how you would handle this situation, focusing on your approach to leadership, teamwork, and problem-solving. Please aim for 200-1000 characters."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>

          {/* Character Count Display */}
          <div className="text-sm text-gray-500 mt-2">
            {charCount} characters (between 200 and 1000 characters)
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded-lg w-40`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PersonalityQuiz;