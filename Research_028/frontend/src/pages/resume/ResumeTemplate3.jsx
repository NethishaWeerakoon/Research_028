import { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import {
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

export default function ResumeTemplatePro() {
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
    <>
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Merriweather:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-10 flex flex-col items-center font-sans text-gray-900"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div
          id="resume-preview"
          className="bg-white max-w-6xl w-full rounded-3xl shadow-2xl border border-gray-300 overflow-hidden print:max-w-full print:shadow-none print:border-none animate-fadeIn"
          style={{ fontSize: "12pt", lineHeight: 1.6, fontFamily: "'Merriweather', serif" }}
        >
          {/* Header */}
          <header className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 text-white p-12 flex flex-col md:flex-row items-center gap-10 print:bg-white print:text-black print:p-6 rounded-t-3xl">
            <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-lg flex-shrink-0">
              {profilePhotoBase64 ? (
                <img
                  src={profilePhotoBase64}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center font-semibold text-2xl text-gray-600 select-none">
                  Photo
                </div>
              )}
            </div>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-6xl font-extrabold tracking-tight leading-tight print:text-3xl">
                {formData.firstName} {formData.lastName}
              </h1>
              <div className="mt-4 flex flex-col md:flex-row md:space-x-16 text-xl font-semibold print:text-base">
                {formData.email && (
                  <a
                    href={`mailto:${formData.email}`}
                    className="flex items-center gap-3 hover:underline print:text-black transition-colors duration-300"
                  >
                    <EnvelopeIcon className="w-7 h-7" />
                    {formData.email}
                  </a>
                )}
                {formData.contactNumber && (
                  <div className="flex items-center gap-3 print:text-black">
                    <PhoneIcon className="w-7 h-7" />
                    {formData.contactNumber}
                  </div>
                )}
                <div className="flex items-center space-x-8 print:text-black">
                  {formData.github && (
                    <a
                      href={formData.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:text-pink-300 transition-colors duration-300"
                    >
                      <LinkIcon className="w-7 h-7" /> GitHub
                    </a>
                  )}
                  {formData.linkedin && (
                    <a
                      href={formData.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:text-pink-300 transition-colors duration-300"
                    >
                      <LinkIcon className="w-7 h-7" /> LinkedIn
                    </a>
                  )}
                  {formData.portfolio && (
                    <a
                      href={formData.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:text-pink-300 transition-colors duration-300"
                    >
                      <LinkIcon className="w-7 h-7" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Body Content */}
          <main className="p-12 grid grid-cols-1 md:grid-cols-3 gap-16 print:p-6">
            {/* Left Column */}
            <section className="space-y-14 col-span-1 md:col-span-1">
              {/* Education */}
              <div>
                <h2 className="text-4xl font-extrabold mb-6 border-b-8 border-pink-500 pb-2 print:border-black print:text-2xl">
                  Education
                </h2>
                {formData.education?.length ? (
                  formData.education.map((edu, i) => (
                    <div
                      key={i}
                      className="mb-8 pl-6 border-l-8 border-pink-500 hover:border-pink-400 transition-colors duration-300 cursor-pointer rounded-md"
                    >
                      <p className="font-semibold text-xl print:text-lg">{edu.degree}</p>
                      <p className="text-gray-700 print:text-black text-lg">{edu.institution}</p>
                      <p className="italic text-pink-600 print:text-black">{edu.timeRange}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic print:text-black">No education info</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-4xl font-extrabold mb-6 border-b-8 border-indigo-600 pb-2 print:border-black print:text-2xl">
                  Skills
                </h2>
                <div className="bg-indigo-100 rounded-2xl p-6 space-y-6 print:bg-white shadow-md">
                  <div>
                    <h3 className="text-xl font-semibold print:text-lg text-indigo-900">Technical Skills</h3>
                    <p className="text-gray-800 whitespace-pre-wrap print:text-black text-lg">
                      {formData.technicalSkills || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold print:text-lg text-indigo-900">Soft Skills</h3>
                    <p className="text-gray-800 whitespace-pre-wrap print:text-black text-lg">
                      {formData.softSkills || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interests & Languages */}
              <div>
                <h2 className="text-4xl font-extrabold mb-6 border-b-8 border-cyan-600 pb-2 print:border-black print:text-2xl">
                  Interests & Languages
                </h2>
                <div className="bg-cyan-100 rounded-2xl p-6 space-y-6 print:bg-white shadow-md">
                  <div>
                    <h3 className="text-xl font-semibold print:text-lg text-cyan-900">Interests</h3>
                    <p className="text-gray-800 whitespace-pre-wrap print:text-black text-lg">
                      {formData.interests || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold print:text-lg text-cyan-900">Languages</h3>
                    <p className="text-gray-800 whitespace-pre-wrap print:text-black text-lg">
                      {formData.languages || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column */}
            <section className="col-span-1 md:col-span-2 space-y-14">
              {/* Work Experience */}
              <div>
                <h2 className="text-4xl font-extrabold mb-6 border-b-8 border-purple-700 pb-2 print:border-black print:text-2xl">
                  Work Experience
                </h2>
                {formData.workExperience?.length ? (
                  formData.workExperience.map((work, i) => (
                    <article key={i} className="mb-12 print:mb-6">
                      <div className="flex justify-between border-l-8 border-purple-700 pl-8 py-2 mb-2 print:pl-4 print:mb-2 rounded-md hover:border-purple-600 transition-colors duration-300 cursor-pointer">
                        <p className="font-semibold text-2xl print:text-lg">{work.position}</p>
                        <p className="italic text-purple-700 print:text-black print:font-medium">{work.timeRange}</p>
                      </div>
                      <p className="text-purple-900 font-semibold mb-3 print:text-black text-xl">{work.company}</p>
                      {work.responsibilities?.length ? (
                        <ul className="list-disc list-inside text-gray-800 print:text-black text-lg">
                          {work.responsibilities.map((resp, idx) => (
                            <li key={idx} className="mb-2">{resp}</li>
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
                  <h2 className="text-4xl font-extrabold mb-6 border-b-8 border-indigo-600 pb-2 print:border-black print:text-2xl">
                    Quiz Results
                  </h2>
                  <p className="mb-2 font-semibold text-indigo-700 print:text-black text-xl">
                    Learning Type: {quizResults.learningType}
                  </p>
                  <p className="mb-8 font-semibold text-indigo-700 print:text-black text-xl">
                    Points: {quizResults.learningTypePoints}
                  </p>
                  <table className="w-full border-collapse border border-gray-300 text-left text-gray-800 print:text-black rounded-xl overflow-hidden">
                    <thead className="bg-indigo-200 print:bg-gray-200">
                      <tr>
                        {["Topic", "Score", "Time Taken (s)", "Correct Answers", "Total Questions"].map((header) => (
                          <th
                            key={header}
                            className="border border-gray-300 p-4 font-semibold text-lg"
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
                          className={i % 2 === 0 ? "bg-white print:bg-white" : "bg-indigo-50 print:bg-white"}
                        >
                          <td className="border border-gray-300 p-3">{prettifyFilename(quiz.filename)}</td>
                          <td className="border border-gray-300 p-3">{quiz.score}</td>
                          <td className="border border-gray-300 p-3">{quiz.timeTaken}</td>
                          <td className="border border-gray-300 p-3">{quiz.correctAnswers}</td>
                          <td className="border border-gray-300 p-3">{quiz.totalQuestions}</td>
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
        <div className="mt-10 flex gap-6 justify-center flex-wrap">
          <label
            htmlFor="photo-upload"
            className="cursor-pointer bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-8 py-4 rounded-full shadow-xl transition duration-300 select-none"
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
            className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 hover:from-indigo-900 hover:via-purple-900 hover:to-pink-900 text-white font-semibold px-8 py-4 rounded-full shadow-xl transition duration-300"
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
    </>
  );
}
