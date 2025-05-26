import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";

const CompanyDetails = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        // Fetch employee details from the API
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}employee/get-employee-details/${
            user._id
          }`
        );
        setEmployeeDetails(response.data.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [user._id]);

  // Function to format personality levels for better readability
  const formatPersonalityLevels = (personalityLevel) => {
    return (
      Object.entries(personalityLevel)
        .map(
          ([key, value]) => `${key}: ${(parseFloat(value) * 100).toFixed(0)}%`
        )
        .join(", ") || "N/A"
    );
  };

  // Display loading indicator while fetching data
  if (loading) {
    return (
      <div>
        <Loading />
        <p className="text-left text-gray-600">Loading employee details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full mb-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Employee Details
      </h1>

      {/* Conditionally render table or message if no data is available */}
      {employeeDetails.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                  Position
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                  Registration Number
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                  Company Name
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                  Employment Personality Levels
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeDetails.map((employee) => (
                <tr key={employee._id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300 text-left">
                    {employee.position}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-left">
                    {employee.registrationNumber}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-left">
                    {employee.companyName}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-left">
                    {formatPersonalityLevels(employee.employeePersonalityLevel)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Display message if no employee details are available
        <div className="text-center text-gray-600 mt-4">
          <p>You have no employee details.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
