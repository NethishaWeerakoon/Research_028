/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import {
  PieChart as MuiPieChart,
  pieArcLabelClasses,
} from "@mui/x-charts/PieChart";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE", "#FF6699"];

const CompanyDetails = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}employee/get-employee-details/${user?._id}`
        );
        setEmployeeDetails(response.data.data || []);
      } catch (err) {
        console.error("Error fetching employee details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchEmployeeDetails();
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  const getPieChartData = (personalityLevel) => {
    if (!personalityLevel) return [];
    return Object.entries(personalityLevel).map(([key, value], index) => {
      let numericValue = 0;
      if (typeof value === "string") {
        numericValue = parseFloat(value.replace("%", ""));
      } else if (typeof value === "number") {
        numericValue = value;
      }
      if (isNaN(numericValue)) numericValue = 0;
      return {
        id: index,
        label: key,
        value: numericValue,
        color: COLORS[index % COLORS.length],
      };
    });
  };

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
                  {[
                    "Employee Name",
                    "Position",
                    "Employment Start Date",
                    "Employment End Date",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employeeDetails.map((employee) => (
                  <tr
                    key={`employee-${employee._id}`}
                    className="odd:bg-white even:bg-gray-50"
                  >
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.employeeName}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.position}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.employmentStartDate
                        ? new Date(employee.employmentStartDate).toLocaleDateString(
                            "en-CA"
                          )
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.employmentEndDate
                        ? new Date(employee.employmentEndDate).toLocaleDateString(
                            "en-CA"
                          )
                        : "Present"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Personality Levels Pie Chart */}
          <h2 className="text-2xl font-semibold text-left text-gray-700 mb-4">
            Personality Distribution
          </h2>
          {employeeDetails.map(
            (employee) =>
              employee.employeePersonalityLevel && (
                <div key={`personality-${employee._id}`} className="mb-10 flex justify-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2 text-center">
                      {employee.employeeName}'s Personality Distribution
                    </h3>
                    {(() => {
                      const pieData = getPieChartData(employee.employeePersonalityLevel);
                      return (
                        <MuiPieChart
                          series={[
                            {
                              data: pieData,
                              highlightScope: { fade: "global", highlight: "item" },
                              faded: {
                                innerRadius: 30,
                                additionalRadius: -20,
                                color: "gray",
                              },
                              // Removed arcLabel to disable text on slices
                            },
                          ]}
                          height={300}
                          width={400}
                          sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                              fill: "#333",
                              fontWeight: "bold",
                            },
                          }}
                        />
                      );
                    })()}
                  </div>
                </div>
              )
          )}

          {/* Company Table */}
          <h2 className="text-2xl font-semibold text-left text-gray-700 mb-4">
            Company Details
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {[
                    "Company Name",
                    "Company Email",
                    "Company Phone",
                    "Company Address",
                    "HR Contact Name",
                    "HR Contact Email",
                    "Registration Number",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employeeDetails.map((employee) => (
                  <tr
                    key={`company-${employee._id}`}
                    className="odd:bg-white even:bg-gray-50"
                  >
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.companyName}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.companyEmail}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.companyPhone}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.companyAddress}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.hrContactName}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.hrContactEmail}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {employee.registrationNumber}
                    </td>
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
