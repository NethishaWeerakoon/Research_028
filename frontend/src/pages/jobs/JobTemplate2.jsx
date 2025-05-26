import { useEffect, useState, useRef } from "react";
import domtoimage from "dom-to-image";
import template2bg from "../../assets/job/template2bg.jpg";

const JobTemplate2 = () => {
  const [jobData, setJobData] = useState({
    title: "",
    experience: "",
    email: "",
    contactNumber: "",
    description: "",
    requirements: "",
  });

  // Ref to capture the component for download
  const jobPostRef = useRef(null);

  useEffect(() => {
    const storedData =
      JSON.parse(localStorage.getItem("TempJobPostData")) || {};
    setJobData(storedData);
  }, []);

   // Function to capture and download the image
    const downloadAsImage = () => {
      domtoimage
        .toPng(jobPostRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "job-post.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => console.error("Error capturing image", error));
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-gray-200 bg-purple-100">
      {/* Job Post Section */}
      <div
        ref={jobPostRef}
        className="w-full max-w-3xl overflow-hidden bg-white rounded-lg shadow-2xl"
      >
        {/* Header Section */}
        <div className="py-6 text-center text-gray-800 bg-yellow-300">
          <h1 className="text-4xl font-bold text-gray-800">WE ARE HIRING</h1>
          <h2 className="mt-2 text-2xl font-semibold">{jobData.title}</h2>
        </div>

        {/* Main Job Information */}
        <div className="p-6">
          <div className="mb-4 text-lg font-semibold text-gray-800">
            <p>Experience: {jobData.experience || "Not specified"}</p>
            <p>Contact Email: {jobData.email || "N/A"}</p>
            <p>Contact Number: {jobData.contactNumber || "N/A"}</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Job Description */}
            <div className="">
              <h3 className="mb-2 text-xl font-semibold text-yellow-700">
                Description:
              </h3>
              <ul className="pl-5 space-y-1 text-gray-800 list-disc">
                {jobData.description}
              </ul>
            </div>

            {/* Job Requirements */}
            <div className="mb-4">
              <h3 className="mb-2 text-xl font-semibold text-yellow-700">
                Requirements:
              </h3>
              <ul className="pl-5 space-y-1 text-gray-800 list-disc">
                {jobData.requirements
                  ? jobData.requirements
                      .split(",")
                      .map((req, index) => <li key={index}>{req.trim()}</li>)
                  : "No requirements provided."}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Section with Dark Background Image */}
        <div
          className="p-6 text-center text-white bg-center bg-cover min-h-96"
          style={{ backgroundImage: `url(${template2bg})` }}
        >
          <p className="text-lg font-semibold text-gray-800">
            Send Your CV to{"  "}
            <span className="underline">
              {jobData.email || "example@email.com"}
            </span>
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadAsImage}
        className="px-6 py-2 mt-6 text-white rounded-lg shadow-lg bg-emerald-600 hover:bg-emerald-700"
      >
        Download as Image
      </button>
    </div>
  );
};

export default JobTemplate2;
