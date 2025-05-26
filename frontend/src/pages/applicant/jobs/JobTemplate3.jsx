import { useEffect, useState, useRef } from "react";
import domtoimage from "dom-to-image";
import template3bg from "../../assets/job/template3bg.png";

const JobTemplate3 = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r p-4 text-gray-900">
      {/* Job Post Section */}
      <div
        ref={jobPostRef}
        className="max-w-3xl w-full bg-white shadow-2xl rounded-lg overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-6 text-center">
          <h1 className="text-5xl font-bold drop-shadow-lg">WE ARE HIRING</h1>
          <h2 className="text-3xl mt-2 font-semibold drop-shadow-md">
            {jobData.title || "Job Title"}
          </h2>
        </div>

        {/* Main Job Information */}
        <div className="p-6">
          <div className="mb-4 text-lg font-semibold text-purple-800">
            <p>Experience: {jobData.experience || "Not specified"}</p>
            <p>Contact Email: {jobData.email || "N/A"}</p>
            <p>Contact Number: {jobData.contactNumber || "N/A"}</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Job Description */}
            <div className="">
              <h3 className="text-2xl font-semibold text-purple-600 mb-2">
                Description:
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {jobData.description}
              </ul>
            </div>

            {/* Job Requirements */}
            <div>
              <h3 className="text-2xl font-semibold text-purple-600 mb-2">
                Requirements:
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {jobData.requirements
                  ? jobData.requirements
                      .split(",")
                      .map((req, index) => <li key={index}>{req.trim()}</li>)
                  : "No requirements provided."}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Section with Colorful Background Image */}
        <div
          className="bg-cover bg-center text-white text-center p-6 min-h-96"
          style={{ backgroundImage: `url(${template3bg})` }}
        >
          <p className="text-2xl font-bold drop-shadow-lg text-purple-600">
            Send Your CV to{" "}
            <span className="underline">
              {jobData.email || "example@email.com"}
            </span>
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadAsImage}
        className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700"
      >
        Download as Image
      </button>
    </div>
  );
};

export default JobTemplate3;
