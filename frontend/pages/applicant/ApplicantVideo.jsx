/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

const ApplicantVideo = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState({
    selectedUsers: [],
    rejectedUsers: [],
    acceptedUsers: [],
    
  });

  // Fetch job details and applicants together
  const fetchJobDetailsAndApplicants = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}resumes/${jobId}/applicants`
      );
      const { selectedUsers, rejectedUsers, acceptedUsers } = response.data;

      setApplicants({
        selectedUsers,
        rejectedUsers,
        acceptedUsers,
      });
      setJobDetails(response.data.jobDetails);
    } catch (error) {
      console.error("Error fetching job details and applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch job details and applicants on mount
  useEffect(() => {
    fetchJobDetailsAndApplicants();
  }, [jobId]);

  // Handle accept/reject of applicants
  const handleDecision = async (applicantId, accepted) => {
    try {
      // Send notification using axios
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}notification/accept-job`,
        {
          userId: applicantId,
          jobId: jobId,
          message: accepted
            ? "Congratulations! You've been accepted for this role."
            : "We're sorry, but you've been rejected for this role.",
          accepted: accepted,
        }
      );

      // Prepare status update payload
      const newStatus = accepted ? "Accepted" : "Rejected";
      const statusPayload = {
        userId: applicantId,
        acceptedUsers: newStatus === "Accepted",
        rejectedUsers: newStatus === "Rejected",
        appliedUsers: newStatus === "Applied",
        selectedUsers: newStatus === "Selected",
      };

      // Update user status using fetch
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}jobs/update-user-status/${jobId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(statusPayload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Update the applicant's status in the local state
      setApplicants((prevApplicants) => {
        return {
          selectedUsers: prevApplicants.selectedUsers.map((applicant) =>
            applicant.id === applicantId
              ? { ...applicant, status: newStatus }
              : applicant
          ),
          rejectedUsers: prevApplicants.rejectedUsers.map((applicant) =>
            applicant.id === applicantId
              ? { ...applicant, status: newStatus }
              : applicant
          ),
          acceptedUsers: prevApplicants.acceptedUsers.map((applicant) =>
            applicant.id === applicantId
              ? { ...applicant, status: newStatus }
              : applicant
          ),
        };
      });
    } catch (error) {
      console.error("Error updating applicant status:", error);
    } finally {
      fetchJobDetailsAndApplicants();
    }
  };

  // Show a loading screen while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loading />
        <p className="text-gray-600 text-lg ml-4">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {/* Header */}
      <h1 className="text-4xl font-semibold text-blue-700 mb-8">
        {jobDetails?.title || "Job Title"}
      </h1>
      <p className="text-gray-600 mb-4">
        Accepted Users: {jobDetails?.acceptedUsers?.length || 0} | Rejected
        Users: {jobDetails?.rejectedUsers?.length || 0}
      </p>

      {/* Applicants Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-center">Emotion Level</th>
              <th className="py-3 px-4 text-center">CV Link</th>
              <th className="py-3 px-4 text-center">Video Link</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {/* Selected Users */}
            {applicants.selectedUsers.map((applicant, index) => (
              <tr
                key={applicant.id}
                className={`${
                  index % 2 === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-100`}
              >
                <td className="px-4 py-2 border">{applicant.name}</td>
                <td className="px-4 py-2 border text-center">
                  {(() => {
                    try {
                      let emotionData = applicant.emotion;

                      if (!emotionData) {
                        console.warn(
                          "No emotion data available for applicant",
                          applicant
                        );
                        return "No emotion data";
                      }

                      // If emotionData is a string, try to parse it
                      if (typeof emotionData === "string") {
                        emotionData = JSON.parse(emotionData);
                      }

                      console.log("Parsed emotion data:", emotionData);

                      // Convert each value to a number in case they're not already
                      const total = Object.values(emotionData).reduce(
                        (sum, value) => {
                          return sum + Number(value);
                        },
                        0
                      );

                      if (total === 0) {
                        return "No emotion data";
                      }

                      return Object.entries(emotionData)
                        .map(([emotion, value]) => {
                          const percentage = (
                            (Number(value) / total) *
                            100
                          ).toFixed(2);
                          return `${emotion}: ${percentage}%`;
                        })
                        .join(", ");
                    } catch (error) {
                      console.error("Error processing emotion data:", error);
                      return "Error processing emotion data";
                    }
                  })()}
                </td>

                <td className="px-4 py-2 border text-center">
                  <a
                    href={applicant.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View CV
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  <a
                    href={applicant.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View Video
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  <div className="flex gap-1 justify-center">
                    {/* Reject Button */}
                    <button
                      onClick={() => handleDecision(applicant.id, false)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                    {/* Select Button */}
                    <button
                      onClick={() => handleDecision(applicant.id, true)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Select
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Rejected Users */}
            {applicants.rejectedUsers.map((applicant, index) => (
              <tr
                key={applicant.id}
                className={`${
                  index % 2 === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-100`}
              >
                <td className="px-4 py-2 border">{applicant.name}</td>
                <td className="px-4 py-2 border text-center">
                  {(() => {
                    try {
                      let emotionData = applicant.emotion;

                      if (!emotionData) {
                        console.warn(
                          "No emotion data available for applicant",
                          applicant
                        );
                        return "No emotion data";
                      }

                      // If emotionData is a string, try to parse it
                      if (typeof emotionData === "string") {
                        emotionData = JSON.parse(emotionData);
                      }

                      console.log("Parsed emotion data:", emotionData);

                      // Convert each value to a number in case they're not already
                      const total = Object.values(emotionData).reduce(
                        (sum, value) => {
                          return sum + Number(value);
                        },
                        0
                      );

                      if (total === 0) {
                        return "No emotion data";
                      }

                      return Object.entries(emotionData)
                        .map(([emotion, value]) => {
                          const percentage = (
                            (Number(value) / total) *
                            100
                          ).toFixed(2);
                          return `${emotion}: ${percentage}% (${percentage}%)`;
                        })
                        .join(", ");
                    } catch (error) {
                      console.error("Error processing emotion data:", error);
                      return "Error processing emotion data";
                    }
                  })()}
                </td>

                <td className="px-4 py-2 border text-center">
                  <a
                    href={applicant.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View CV
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  <a
                    href={applicant.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View Video
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  <span className="text-red-500">Rejected</span>
                </td>
              </tr>
            ))}

            {/* Applied Users */}
            {applicants.acceptedUsers.map((applicant, index) => (
              <tr
                key={applicant.id}
                className={`${
                  index % 2 === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-100`}
              >
                <td className="px-4 py-2 border">{applicant.name}</td>
                <td className="px-4 py-2 border text-center">
                  {(() => {
                    try {
                      let emotionData = applicant.emotion;

                      if (!emotionData) {
                        console.warn(
                          "No emotion data available for applicant",
                          applicant
                        );
                        return "No emotion data";
                      }

                      // If emotionData is a string, try to parse it
                      if (typeof emotionData === "string") {
                        emotionData = JSON.parse(emotionData);
                      }

                      console.log("Parsed emotion data:", emotionData);

                      // Convert each value to a number in case they're not already
                      const total = Object.values(emotionData).reduce(
                        (sum, value) => {
                          return sum + Number(value);
                        },
                        0
                      );

                      if (total === 0) {
                        return "No emotion data";
                      }

                      return Object.entries(emotionData)
                        .map(([emotion, value]) => {
                          const percentage = (
                            (Number(value) / total) *
                            100
                          ).toFixed(2);
                          return `${emotion}: ${percentage}% (${percentage}%)`;
                        })
                        .join(", ");
                    } catch (error) {
                      console.error("Error processing emotion data:", error);
                      return "Error processing emotion data";
                    }
                  })()}
                </td>

                <td className="px-4 py-2 border text-center">
                  <a
                    href={applicant.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View CV
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  <a
                    href={applicant.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View Video
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  <span className="text-green-500">Accepted</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantVideo;
