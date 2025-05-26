import { useEffect, useState, useRef } from "react";
import domtoimage from "dom-to-image";
import template1bg from "../../assets/job/template1bg.png";

const JobTemplate1 = () => {
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
    const img = new Image();
    img.src = template1bg;
    img.onload = () => {
      setJobData(JSON.parse(localStorage.getItem("TempJobPostData")) || {});
    };
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Job Post Section */}
      <div
        ref={jobPostRef}
        className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-emerald-500 text-white py-6 text-center">
          <h1 className="text-4xl font-bold">WE ARE HIRING</h1>
          <h2 className="text-2xl mt-2 font-semibold">{jobData.title}</h2>
        </div>

        {/* Main Job Information */}
        <div className="p-6">
          <div className="mb-4 text-lg font-semibold">
            <p> Experience: {jobData.experience || "Not specified"}</p>
            <p> Contact Email: {jobData.email || "N/A"}</p>
            <p> Contact Number: {jobData.contactNumber || "N/A"}</p>
          </div>

          <div className="flex flex-col text-justify mb-4">
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">
              Description:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {jobData.description || "Not specified"}
            </ul>
          </div>

          {/* Job Requirements */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">
              Requirements:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {jobData.requirements
                ? jobData.requirements
                    .split(",")
                    .map((req, index) => <li key={index}>{req.trim()}</li>)
                : "No requirements provided."}
            </ul>
          </div>
        </div>

        {/* Footer Section with Background Image */}
        <div
          className="bg-cover bg-center text-white text-center p-6 min-h-96"
          style={{ backgroundImage: `url(${template1bg})` }}
        >
          <p className="text-lg font-semibold">
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
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700"
      >
        Download as Image
      </button>
    </div>
  );
};

export default JobTemplate1;
