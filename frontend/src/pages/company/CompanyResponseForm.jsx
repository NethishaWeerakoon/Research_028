import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import background from "../../assets/background.png";

const CompanyResponseForm = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    jobTitle: "",
    employeeQualities: "",
  });

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}employee/get-employee-details/${userId}`
        );
        const employeeData = response.data.data[0]; 

        if (employeeData) {
          setFormData({
            employeeName: employeeData.userId.fullName || "",
            jobTitle: employeeData.position || "", 
            employeeQualities: "", 
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: err.response?.data?.message || "Error fetching employee details.",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchEmployeeDetails();
  }, [userId]);

  // Handle changes to the employeeQualities field only
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, employeeQualities: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}employee/update-employee-details`,
        {
          userId,
          employeeQualities: formData.employeeQualities,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message || "Employee details updated successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Error updating employee details.",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show a loading screen while fetching data
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
          Tell About Your Employee...
        </h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Employee Name (Read-Only) */}
          <div>
            <label className="block text-gray-600 mb-1">Employee Name</label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Job Title (Read-Only) */}
          <div>
            <label className="block text-gray-600 mb-1">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Employee Qualities (Editable) */}
          <div>
            <label className="block text-gray-600 mb-1">Employee Qualities</label>
            <textarea
              name="employeeQualities"
              value={formData.employeeQualities}
              onChange={handleChange}
              placeholder="Describe the employee qualities"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition duration-300 w-full"
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyResponseForm;
