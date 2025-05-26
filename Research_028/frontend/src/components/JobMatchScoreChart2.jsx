// components/JobMatchScoreChart.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const JobMatchScoreChart = ({ jobs }) => {
  // Prepare data for the chart: map job titles and matching percentages
  const data = jobs.map((job) => ({
    name: job.title.length > 15 ? job.title.substring(0, 15) + "..." : job.title,
    matchPercentage: job.distance ? Number((100 * (1 / (1 + job.distance))).toFixed(2)) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
        <YAxis label={{ value: "Matching Percentage", angle: -90, position: 'insideLeft', offset: 10 }} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey="matchPercentage" fill="#6366F1" name="Job Matching Percentage" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default JobMatchScoreChart;
