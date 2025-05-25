/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import {
  PieChart as MuiPieChart,
  pieArcLabelClasses,
} from "@mui/x-charts/PieChart";
import PersonalityDetails from "../../pages/learning/PersonalityDetails";
 
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE", "#FF6699"];

const getPieChartData = (personalityLevel) => {
  if (!personalityLevel) return [];
  return Object.entries(personalityLevel).map(([key, value], index) => {
    let numericValue = 0;
    if (typeof value === "string") numericValue = parseFloat(value.replace("%", ""));
    else if (typeof value === "number") numericValue = value;
    if (isNaN(numericValue)) numericValue = 0;
    return {
      id: index,
      label: key,
      value: numericValue,
      color: COLORS[index % COLORS.length],
    };
  });
};

const PieChartWithDetails = ({ employee }) => {
  const [hoveredPersonality, setHoveredPersonality] = useState(null);
  const pieData = getPieChartData(employee.employeePersonalityLevel);

  return (
    <div className="mb-10 flex flex-col items-center">
      <h3 className="text-lg font-medium text-gray-800 mb-2 text-center">
        {employee.employeeName}'s Personality Distribution
      </h3>

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
            innerRadius: 40,
            outerRadius: 100,
            paddingAngle: 2,
            onMouseOver: (_, { dataIndex }) => {
              const label = pieData[dataIndex]?.label;
              if (label) setHoveredPersonality(label);
            },
            onMouseOut: () => setHoveredPersonality(null),
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

      {hoveredPersonality && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-md border border-blue-200 w-full max-w-xl">
          <h4 className="text-lg font-semibold text-blue-700 mb-2">
            {employee.employeeName}'s Personality Type: {hoveredPersonality}
          </h4>
          <PersonalityDetails personalityType={hoveredPersonality} />
        </div>
      )}
    </div>
  );
};

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

    if (user?._id) fetchEmployeeDetails();
    else setLoading(false);
  }, [user?._id]);

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
          <SectionHeading title="Employee Details" />
          <Table
            headers={["Employee Name", "Position", "Employment Start Date", "Employment End Date"]}
            rows={employeeDetails.map((employee) => [
              employee.employeeName,
              employee.position,
              employee.employmentStartDate
                ? new Date(employee.employmentStartDate).toLocaleDateString("en-CA")
                : "N/A",
              employee.employmentEndDate
                ? new Date(employee.employmentEndDate).toLocaleDateString("en-CA")
                : "Present",
            ])}
          />

          {/* Personality Pie Charts */}
          <SectionHeading title="Personality Distribution" />
          {employeeDetails.map(
            (employee) =>
              employee.employeePersonalityLevel && (
                <PieChartWithDetails key={`personality-${employee._id}`} employee={employee} />
              )
          )}

          {/* Company Table */}
          <SectionHeading title="Company Details" />
          <Table
            headers={[
              "Company Name",
              "Company Email",
              "Company Phone",
              "Company Address",
              "HR Contact Name",
              "HR Contact Email",
              "Registration Number",
            ]}
            rows={employeeDetails.map((employee) => [
              employee.companyName,
              employee.companyEmail,
              employee.companyPhone,
              employee.companyAddress,
              employee.hrContactName,
              employee.hrContactEmail,
              employee.registrationNumber,
            ])}
          />
        </>
      ) : (
        <div className="text-center text-gray-600 mt-4">
          <p>You have no employee details.</p>
        </div>
      )}
    </div>
  );
};

const SectionHeading = ({ title }) => (
  <h2 className="text-2xl font-semibold text-left text-gray-700 mb-4">{title}</h2>
);

const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto mb-8">
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((heading, idx) => (
            <th
              key={idx}
              className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
          >
            {row.map((cell, cellIdx) => (
              <td key={cellIdx} className="px-4 py-2 border border-gray-300">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CompanyDetails;
