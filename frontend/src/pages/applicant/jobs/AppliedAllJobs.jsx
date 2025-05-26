import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../../components/Loading";

const AppliedAllJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const navigate = useNavigate();

  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}users/applied-jobs/${userId}`
      );

      // Check if appliedJobs is an array and set state accordingly
      if (
        response.data.appliedJobs &&
        Array.isArray(response.data.appliedJobs)
      ) {
        setAppliedJobs(response.data.appliedJobs);
      } else {
        setAppliedJobs([]);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      setError("An error occurred while fetching applied jobs.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch applied jobs when the component mounts
  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  // Display loading state while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loading />
        <p className="text-gray-600 text-lg ml-4">Loading applied jobs...</p>
      </div>
    );
  }

  // Display error message if any error occurs
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  // Function to limit description to 20 words
  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 20) {
      return words.slice(0, 60).join(" ") + "...";
    }
    return description;
  };

  // Handle job post click to navigate to the job detail page
  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-4xl font-bold mb-6">Your Applied Jobs</h1>

      {/* Display message if no jobs are applied */}
      {appliedJobs.length === 0 ? (
        <p className="text-gray-600">You have not applied for any jobs yet.</p>
      ) : (
        // Map over appliedJobs and render each job post
        appliedJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
            onClick={() => handleJobClick(job._id)}
          >
            <div className="flex gap-6">
              <img
                src={job.logo}
                alt={`${job.title} Company Logo`}
                className="w-40 h-auto object-contain shadow-md"
              />
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {truncateDescription(job.description)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppliedAllJobs;
