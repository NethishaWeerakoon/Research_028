// src/components/JobMatchScoreChart.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const JobMatchScoreChart = ({ jobs }) => {
  // Group jobs into score buckets (0-20, 21-40, ..., 81-100)
  const buckets = [0, 20, 40, 60, 80, 100];
  const data = buckets.map((start, i) => {
    const end = buckets[i + 1] || 100;
    const count = jobs.filter(job => {
      const score = job.distance === 0 ? 100 : 100 * (1 / (1 + job.distance));
      return score > start && score <= end;
    }).length;
    return {
      range: `${start + 1}-${end}`,
      count,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default JobMatchScoreChart;
