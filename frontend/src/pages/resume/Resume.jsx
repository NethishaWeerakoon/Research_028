import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import resumecover from "../../assets/resume/resumecover.png";
import Loading from "../../components/Loading";
import "animate.css/animate.min.css"; // animations

export default function Resume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [experienceYears, setExperienceYears] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const paragraphs = [
    "Your resume is a critical document that summarizes your skills, experience, and qualifications.",
    "A tailored resume helps highlight the skills most relevant to the job you're applying for.",
    "Make sure your resume is formatted professionally, using clear headings and bullet points for readability.",
    "Avoid long paragraphs; concise bullet points are key to keeping employers engaged.",
  ];

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleExperienceYearsChange = (e) => setExperienceYears(e.target.value);
  const toggleTips = () => setIsExpanded(!isExpanded);
  const handleStartDesigning = () => navigate("/cresume");

  const handleUpload = async () => {
    if (!file) {
      return Swal.fire({
        icon: "error",
        title: "No file selected",
        text: "Please pick a PDF or DOCX.",
        confirmButtonColor: "#e53e3e",
      });
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("experienceYears", experienceYears);

      const authToken = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}resumes/create-resume-pdf`,
        formData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Upload successful",
        text: "Your resume is being processed.",
        confirmButtonColor: "#38a169",
      });

      setFile(null);
      setExperienceYears("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err.response?.data?.error || "Unexpected error.",
        confirmButtonColor: "#e53e3e",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loading />
        <p className="mt-4 text-lg font-medium text-gray-700">Uploading…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 text-gray-900">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 backdrop-blur-md bg-white/70 rounded-3xl p-10 lg:p-14 shadow-xl animate__animated animate__fadeInUp">
          {/* Text */}
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-purple-900">
              Build a Professional CV for&nbsp;Your Dream Job
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-purple-800 max-w-lg">
              Our intuitive CV builder helps you craft a standout resume and
              receive personalized job recommendations.
            </p>
            <button
              onClick={handleStartDesigning}
              className="mt-8 inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-10 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-purple-400"
              aria-label="Start designing your resume"
            >
              Start Designing
            </button>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2">
            <img
              src="https://img.freepik.com/premium-photo/two-men-looking-resume-form_31965-132636.jpg?w=1380"
              alt="CV builder illustration"
              className="rounded-3xl shadow-2xl w-full h-72 md:h-96 object-cover object-center transition-transform duration-300 hover:scale-105 animate__animated animate__zoomIn"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* UPLOAD */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center backdrop-blur-md bg-white/70 rounded-3xl p-10 lg:p-14 shadow-xl animate__animated animate__fadeInUp">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold text-purple-900 mb-8">
              Upload Your Resume
            </h2>

            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-purple-300 rounded-3xl bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors"
              aria-label="File upload area. Click to select or drag and drop a file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14 text-purple-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M16 8a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="font-semibold text-purple-700">
                Click to upload or drag &amp; drop
              </p>
              <p className="text-sm text-purple-500 mt-1">Accepted: PDF, DOCX</p>
              {file && (
                <p className="mt-4 text-purple-900 text-sm font-medium truncate max-w-[90%]">
                  {file.name}
                </p>
              )}
              <input
                id="dropzone-file"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={handleFileChange}
                aria-required="true"
              />
            </label>

            <label
              htmlFor="experienceYears"
              className="block mt-8 mb-3 font-semibold text-purple-900"
            >
              Experience (years)
            </label>
            <input
              id="experienceYears"
              type="number"
              min="0"
              value={experienceYears}
              onChange={handleExperienceYearsChange}
              placeholder="e.g. 3"
              className="w-full rounded-2xl border-2 border-purple-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-400 transition"
              aria-required="true"
              aria-label="Years of experience"
            />

            <button
              onClick={handleUpload}
              className="mt-10 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-4 rounded-2xl shadow-md transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-purple-400"
              aria-label="Upload resume"
            >
              Upload Resume
            </button>
          </div>

          {/* Illustration */}
          <div className="flex justify-center md:justify-end">
            <img
              src={resumecover}
              alt="Resume illustration"
              className="rounded-3xl shadow-2xl w-full max-w-md h-80 md:h-[420px] object-cover object-center transition-transform duration-300 hover:scale-105 animate__animated animate__zoomIn"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* TIPS */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-12 text-center">
        <h2 className="text-3xl font-extrabold text-purple-900 mb-8">
          10 Resume Writing Tips That Make You Stand Out
        </h2>
        <p className="text-lg text-purple-800 max-w-2xl mx-auto">
          A resume is your self-marketing tool. Employers spend only seconds
          scanning each one—make yours count!
        </p>

        {isExpanded && (
          <ul className="mt-8 space-y-3 text-left text-purple-800 max-w-2xl mx-auto list-disc list-inside text-lg">
            <li>Tailor your resume to the job.</li>
            <li>Craft a compelling summary statement.</li>
            <li>Use reverse-chronological ordering.</li>
            <li>Write in third person—no “I”.</li>
            <li>Be concise and impactful.</li>
            <li>Quantify achievements when possible.</li>
            <li>Highlight soft skills too.</li>
            <li>Sprinkle role-specific keywords.</li>
            <li>Proofread for flawless details.</li>
            <li>Keep formatting clean and scannable.</li>
          </ul>
        )}

        <button
          onClick={toggleTips}
          className="mt-8 text-purple-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
          aria-expanded={isExpanded}
          aria-controls="tips-list"
        >
          {isExpanded ? "Read Less…" : "Read More…"}
        </button>
      </section>

      {/* PARAGRAPH NAV */}
      <section className="bg-purple-200/70 py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <div className="bg-purple-400 rounded-3xl shadow-xl p-10 animate__animated animate__fadeInUp">
            <div className="flex justify-center gap-3 mb-6">
              {paragraphs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  aria-label={`Tip ${i + 1}`}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    i <= currentStep
                      ? "bg-purple-900"
                      : "bg-purple-200 hover:bg-purple-300"
                  } focus:outline-none focus:ring-2 focus:ring-white`}
                />
              ))}
            </div>

            <p className="text-lg text-white font-medium">{paragraphs[currentStep]}</p>
            <p className="mt-4 text-sm text-purple-200 italic">– @JobVista</p>
          </div>
        </div>
      </section>
    </div>
  );
}
