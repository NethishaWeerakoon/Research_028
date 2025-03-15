import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

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

      {employeeDetails.length > 0 ? (
        <div>
          <div className="overflow-x-auto mb-8">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">
                    Employee Name
                  </th>
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
                    Company Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeeDetails.map((employee) => (
                  <tr key={employee._id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-300 text-left">
                      {employee.userId.fullName}
                    </td>
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
                      {employee.companyEmail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-center">
            <ResponsiveContainer width={400} height={400}>
              <PieChart>
                <Pie
                  data={Object.entries(employeeDetails[0].employeePersonalityLevel).map(([key, value]) => ({
                    name: key,
                    value: parseFloat(value) * 100,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.keys(employeeDetails[0].employeePersonalityLevel).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(0)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-4">
          <p>You have no employee details.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
