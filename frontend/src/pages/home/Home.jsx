import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState([]);

  const handleGetStarted = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.roleType === "Recruiter") {
      navigate("/my-jobs");
    } else if (user?.roleType === "Job Seeker") {
      navigate("/resume");
    } else {
      navigate("/sign-up");
    }
  };

  // Open modal
  const openModal = () => setIsOpen(true);

  // Close modal
  const closeModal = () => setIsOpen(false);

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (review.trim()) {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?._id;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        // Send review to the backend
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}feedbacks/add`, {
          feedbackText: review,
          rating,
          userId,
        });

        closeModal();
      } catch (error) {
        console.error("Error submitting review:", error);
      } finally {
        fetchFeedbacks();
      }
    }
  };

  // Fetch all feedbacks from the backend
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}feedbacks/all`
      );
      setReviews(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white text-center py-16 px-4">
        <h1 className="text-4xl font-bold">Find Your Perfect Job</h1>
        <p className="mt-4 text-lg">
          AI-powered job recommendations based on your skills & experience.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition"
        >
          Get Started
        </button>
        
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">AI Job Matching</h3>
            <p className="mt-2 text-gray-600">
              Get personalized job recommendations based on your profile.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Easy Job Search</h3>
            <p className="mt-2 text-gray-600">
              Find jobs quickly with advanced search filters.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Apply Instantly</h3>
            <p className="mt-2 text-gray-600">
              One-click applications with your uploaded resume.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-blue-500 py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold text-white">How It Works</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <span className="text-blue-600 text-4xl font-bold">1</span>
            <h3 className="text-lg font-semibold mt-2">Create a Profile</h3>
            <p className="text-gray-600">
              Add your skills, experience, and preferences.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <span className="text-blue-600 text-4xl font-bold">2</span>
            <h3 className="text-lg font-semibold mt-2">Get Recommendations</h3>
            <p className="text-gray-600">Receive AI-powered job suggestions.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <span className="text-blue-600 text-4xl font-bold">3</span>
            <h3 className="text-lg font-semibold mt-2">Apply & Get Hired</h3>
            <p className="text-gray-600">
              Apply for jobs and start your new career.
            </p>
          </div>
        </div>
      </div>

      {/* Display Reviews */}
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>{" "}
          <button
            onClick={openModal}
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
          >
            Add Review
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          {/* Display reviews in horizontal scroll */}
          <div className="flex space-x-6">
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white p-6 w-72 mb-4 rounded-lg shadow-md min-w-80"
                >
                  {" "}
                  <div className="mt-2 text-blue-600 text-xl">
                    {review.userId.fullName}
                  </div>
                  <div className="mt-1 text-blue-600">
                    Rating:{" "}
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl cursor-pointer ${
                            review.rating >= star
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-blue-600 mt-1">Review</p>
                    <p className="text-gray-600">{review.feedbackText}</p>{" "}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Normal Popup (Dialog Box) for Adding Review */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold">Add Your Review</h2>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              className="w-full mt-4 p-2 border rounded-md"
              placeholder="Write your review here..."
            />
            <div className="mt-4">
              <label>Rating: </label>
              <div className="flex space-x-2 mt-2">
                {/* 5-Star Rating System */}
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-2xl ${
                      rating >= star ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-between gap-2">
              <button
                onClick={handleReviewSubmit}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition w-full"
              >
                Submit Review
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-600 transition w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
