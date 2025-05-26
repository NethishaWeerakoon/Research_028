/* eslint-disable react/prop-types */
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Swal from "sweetalert2";

const UploadResume = ({ isOpen, closeDialog, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [experienceYears, setExperienceYears] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Missing File",
        text: "Please select a file.",
      });
      return;
    }
    if (!experienceYears) {
      Swal.fire({
        icon: "warning",
        title: "Missing Experience",
        text: "Please enter your experience years.",
      });
      return;
    }
    onSubmit({ file, experienceYears });
    // Optionally clear state after submission
    setFile(null);
    setExperienceYears("");
    closeDialog();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
        <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Select File:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Experience Years:</label>
          <input
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            placeholder="Enter experience years"
            className="border border-gray-300 rounded w-full px-2 py-1"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Submit
          </button>
          <button
            onClick={closeDialog}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default UploadResume;
