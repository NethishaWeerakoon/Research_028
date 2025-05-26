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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-blue-700">MY JOBS</h1>
        <a
          href="/create-job"
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 px-6 rounded-lg shadow-md"
        >
          ADD NEW JOB
        </a>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by job title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="flex bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* Job Image */}
              <img
                src={job.logo}
                alt="Job Post"
                className="w-40 h-40 object-cover"
              />

              {/* Job Details */}
              <div className="flex justify-between flex-col p-4">
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-700">
                    {truncateText(job.description, 20)}
                  </p>
                </div>
                <div className="flex justify-between gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/applicant/recommended/${job._id}`,
                          {
                            state: { query_text: job.description },
                          }
                        )
                      }
                      className="mt-2 bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300"
                    >
                      Recommended
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/dashboard/applicant/job/${job._id}`, {
                          state: { query_text: job.description },
                        })
                      }
                      className="mt-2 bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300"
                    >
                      Applicants
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/dashboard/applicant/video/${job._id}`, {
                          state: { query_text: job.description },
                        })
                      }
                      className="mt-2 bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300"
                    >
                      View Video Dashboard
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-screen ">
            <p className="text-center">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
