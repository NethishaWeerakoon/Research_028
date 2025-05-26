import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch jobs
  const fetchDefaultJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}jobs/all`
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching default jobs:", error);
    }
  };

  useEffect(() => {
    fetchDefaultJobs();
  }, []);

  // Truncate description to 15 words for better readability
  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.length > 15
      ? words.slice(0, 15).join(" ") + "..."
      : description;
  };

  // Navigate to job detail page
  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div
      className="min-h-screen p-10"
      style={{
        background:
          "linear-gradient(135deg, #D9D6F1 0%, #B8ACF6 48%, #EEE3FE 100%)",
      }}
    >
      {/* Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">
            Explore Jobs
          </h1>
          <button
            onClick={() => navigate(`/recommended-jobs`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            Find Recommended Jobs
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => handleJobClick(job._id)}
                className="group cursor-pointer bg-indigo-50 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJobClick(job._id);
                }}
              >
                <div className="flex justify-center mb-5">
                  <img
                    src={job.logo}
                    alt={`${job.title} company logo`}
                    className="h-40 w-auto object-contain rounded-xl"
                    loading="lazy"
                  />
                </div>

                <h2 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-700 mb-3 transition-colors">
                  {job.title}
                </h2>

                <p className="text-gray-700 flex-grow mb-4 leading-relaxed">
                  {truncateDescription(job.description)}
                </p>

                <p className="text-indigo-600 text-sm italic font-medium">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-lg col-span-full">
              No jobs found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
