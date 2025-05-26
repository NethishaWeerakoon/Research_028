import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import JobMatchScoreChart from "../../components/JobMatchScoreChart";

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOcrContent = async () => {
    setLoading(true);
    const userString = localStorage.getItem("user");
    if (!userString) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const user = JSON.parse(userString);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}resumes/ocr-content/${user._id}`
      );
      const content = response.data.ocrContent?.[0]?.[0]?.content;
      if (content) setJobType(content);
    } catch (err) {
      setError("Failed to fetch OCR content.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}jobs/all`);
      const sortedJobs = response.data.sort((a, b) => {
        const distA = typeof a.distance === "number" ? a.distance : Infinity;
        const distB = typeof b.distance === "number" ? b.distance : Infinity;
        return distA - distB;
      });
      setJobs(sortedJobs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch jobs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}jobs/search`,
        { jobType, jobCount: 50 }
      );
      const filteredJobs = response.data.filter((job) => job.distance > 0);
      setJobs(filteredJobs.sort((a, b) => a.distance - b.distance));
      setError(null);
    } catch (err) {
      setError("Failed to search jobs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOcrContent();
  }, []);

  useEffect(() => {
    if (jobType) searchJobs();
    else fetchDefaultJobs();
  }, [jobType]);

  const truncateDescription = (desc) => {
    const words = desc.split(" ");
    return words.length > 12 ? words.slice(0, 12).join(" ") + "..." : desc;
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatDistancePercentage = (distance) => {
    if (distance === 0) return 100;
    return Number((100 * (1 / (1 + distance))).toFixed(2));
  };

  return (
    <div
      className="min-h-screen p-10"
      style={{
        background:
          "linear-gradient(135deg, #D9D6F1 0%, #B8ACF6 48%, #EEE3FE 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-screen bg-indigo-100 rounded-lg shadow-lg p-10">
            <Loading />
            <p className="text-indigo-700 text-lg mt-4 font-semibold">
              Loading jobs, please wait...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">
                Recommended Jobs
              </h1>
              <button
                onClick={() => navigate("/jobs")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-7 rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                aria-label="View All Jobs"
              >
                View All Jobs
              </button>
            </div>

            {error && (
              <p className="text-red-600 mb-6 text-center font-semibold">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <article
                    key={job._id}
                    tabIndex={0}
                    onClick={() => handleJobClick(job._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleJobClick(job._id);
                    }}
                    className="bg-indigo-50 p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                    aria-label={`Job: ${job.title}`}
                  >
                    <div className="flex justify-center mb-6">
                      <img
                        src={job.logo}
                        alt={`${job.title} company logo`}
                        className="h-40 object-contain rounded-xl"
                        loading="lazy"
                      />
                    </div>

                    <h2 className="text-2xl font-semibold text-indigo-900 mb-2 truncate">
                      {job.title}
                    </h2>
                    <p className="text-gray-700 flex-grow mb-4 leading-relaxed">
                      {truncateDescription(job.description)}
                    </p>
                    <p className="text-indigo-600 text-sm italic font-medium">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </p>

                    {typeof job.distance === "number" && !isNaN(job.distance) && (
                      <span className="mt-4 inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm self-start">
                        Match Score: {formatDistancePercentage(job.distance)}%
                      </span>
                    )}
                  </article>
                ))
              ) : (
                <p className="text-center text-gray-600 text-lg col-span-full">
                  No jobs found.
                </p>
              )}
            </div>

            {/* BAR CHART SECTION */}
            {jobs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold text-indigo-800 mb-4">
                  Job Match Score Distribution
                </h2>
                <JobMatchScoreChart jobs={jobs} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs;
