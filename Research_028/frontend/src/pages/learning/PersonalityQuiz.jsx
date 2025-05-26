import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";

const PersonalityQuiz = () => {
  const [personalityText, setPersonalityText] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async () => {
    // If no text is entered, show a warning message
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

  // Show loading screen while submitting
  if (loading) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        {/* Loading component that will be shown during the API request */}
        <Loading />
        <p className="text-center text-gray-600">
          Submitting your personality text...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <h1 className="text-4xl font-semibold text-blue-700 mb-6">
        Describe Yourself...
      </h1>

      <div className="space-y-6">
        {/* Text Area for personality description */}
        <div className="bg-gray-200 rounded-lg p-4 shadow-md">
          <label className="block text-xl font-semibold text-gray-700 mb-2">
            Tell us about yourself
          </label>
          <textarea
            rows={5}
            value={personalityText}
            onChange={(e) => setPersonalityText(e.target.value)}
            placeholder="Write a short description about yourself..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded-lg w-40`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
