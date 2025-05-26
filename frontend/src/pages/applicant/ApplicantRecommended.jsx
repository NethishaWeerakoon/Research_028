import { Dialog, Transition } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import React, { Fragment } from 'react';

// Personality type descriptions for reference in the dialog
const personalityDescriptions = {
  INFJ: {
    description: "Insightful and inspiring, INFJs have a strong sense of integrity and drive to help others.",
    pros: ["Empathetic", "Organized", "Creative"],
    cons: ["Private", "Perfectionistic", "Sensitive"],
    careers: ["Psychologist", "Writer", "Counselor", "Advisor"],
    communication: "Thoughtful and deep; values meaningful conversations.",
    environment: "Prefers quiet, reflective, and purposeful workspaces.",
    growthTips: [
      "Practice sharing feelings with trusted people.",
      "Avoid self-criticism and perfectionism traps.",
    ],
  },
  INTJ: {
    description: "Strategic and logical, INTJs are independent thinkers who love solving complex problems.",
    pros: ["Analytical", "Confident", "Determined"],
    cons: ["Sometimes arrogant", "Insensitive", "Overly critical"],
    careers: ["Scientist", "Engineer", "Strategic Planner", "Developer"],
    communication: "Concise and logical; values efficiency in discussions.",
    environment: "Thrives in innovative, challenging, and autonomous settings.",
    growthTips: [
      "Be mindful of others' feelings and perspectives.",
      "Practice patience with less analytical people.",
    ],
  },
  INTP: {
    description: "Curious and analytical, INTPs love exploring ideas and theories.",
    pros: ["Innovative", "Logical", "Open-minded"],
    cons: ["Absent-minded", "Insensitive", "Indecisive"],
    careers: ["Philosopher", "Software Developer", "Scientist", "Architect"],
    communication: "Abstract and theoretical; enjoys debates and ideas.",
    environment: "Best in unstructured, idea-rich, and research-based settings.",
    growthTips: [
      "Be aware of emotional cues in others.",
      "Work on making timely decisions.",
    ],
  },
  ESTP: {
    description: "Energetic and perceptive, ESTPs love action and new experiences.",
    pros: ["Outgoing", "Resourceful", "Practical"],
    cons: ["Impulsive", "Insensitive", "Easily bored"],
    careers: ["Entrepreneur", "Paramedic", "Sales Executive", "Athlete"],
    communication: "Bold and spontaneous; enjoys fast-paced interactions.",
    environment: "Thrives in dynamic, hands-on, and high-stakes settings.",
    growthTips: [
      "Consider the long-term effects of quick decisions.",
      "Work on listening before acting.",
    ],
  },
};
const ApplicantRecommended = () => {
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
        // Create query text using title, description, experienceYears, and requirements
        const jobText = `${jobData.title}${jobData.description}${jobData.experienceYears}${jobData.requirements}`;
        fetchApplicants(jobText);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    // Fetch recommended applicants based on query text
    const fetchApplicants = async (queryText) => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }resumes/search-recommended-resume`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query_text: queryText, n_results: 20 }),
          }
        );
        const data = await response.json();

        // Transform API response into a structured format for UI
        const transformedApplicants = data.map((applicant) => {
          const userId = applicant.id;

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
            cvLink: applicant.filename,
          };
        });
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

  // Close the personality description dialog
  const closeDialog = () => {
    setIsOpen(false);
    setSelectedPersonality(null);
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
      <h1 className="mb-8 text-4xl font-semibold text-purple-900">
        Recommended List for {jobDetails?.title || "Job"}
      </h1>

      <div className="overflow-x-auto bg-white shadow-2xl rounded-xl">
        <table className="w-full min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-left text-white uppercase border-b border-purple-500 first:rounded-tl-xl">Name</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500">Experience Years</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500">Personality Level</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500">Employment Personality Level</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500">CV Matching Percentage</th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wider text-center text-white uppercase border-b border-purple-500 last:rounded-tr-xl">View CV</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applicants.map((applicant, index) => (
              <tr
                key={applicant.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-purple-50 transition-colors duration-200 ease-in-out group ${
                  index === applicants.length - 1 ? 'last:border-b-0' : ''
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 transition-colors duration-200 whitespace-nowrap group-hover:text-purple-900">
                  {applicant.name}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-center text-gray-700 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                    {applicant.experienceYears} years
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {Object.entries(applicant.personalityLevel || {}).map(
                      ([key, value]) => {
                        const percentage = parseFloat(value) * 100;
                        return (
                          <button
                            key={key}
                            onClick={() => openDialog(key)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-800 transition-colors duration-200 bg-indigo-100 border border-indigo-200 rounded-md hover:bg-indigo-200 hover:border-indigo-300"
                          >
                            {key}: {isNaN(percentage) ? "N/A" : `${percentage.toFixed(0)}%`}
                          </button>
                        );
                      }
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {Object.entries(applicant.employeePersonalityLevel || {}).map(
                      ([key, value]) => {
                        const percentage = parseFloat(value) * 100;
                        return (
                          <button
                            key={key}
                            onClick={() => openDialog(key)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-800 transition-colors duration-200 bg-purple-100 border border-purple-200 rounded-md hover:bg-purple-200 hover:border-purple-300"
                          >
                            {key}: {isNaN(percentage) ? "N/A" : `${percentage.toFixed(0)}%`}
                          </button>
                        );
                      }
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-16 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 transition-all duration-300 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                          style={{ width: `${Math.min(applicant.matching, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {applicant.matching}%
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  {applicant.cvLink ? (
                    <a
                      href={applicant.cvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition-colors duration-200 bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View
                    </a>
                  ) : (
                    <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-md">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                      No CV
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Personality description modal */}
 
      {/* Personality description modal */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeDialog}
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 transition-all transform bg-white rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-purple-700">
                  {selectedPersonality}
                </h2>
                <div className="mt-2 text-gray-700">
                  <p>{personalityDescriptions[selectedPersonality]?.description}</p>

                  <div className="mt-4">
                    <strong>Pros:</strong>
                    <ul className="ml-5 list-disc">
                      {personalityDescriptions[selectedPersonality]?.pros.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-2">
                    <strong>Cons:</strong>
                    <ul className="ml-5 list-disc">
                      {personalityDescriptions[selectedPersonality]?.cons.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-2">
                    <strong>Careers:</strong> {personalityDescriptions[selectedPersonality]?.careers.join(", ")}
                  </div>
                  <div className="mt-2">
                    <strong>Communication:</strong> {personalityDescriptions[selectedPersonality]?.communication}
                  </div>
                  <div className="mt-2">
                    <strong>Environment:</strong> {personalityDescriptions[selectedPersonality]?.environment}
                  </div>
                  <div className="mt-2">
                    <strong>Growth Tips:</strong>
                    <ul className="ml-5 list-disc">
                      {personalityDescriptions[selectedPersonality]?.growthTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={closeDialog}
                  className="px-4 py-2 mt-6 text-white bg-purple-500 rounded hover:bg-purple-600"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ApplicantRecommended;