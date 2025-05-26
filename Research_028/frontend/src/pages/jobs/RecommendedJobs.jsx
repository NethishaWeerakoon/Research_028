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
      <div className="p-10 mx-auto bg-white shadow-xl max-w-7xl rounded-3xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-indigo-100 rounded-lg shadow-lg">
            <Loading />
            <p className="mt-4 text-lg font-semibold text-indigo-700">
              Loading jobs, please wait...
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-between gap-6 mb-10 md:flex-row">
              <h1 className="text-4xl font-extrabold tracking-tight text-indigo-900">
                Recommended Jobs
              </h1>
              <button
                onClick={() => navigate("/jobs")}
                className="py-3 font-semibold text-white transition transform bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 px-7 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                aria-label="View All Jobs"
              >
                View All Jobs
              </button>
            </div>

            {error && (
              <p className="mb-6 font-semibold text-center text-red-600">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <article
                    key={job._id}
                    tabIndex={0}
                    onClick={() => handleJobClick(job._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleJobClick(job._id);
                    }}
                    className="flex flex-col p-6 transition-shadow duration-300 shadow-md cursor-pointer bg-indigo-50 rounded-2xl hover:shadow-2xl"
                    aria-label={`Job: ${job.title}`}
                  >
                    <div className="flex justify-center mb-6">
                      <img
                        src={job.logo}
                        alt={`${job.title} company logo`}
                        className="object-contain h-40 rounded-xl"
                        loading="lazy"
                      />
                    </div>

                    <h2 className="mb-2 text-2xl font-semibold text-indigo-900 truncate">
                      {job.title}
                    </h2>
                    <p className="flex-grow mb-4 leading-relaxed text-gray-700">
                      {truncateDescription(job.description)}
                    </p>
                    <p className="text-sm italic font-medium text-indigo-600">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </p>

                    {typeof job.distance === "number" && !isNaN(job.distance) && (
                      <span className="self-start inline-block px-3 py-1 mt-4 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                        Match Score: {formatDistancePercentage(job.distance)}%
                      </span>
                    )}
                  </article>
                ))
              ) : (
                <p className="text-lg text-center text-gray-600 col-span-full">
                  No jobs found.
                </p>
              )}
            </div>

            {/* BAR CHART SECTION */}
            {jobs.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 text-xl font-bold text-indigo-800">
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
