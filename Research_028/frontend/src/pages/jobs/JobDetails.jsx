import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [selected, setSelected] = useState(false);
  const [error, setError] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  // Fetch job details from the backend
  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}jobs/${jobId}`
      );
      setJob(response.data);

      // Check if user has applied
      if (response.data.appliedUsers.includes(userId)) {
        setApplied(true);
      }

      // Check if user is selected
      if (response.data.selectedUsers.includes(userId)) {
        setSelected(true);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  // Handle job application process
  const handleApplyJob = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}users/apply-job`,
        { userId, jobId }
      );
      console.log(response.data);
      setApplied(true);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Applied Successfully!",
        text: "You have successfully applied for this job.",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
    } catch (error) {
      console.error("Error applying for the job:", error);
      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text:
          error.response?.data?.error ||
          "An error occurred while applying for the job.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch job details on component mount or when jobId changes
  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  // Show loading state if job data is not yet fetched
  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loading />
        <p className="text-gray-600 text-lg ml-4">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="bg-white p-6 rounded-lg shadow-md mx-auto flex gap-10">
        {/* Company Logo */}
        <div className="flex justify-center mb-6 w-1/3">
          <img
            src={job.logo}
            alt={`${job.title} Company Logo`}
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="flex flex-col w-2/3">
          {/* Job Title */}
          <h1 className="text-4xl font-bold mb-4">{job.title}</h1>

          {/* Job Description */}
          <p className="text-gray-700 mb-4 whitespace-pre-line">
            {job.description}
          </p>

          {/* Job Requirements */}
          <h2 className="text-2xl font-semibold mb-2">Requirements</h2>
          <ul className="list-disc pl-5 mb-4">
            {job.requirements.split(",").map((req, index) => (
              <li key={index} className="text-gray-700">
                {req.trim()}
              </li>
            ))}
          </ul>

          {/* Additional Information */}
          <div className="text-gray-500 space-y-2">
            <p>
              <strong>Email:</strong> {job.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {job.phoneNumber}
            </p>
            <p>
              <strong>Experience Required:</strong> {job.experienceYears} years
            </p>
            <p>
              <strong>Posted On:</strong>{" "}
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Apply or Navigate to Video Upload */}
          <div className="mt-6">
            {selected ? (
              <div className="flex justify-between">
                <h1 className="text-green-600 font-bold mt-2">
                  You are Selected for This Job:
                </h1>
                <button
                  onClick={() => navigate(`/video-upload/${jobId}`)}
                  className="bg-green-500 text-white py-2 px-4 rounded-md"
                >
                  Proceed to Video Upload
                </button>
              </div>
            ) : applied ? (
              <p className="text-green-500 font-semibold">
                You have already applied for this job.
              </p>
            ) : error ? (
              <p className="text-red-500 font-semibold">{error}</p>
            ) : (
              <button
                onClick={handleApplyJob}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                disabled={loading}
              >
                {loading ? "Applying" : "Apply for this job"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
