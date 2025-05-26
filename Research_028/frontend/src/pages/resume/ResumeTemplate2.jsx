import { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import {
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

export default function ResumeTemplateBW() {
  const [formData, setFormData] = useState({});
  const [profilePhotoBase64, setProfilePhotoBase64] = useState("");
  const [quizResults, setQuizResults] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      const savedData = JSON.parse(localStorage.getItem("ResumeData"));
      if (savedData) {
        setFormData(savedData);
        if (savedData.profilePhoto) setProfilePhotoBase64(savedData.profilePhoto);
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}learn/get-quiz-results/${user._id}`
        );
        if (response.data?.results) {
          setQuizResults(response.data.results);
          localStorage.setItem("QuizResults", JSON.stringify(response.data.results));
        }
      } catch (error) {
        console.error("Quiz fetch error:", error);
      }
    };
    fetchData();
  }, [user._id]);

  const handleDownloadPDF = () => {
    const resumeElement = document.getElementById("resume-preview");
    html2pdf()
      .set({
        margin: 0.15,
        filename: `${formData.firstName || 'User'}_${formData.lastName || 'Resume'}.pdf`,
        html2canvas: { scale: 3, dpi: 192, letterRendering: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(resumeElement)
      .save();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProfilePhotoBase64(base64);

      const updated = { ...formData, profilePhoto: base64 };
      setFormData(updated);
      localStorage.setItem("ResumeData", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  const prettifyFilename = (filename) =>
    filename?.replace(".pdf", "").replace("_tutorial", "").replace(/_/g, " ") || "";

  return (
    <div
      className="min-h-screen bg-white p-8 flex flex-col items-center font-sans text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        id="resume-preview"
        className="bg-white max-w-5xl w-full rounded-3xl shadow-lg border border-gray-300 overflow-hidden print:max-w-full print:shadow-none print:border-none animate-fadeIn"
        style={{ fontSize: "11pt", lineHeight: 1.5 }}
      >
        {/* Header */}
        <header className="bg-white text-gray-900 p-10 flex flex-col md:flex-row items-center gap-8 print:bg-white print:text-black print:p-6 border-b border-gray-300">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gray-300 shadow-md flex-shrink-0">
            {profilePhotoBase64 ? (
              <img
                src={profilePhotoBase64}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center font-semibold text-xl text-gray-600 select-none">
                Photo
              </div>
            )}
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-5xl font-extrabold leading-tight print:text-3xl">
              {formData.firstName} {formData.lastName}
            </h1>
            <div className="mt-2 flex flex-col md:flex-row md:space-x-12 text-lg font-semibold print:text-base">
              {formData.email && (
                <a
                  href={`mailto:${formData.email}`}
                  className="flex items-center gap-2 hover:underline print:text-black"
                >
                  <EnvelopeIcon className="w-6 h-6 stroke-gray-700" />
                  {formData.email}
                </a>
              )}
              {formData.contactNumber && (
                <div className="flex items-center gap-2 print:text-black">
                  <PhoneIcon className="w-6 h-6 stroke-gray-700" />
                  {formData.contactNumber}
                </div>
              )}
              <div className="flex items-center space-x-4 print:text-black">
                {formData.github && (
                  <a
                    href={formData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    <LinkIcon className="w-6 h-6 stroke-gray-700" /> GitHub
                  </a>
                )}
                {formData.linkedin && (
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    <LinkIcon className="w-6 h-6 stroke-gray-700" /> LinkedIn
                  </a>
                )}
                {formData.portfolio && (
                  <a
                    href={formData.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    <LinkIcon className="w-6 h-6 stroke-gray-700" /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Body Content */}
        <main className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12 print:p-6">
          {/* Left Column */}
          <section className="space-y-10 col-span-1 md:col-span-1">
            {/* Education */}
            <div>
              <h2 className="text-3xl font-extrabold mb-6 border-b-4 border-gray-600 pb-1 print:border-black print:text-xl">
                Education
              </h2>
              {formData.education?.length ? (
                formData.education.map((edu, i) => (
                  <div
                    key={i}
                    className="mb-6 pl-4 border-l-4 border-gray-600"
                  >
                    <p className="font-semibold text-lg print:text-base">{edu.degree}</p>
                    <p className="text-gray-700 print:text-black">{edu.institution}</p>
                    <p className="italic text-gray-600 print:text-black">{edu.timeRange}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic print:text-black">No education info</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-3xl font-extrabold mb-6 border-b-4 border-gray-600 pb-1 print:border-black print:text-xl">
                Skills
              </h2>
              <div className="bg-gray-100 rounded-xl p-4 space-y-4 print:bg-white">
                <div>
                  <h3 className="text-lg font-semibold print:text-base">Technical Skills</h3>
                  <p className="text-gray-700 whitespace-pre-wrap print:text-black">
                    {formData.technicalSkills || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold print:text-base">Soft Skills</h3>
                  <p className="text-gray-700 whitespace-pre-wrap print:text-black">
                    {formData.softSkills || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Interests & Languages */}
            <div>
              <h2 className="text-3xl font-extrabold mb-6 border-b-4 border-gray-600 pb-1 print:border-black print:text-xl">
                Interests & Languages
              </h2>
              <div className="bg-gray-100 rounded-xl p-4 space-y-4 print:bg-white">
                <div>
                  <h3 className="text-lg font-semibold print:text-base">Interests</h3>
                  <p className="text-gray-700 whitespace-pre-wrap print:text-black">
                    {formData.interests || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold print:text-base">Languages</h3>
                  <p className="text-gray-700 whitespace-pre-wrap print:text-black">
                    {formData.languages || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column */}
          <section className="col-span-1 md:col-span-2 space-y-10">
            {/* Work Experience */}
            <div>
              <h2 className="text-3xl font-extrabold mb-6 border-b-4 border-gray-600 pb-1 print:border-black print:text-xl">
                Work Experience
              </h2>
              {formData.workExperience?.length ? (
                formData.workExperience.map((work, i) => (
                  <article key={i} className="mb-8 print:mb-4">
                    <div className="flex justify-between border-l-4 border-gray-700 pl-5 py-1 mb-1 print:pl-3 print:mb-1">
                      <p className="font-semibold text-xl print:text-lg">{work.position}</p>
                      <p className="italic text-gray-700 print:text-black print:font-medium">{work.timeRange}</p>
                    </div>
                    <p className="text-gray-900 font-semibold mb-1 print:text-black">{work.company}</p>
                    {work.responsibilities?.length ? (
                      <ul className="list-disc list-inside text-gray-700 print:text-black">
                        {work.responsibilities.map((resp, idx) => (
                          <li key={idx} className="mb-1">{resp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="italic text-gray-400 print:text-black">No description provided</p>
                    )}
                  </article>
                ))
              ) : (
                <p className="text-gray-400 italic print:text-black">No work experience info</p>
              )}
            </div>

            {/* Quiz Results */}
            {quizResults?.quizAttempts?.length > 0 && (
              <div>
                <h2 className="text-3xl font-extrabold mb-6 border-b-4 border-gray-600 pb-1 print:border-black print:text-xl">
                  Quiz Results
                </h2>
                <p className="mb-1 font-semibold text-gray-700 print:text-black">
                  Learning Type: {quizResults.learningType}
                </p>
                <p className="mb-4 font-semibold text-gray-700 print:text-black">
                  Points: {quizResults.learningTypePoints}
                </p>
                <table className="w-full border-collapse border border-gray-300 text-left text-gray-700 print:text-black rounded-md overflow-hidden">
                  <thead className="bg-gray-200 print:bg-gray-200">
                    <tr>
                      {["Topic", "Score", "Time Taken (s)", "Correct Answers", "Total Questions"].map((header) => (
                        <th
                          key={header}
                          className="border border-gray-300 p-3 font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {quizResults.quizAttempts.map((quiz, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white print:bg-white" : "bg-gray-50 print:bg-white"}
                      >
                        <td className="border border-gray-300 p-2">{prettifyFilename(quiz.filename)}</td>
                        <td className="border border-gray-300 p-2">{quiz.score}</td>
                        <td className="border border-gray-300 p-2">{quiz.timeTaken}</td>
                        <td className="border border-gray-300 p-2">{quiz.correctAnswers}</td>
                        <td className="border border-gray-300 p-2">{quiz.totalQuestions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Controls */}
      <div className="mt-8 flex gap-4 justify-center flex-wrap">
        <label
          htmlFor="photo-upload"
          className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 select-none"
          title="Upload profile photo"
        >
          Upload Photo
          <input
            type="file"
            id="photo-upload"
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </label>

        <button
          onClick={handleDownloadPDF}
          className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300"
        >
          Download PDF
        </button>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease forwards;
        }
        @keyframes fadeIn {
          from {opacity:0; transform: translateY(10px);}
          to {opacity:1; transform: translateY(0);}
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
