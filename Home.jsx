import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is correctly configured
import "animate.css"; 
export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.roleType === "Recruiter") {
      navigate("/my-jobs");
    } else if (user?.roleType === "Job Seeker") {
      navigate("/resume"); // Redirect job seekers to "Resume" page
    } else {
      navigate("/sign-up");
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen">
   
      <div
        className="text-white text-center py-20 px-4 animate__animated animate__fadeIn animate__duration-500 bg-gradient-to-r from-purple-400 to-indigo-500"
        style={{
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Find Your Perfect Job
        </h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          AI-powered job recommendations based on your skills & experience.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg font-semibold shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {/* System Sections */}
      <div className="container my-16">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-12 animate__animated animate__fadeIn animate__duration-500">
          Explore Our System
        </h2>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {/* Resume Section */}
          <div className="col">
            <div
              className="card shadow-lg rounded-lg p-4 h-100 transition-all transform hover:scale-105 hover:shadow-2xl animate__animated animate__fadeInLeft animate__delay-1s"
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => navigate("/resume")}
            >
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80"
                alt="Resume"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="card-title text-lg font-semibold text-purple-600">
                  Resume Builder
                </h3>
                <p className="card-text text-muted mb-4">
                  Create and manage your personalized resume with our easy-to-use tools.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">1.</span>
                    <p>Fill in your details and work experience.</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">2.</span>
                    <p>Choose from professional templates.</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">3.</span>
                    <p>Download or share your resume instantly.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/resume")}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold shadow-md transform transition duration-300 ease-in-out hover:scale-105"
                >
                  Build Your Resume
                </button>
              </div>
            </div>
          </div>

          {/* Learn Section */}
          <div className="col">
            <div
              className="card shadow-lg rounded-lg p-4 h-100 transition-all transform hover:scale-105 hover:shadow-2xl animate__animated animate__fadeInUp animate__delay-1s"
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => navigate("/learning")}
            >
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80"
                alt="Learn"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="card-title text-lg font-semibold text-purple-600">
                  Learning Paths
                </h3>
                <p className="card-text text-muted mb-4">
                  Enhance your skills with personalized learning paths and quizzes.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">1.</span>
                    <p>Take a skill assessment to identify gaps.</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">2.</span>
                    <p>Follow curated courses and tutorials.</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">3.</span>
                    <p>Track your progress and earn certifications.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/learning")}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold shadow-md transform transition duration-300 ease-in-out hover:scale-105"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </div>

          {/* Personality Test Section */}
          <div className="col">
            <div
              className="card shadow-lg rounded-lg p-4 h-100 transition-all transform hover:scale-105 hover:shadow-2xl animate__animated animate__fadeInRight animate__delay-1s"
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => navigate("/personality-type-quiz")}
            >
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                alt="Personality Test"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="card-title text-lg font-semibold text-purple-600">
                  Personality Test
                </h3>
                <p className="card-text text-muted mb-4">
                  Discover your strengths and career preferences with our personality test.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">1.</span>
                    <p>Answer a series of insightful questions.</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">2.</span>
                    <p>Get a detailed personality analysis.</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">3.</span>
                    <p>Receive tailored career recommendations.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/personality-type-quiz")}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold shadow-md transform transition duration-300 ease-in-out hover:scale-105"
                >
                  Take the Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-center py-16 mt-16">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Take the Next Step?
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Whether you're building your resume, learning new skills, or discovering your career path, we're here to help you succeed.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-purple-600 py-3 px-8 rounded-lg font-semibold shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
}
