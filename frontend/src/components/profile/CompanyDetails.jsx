import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import { PieChart } from '@mui/x-charts/PieChart';

const CompanyDetails = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}employee/get-employee-details/${user._id}`
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

  const valueFormatter = (value) => `${(value * 100).toFixed(0)}%`;

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
        Employee & Company Details
      </h1>

      {employeeDetails.length > 0 ? (
        <>
          {/* Employee Table */}
          <h2 className="text-2xl font-semibold text-left text-gray-700 mb-4">
            Employee Details
          </h2>
          <div className="overflow-x-auto mb-8">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Employee Name</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Position</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Employment Start Date</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Employment End Date</th>
                </tr>
              </thead>
              <tbody>
                {employeeDetails.map((employee) => (
                  <tr key={employee._id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-300">{employee.employeeName}</td>
                    <td className="px-4 py-2 border border-gray-300">{employee.position}</td>
                    <td className="px-4 py-2 border border-gray-300">{new Date(employee.employmentStartDate).toLocaleDateString('en-CA')}</td>
                    <td className="px-4 py-2 border border-gray-300">{new Date(employee.employmentEndDate).toLocaleDateString('en-CA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Personality Levels as Pie Chart */}
          <h2 className="text-2xl font-semibold text-left text-gray-700 mb-4">
            Personality Distribution
          </h2>
          {employeeDetails.map((employee) =>
            employee.employeePersonalityLevel ? (
              <div key={`personality-${employee._id}`} className="mb-10">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {employee.employeeName}'s Personality Distribution
                </h3>
                <PieChart
                  series={[
                    {
                      data: Object.entries(employee.employeePersonalityLevel).map(([key, value]) => ({
                        id: key,
                        label: key,
                        value: parseFloat(value),
                      })),
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: 'gray',
                      },
                      valueFormatter,
                    },
                  ]}
                  width={400}
                  height={250}
                />
              </div>
            ) : null
          )}

          {/* Company Table */}
          <h2 className="text-2xl font-semibold text-left text-gray-700 mb-4">
            Company Details
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Company Name</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Company Email</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Company Phone</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Company Address</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">HR Contact Name</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">HR Contact Email</th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Registration Number</th>
                </tr>
              </thead>
              <tbody>
                {employeeDetails.map((employee) => (
                  <tr key={employee._id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-300">{employee.companyName}</td>
                    <td className="px-4 py-2 border border-gray-300">{employee.companyEmail}</td>
                    <td className="px-4 py-2 border border-gray-300">{employee.companyPhone}</td>
                    <td className="px-4 py-2 border border-gray-300">{employee.companyAddress}</td>
                    <td className="px-4 py-2 border border-gray-300">{employee.hrContactName}</td>
                    <td className="px-4 py-2 border border-gray-300">{employee.hrContactEmail}</td>
                    <td className="px-4 py-2 border border-gray-300">{employee.registrationNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600 mt-4">
          <p>You have no employee details.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
