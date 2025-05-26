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
            ? "Congratulations! You've been accepted for this role.Our hiring team will contact you shorlty"
            : "We're sorry, but you've been rejected for this role. Thank you for interesting for the job. Please stay connect eith us for future oppurtunities",
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loading />
        <p className="ml-4 text-lg text-gray-600">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-purple-100">
      {/* Header */}
      <h1 className="mb-8 text-4xl font-semibold text-purple-700">
        {jobDetails?.title || "Job Title"}
      </h1>
      <div className="flex items-center mb-4 space-x-4">
  <div className="flex items-center px-3 py-1 rounded-full bg-green-50">
    <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
    <span className="text-sm font-medium text-green-800">
      Accepted: {jobDetails?.acceptedUsers?.length || 0}
    </span>
  </div>
  <div className="flex items-center px-3 py-1 rounded-full bg-red-50">
    <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
    <span className="text-sm font-medium text-red-800">
      Rejected: {jobDetails?.rejectedUsers?.length || 0}
    </span>
  </div>
</div>

      {/* Applicants Table */}
      <div className="overflow-x-auto bg-white shadow-2xl rounded-xl">
        <table className="w-full min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-left text-white uppercase border-b border-purple-500 first:rounded-tl-xl">Name</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500">Emotion Level</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500">CV Link</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500">Video Link</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500 last:rounded-tr-xl">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Selected Users */}
            {applicants.selectedUsers.map((applicant, index) => (
              <tr
                key={applicant.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-purple-50 transition-colors duration-200 ease-in-out group`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 transition-colors duration-200 whitespace-nowrap group-hover:text-purple-900">{applicant.name}</td>
                <td className="px-6 py-4 text-sm text-center">
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

                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <a
                    href={applicant.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View CV
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <a
                    href={applicant.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    View Video
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <div className="flex justify-center gap-2">
                    {/* Reject Button */}
                    <button
                      onClick={() => handleDecision(applicant.id, false)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    {/* Select Button */}
                    <button
                      onClick={() => handleDecision(applicant.id, true)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-purple-50 transition-colors duration-200 ease-in-out group`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 transition-colors duration-200 whitespace-nowrap group-hover:text-purple-900">{applicant.name}</td>
                <td className="px-6 py-4 text-sm text-center">
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

                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <a
                    href={applicant.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View CV
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <a
                    href={applicant.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    View Video
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md">
                    Rejected
                  </span>
                </td>
              </tr>
            ))}

            {/* Applied Users */}
            {applicants.acceptedUsers.map((applicant, index) => (
              <tr
                key={applicant.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-purple-50 transition-colors duration-200 ease-in-out group`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 transition-colors duration-200 whitespace-nowrap group-hover:text-purple-900">{applicant.name}</td>
                <td className="px-6 py-4 text-sm text-center">
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

                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <a
                    href={applicant.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View CV
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <a
                    href={applicant.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
                    </svg>
                    View Video
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-md">
                    Accepted
                  </span>
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