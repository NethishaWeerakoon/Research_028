import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch user's jobs from the API
  const fetchUserJobs = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      setError("User not found. Please log in again.");
      console.error("Error :", error);
      return;
    }

    try {
      const user = JSON.parse(userString);
      const userId = user._id;
      // Fetch jobs for the logged-in user
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}jobs/user/${userId}`
      );
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error("Error fetching user jobs:", error);
      setError("Failed to fetch jobs. Please try again later.");
    }
  };

  // useEffect hook to fetch user jobs on component mount
  useEffect(() => {
    fetchUserJobs();
  }, []);

  // useEffect hook to filter jobs when search query changes
  useEffect(() => {
    if (searchQuery) {
      setFilteredJobs(
        jobs.filter((job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchQuery, jobs]);

  // Function to handle job deletion
  const handleDeleteJob = async (jobId) => {
    try {
      await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the job.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        confirmButtonColor: "red",
        cancelButtonColor: "green",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}jobs/${jobId}`
          );
          setJobs(jobs.filter((job) => job._id !== jobId));
          setFilteredJobs(filteredJobs.filter((job) => job._id !== jobId));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The job has been deleted.",
            confirmButtonText: "OK",
            confirmButtonColor: "green",
          });
        }
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete the job. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      fetchUserJobs();
    }
  };

  // Helper function to truncate job description text
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <div className="flex flex-col items-start justify-between mb-8 space-y-4 md:flex-row md:space-y-0 md:items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 sm:text-4xl">
          My Job Postings
        </h1>
        <a
          href="/create-job"
          className="px-6 py-3 text-sm font-medium tracking-wide text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:-translate-y-1"
        >
          + Add New Job
        </a>
      </div>


      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 pr-4 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <svg
            className="absolute w-5 h-5 text-gray-400 left-3 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="relative overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl"
            >
              {/* Delete Button - Top Right Corner */}
              <button
                onClick={() => handleDeleteJob(job._id)}
                className="absolute z-10 p-2 text-white transition-all duration-300 bg-red-500 rounded-full shadow-lg top-3 right-3 hover:bg-red-600 hover:shadow-xl hover:scale-110 active:scale-95"
                title="Delete Job"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Job Image */}
                <div className="md:w-1/3">
                  <img
                    src={job.logo}
                    alt="Job Post"
                    className="object-cover w-full h-full min-h-[180px]"
                  />
                </div>

                {/* Job Details */}
                <div className="flex flex-col justify-between p-5 md:w-2/3">
                  <div>
                    <h2 className="mb-2 text-xl font-bold text-gray-800">
                      {job.title}
                    </h2>
                    <p className="text-gray-600">
                      {truncateText(job.description, 20)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/applicant/recommended/${job._id}`,
                          {
                            state: { query_text: job.description },
                          }
                        )
                      }
                      className="px-5 py-3 text-sm font-bold text-purple-900 transition-all duration-300 bg-gradient-to-r from-purple-400 to-purple-300 rounded-xl hover:from-purple-300 hover:to-purple-200 hover:shadow-lg hover:shadow-purple-400/50 hover:-translate-y-1 active:scale-95"
                    >
                      🎯 Recommended
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/dashboard/applicant/job/${job._id}`, {
                          state: { query_text: job.description },
                        })
                      }
                      className="px-5 py-3 text-sm font-bold text-blue-900 transition-all duration-300 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-xl hover:from-blue-300 hover:to-cyan-200 hover:shadow-lg hover:shadow-blue-400/50 hover:-translate-y-1 active:scale-95"
                    >
                      👥 Applicants
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/dashboard/applicant/video/${job._id}`, {
                          state: { query_text: job.description },
                        })
                      }
                      className="px-5 py-3 text-sm font-bold text-green-900 transition-all duration-300 bg-gradient-to-r from-green-400 to-emerald-300 rounded-xl hover:from-green-300 hover:to-emerald-200 hover:shadow-lg hover:shadow-green-400/50 hover:-translate-y-1 active:scale-95"
                    >
                      📹 Video Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center col-span-2 py-12">
            <div className="p-8 text-center bg-white shadow-md rounded-xl">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No jobs found
              </h3>
              <p className="mt-1 text-gray-500">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first job posting"}
              </p>
              {!searchQuery && (
                <a
                  href="/create-job"
                  className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  + Add New Job
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;