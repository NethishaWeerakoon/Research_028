/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import UploadResumeDialog from "./UploadResume";

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = user?._id;

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}resumes/${userId}`
      );
      setResumes(response.data.resumes);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Called when the dialog submits the file and experienceYears values.
  const handleDialogSubmit = async ({ file, experienceYears }) => {
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("experienceYears", experienceYears);

      // Call the new integrated endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}resumes/create-resume-pdf`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from createResumeUsingPDF:", response.data);
      setMessage(response.data.message);
      fetchResumes(); // Refresh resume list after upload
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(
        error.response?.data?.error || "Failed to upload resume."
      );
      setMessage(error.response?.data?.error || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const formatPersonalityLevels = (personalityLevel) => {
    return (
      Object.entries(personalityLevel)
        .map(
          ([key, value]) => `${key}: ${(parseFloat(value) * 100).toFixed(0)}%`
        )
        .join(", ") || "N/A"
    );
  };

  if (loading) {
    return (
      <div>
        <Loading />
        <p className="text-left text-gray-600">Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full mb-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 ">
        My Profile
      </h1>

      {/* Upload Resume Section using Dialog Popup */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      <UploadResumeDialog
        isOpen={isDialogOpen}
        closeDialog={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                Full Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                Email
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                Experience (Years)
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                Personality Level
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                CV Link
              </th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume._id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300 text-left">
                  {resume.userId.fullName}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-left">
                  {resume.userId.email}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-left">
                  {resume.experienceYears}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-left">
                  {formatPersonalityLevels(resume.personalityLevel)}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-left">
                  {resume.s3CVLink ? (
                    <a
                      href={resume.s3CVLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View CV
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResumeDetails;
