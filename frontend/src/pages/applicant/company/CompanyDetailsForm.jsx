import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Loading from "../../components/Loading";
import background from "../../assets/background.png";

const CompanyDetailsForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userId: userId || "",
    companyName: "",
    companyEmail: "",
    registrationNumber: "",
    position: "",
  });

  // Update formData as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make a POST request to the API with the form data
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}employee/add-employee-details`,
        formData
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
      setFormData({
        userId: userId || "",
        companyName: "",
        companyEmail: "",
        registrationNumber: "",
        position: "",
      });
    } catch (err) {
      const errorMessage =
        err.response && err.response.data
          ? err.response.data.message
          : "Failed to submit form. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while form is being submitted
  if (loading) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        <Loading />
        <p className="text-center text-gray-600">Loading ...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Main Container */}
      <div className="bg-white bg-opacity-90 p-8 rounded-md shadow-lg w-3/4 md:w-2/3 lg:w-1/2">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Company Details
        </h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Input Fields */}
          {[
            { label: "Company Name", name: "companyName" },
            { label: "Company Email", name: "companyEmail" },
            { label: "Registration Number", name: "registrationNumber" },
            { label: "Position", name: "position" },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-gray-600 mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder="Enter here"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition duration-300 w-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
