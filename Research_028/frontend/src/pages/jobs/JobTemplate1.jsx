import { useEffect, useState, useRef } from "react";
import domtoimage from "dom-to-image";
import template1bg from "../../assets/job/template1bg.png";
import { useNavigate } from "react-router-dom";

const JobTemplate1 = () => {
  const navigate = useNavigate();
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-purple-100">
      {/* Job Post Section */}
      <div
        ref={jobPostRef}
        className="w-full max-w-3xl overflow-hidden bg-white rounded-lg shadow-lg"
      >
        {/* Header Section */}
        <div className="py-6 text-center text-white bg-emerald-500">
          <h1 className="text-4xl font-bold">WE ARE HIRING</h1>
          <h2 className="mt-2 text-2xl font-semibold">{jobData.title}</h2>
        </div>

        {/* Main Job Information */}
        <div className="p-6">
          <div className="mb-4 text-lg font-semibold">
            <p> Experience: {jobData.experience || "Not specified"}</p>
            <p> Contact Email: {jobData.email || "N/A"}</p>
            <p> Contact Number: {jobData.contactNumber || "N/A"}</p>
          </div>

          <div className="flex flex-col mb-4 text-justify">
            <h3 className="mb-2 text-xl font-semibold text-emerald-600">
              Description:
            </h3>
            <ul className="pl-5 space-y-1 text-gray-700 list-disc">
              {jobData.description || "Not specified"}
            </ul>
          </div>

          {/* Job Requirements */}
          <div className="mb-4">
            <h3 className="mb-2 text-xl font-semibold text-emerald-600">
              Requirements:
            </h3>
            <ul className="pl-5 space-y-1 text-gray-700 list-disc">
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
          className="p-6 text-center text-white bg-center bg-cover min-h-96"
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

      <div className="flex items-center justify-end gap-4 mt-6">
  <button
    onClick={() => navigate("/create-job")}
    className="px-6 py-2 text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700"
  >
    Edit
  </button>
  <button
    onClick={downloadAsImage}
    className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
  >
    Download as Image
  </button>
</div>

    </div>
  );
};

export default JobTemplate1;
