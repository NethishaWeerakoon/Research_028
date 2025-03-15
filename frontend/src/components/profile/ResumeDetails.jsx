/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import UploadResumeDialog from "./UploadResume";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [personalityData, setPersonalityData] = useState([]);

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
      processPersonalityData(response.data.resumes);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const processPersonalityData = (resumes) => {
    if (resumes.length === 0) return;
    
    const personalityLevels = resumes[0].personalityLevel;
    const data = Object.entries(personalityLevels).map(([key, value]) => ({
      name: key,
      value: parseFloat(value) * 100,
    }));

    setPersonalityData(data);
  };

  const handleDialogSubmit = async ({ file, experienceYears }) => {
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("experienceYears", experienceYears);

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
      setMessage(response.data.message);
      fetchResumes();
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

  if (loading) {
    return (
      <div>
        <Loading />
        <p className="text-left text-gray-600">Loading resumes...</p>
      </div>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full mb-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 ">My Profile</h1>

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
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Full Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Email</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Experience (Years)</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">CV Link</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume._id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300 text-left">{resume.userId.fullName}</td>
                <td className="px-4 py-2 border border-gray-300 text-left">{resume.userId.email}</td>
                <td className="px-4 py-2 border border-gray-300 text-left">{resume.experienceYears}</td>
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

      {personalityData.length > 0 && (
        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Personality Distribution</h2>
          <ResponsiveContainer width={400} height={400}>
            <PieChart>
              <Pie
                data={personalityData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {personalityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ResumeDetails;