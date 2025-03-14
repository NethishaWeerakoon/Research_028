import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.roleType === "Recruiter") {
      navigate("/my-jobs"); // Redirect recruiters to "My Jobs" page
    } else if (user?.roleType === "Job Seeker") {
      navigate("/resume"); // Redirect job seekers to "Resume" page
    } else {
      navigate("/sign-up"); 
    }
  };

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
    </div>
  );
}
