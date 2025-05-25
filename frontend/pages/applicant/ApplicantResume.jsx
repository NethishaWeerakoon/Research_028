import { Dialog } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

// Personality type descriptions for reference in the dialog
const personalityDescriptions = {
  INFJ: "The Advocate - Insightful and inspiring, seeks meaning and connection.",
  INTJ: "The Architect - Strategic and logical, loves planning and structure.",
  INTP: "The Thinker - Analytical and inventive, thrives on ideas and theories.",
};

const ApplicantResume = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState(null);

  // Fetch job details and recommended applicants when jobId changes
  useEffect(() => {
    if (!jobId) return;
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}jobs/${jobId}`
        );
        const jobData = await response.json();
        setJobDetails(jobData);
        // Build composite query text from jobData fields
        if (jobData.description) {
          const jobText = `${jobData.title}${jobData.description}${jobData.experienceYears}${jobData.requirements}`;
          fetchApplicants(jobText, jobData);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    // Fetch recommended applicants based on composite query text
    const fetchApplicants = async (queryText, jobData) => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }resumes/search-recommended-resume`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query_text: queryText, n_results: 200 }),
          }
        );
        const data = await response.json();

        // Transform API response into a structured format for UI
        const transformedApplicants = data
          .map((applicant) => {
            const userId = applicant.id;
            let status = null;

            // Only set status if the applicant is in one of these arrays
            if (jobData.acceptedUsers.includes(userId)) status = "Accepted";
            else if (jobData.rejectedUsers.includes(userId))
              status = "Rejected";
            else if (jobData.appliedUsers.includes(userId)) status = "Applied";
            else if (jobData.selectedUsers.includes(userId))
              status = "Selected";

            // Exclude applicants that don't have one of the statuses
            if (!status) return null;

            function formatDistancePercentage(distance) {
              if (distance === 0) {
                return 100.0;
              }
              const percentage = 100 * (1 / (1 + distance));
              return Number(percentage.toFixed(2));
            }

            return {
              id: userId,
              name: applicant.fullname,
              experienceYears: applicant.experienceYears,
              matching: formatDistancePercentage(applicant.distance),
              personalityLevel: applicant.personalityLevel,
              employeePersonalityLevel: applicant.employeePersonalityLevel,
              cvLink: applicant.s3CVLink,
              status,
            };
          })
          .filter(Boolean);

        setApplicants(transformedApplicants);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Open the personality description dialog
  const openDialog = (type) => {
    setSelectedPersonality(type);
    setIsOpen(true);
  };

  // Update applicant status
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}jobs/update-user-status/${jobId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            acceptedUsers: newStatus === "Accepted",
            rejectedUsers: newStatus === "Rejected",
            appliedUsers: newStatus === "Applied",
            selectedUsers: newStatus === "Selected",
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update applicant status");
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === userId
            ? { ...applicant, status: newStatus }
            : applicant
        )
      );
    } catch (error) {
      console.error("Error updating applicant status:", error);
    }
  };

  // Close the personality description dialog
  const closeDialog = () => {
    setIsOpen(false);
    setSelectedPersonality(null);
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
      <h1 className="text-4xl font-semibold text-blue-700 mb-8">
        Applicant List for {jobDetails?.title || "Job"}
      </h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-center">Experience Years</th>
              <th className="py-3 px-4 text-center">Personality Level</th>
              <th className="py-3 px-4 text-center">
                Employment Personality Level
              </th>
              <th className="py-3 px-4 text-center">Matching</th>
              <th className="py-3 px-4 text-center">View CV</th>
              <th className="py-3 px-4 text-center">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index) => (
              <tr
                key={applicant.id}
                className={`${
                  index % 2 === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-100`}
              >
                <td className="px-4 py-2 border">{applicant.name}</td>
                <td className="px-4 py-2 border text-center">
                  {applicant.experienceYears}
                </td>
                <td className="px-4 py-2 border">
                  {Object.entries(applicant.personalityLevel || {}).map(
                    ([key, value]) => (
                      <button
                        key={key}
                        onClick={() => openDialog(key)}
                        className="text-blue-600 underline mx-1"
                      >
                        {key}: {(parseFloat(value) * 100).toFixed(0)}%
                      </button>
                    )
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {Object.entries(applicant.employeePersonalityLevel || {}).map(
                    ([key, value]) => (
                      <button
                        key={key}
                        onClick={() => openDialog(key)}
                        className="text-blue-600 underline mx-1"
                      >
                        {key}: {(parseFloat(value) * 100).toFixed(0)}%
                      </button>
                    )
                  )}
                </td>
                <td className="px-4 py-2 border text-center">
                  {applicant.matching}
                </td>
                <td className="px-4 py-2 border text-center">
                  <a
                    href={applicant.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    📄 View
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  {applicant.status === "Accepted" ||
                  applicant.status === "Rejected" ? (
                    <span>{applicant.status}</span>
                  ) : (
                    <select
                      className="border rounded px-2 py-1"
                      value={applicant.status}
                      onChange={(e) =>
                        handleStatusChange(applicant.id, e.target.value)
                      }
                    >
                      <option value="Applied">Applied</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Personality description modal */}
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
          <h2 className="text-xl font-bold">{selectedPersonality}</h2>
          <p className="mt-2">{personalityDescriptions[selectedPersonality]}</p>
          <button
            onClick={closeDialog}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default ApplicantResume;
