"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

interface Props {
  open: number;
  closed: number;
  inProgress: number;
}

const IssueChart = ({ open, closed, inProgress }: Props) => {
  const data = [
    { label: "Open", value: open },
    { label: "In Progress", value: inProgress },
    { label: "Closed", value: closed },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="label">
          <YAxis />
        </XAxis>
        <Bar dataKey="value" barSize={60} style={{ fill: "var(--accent-9)" }} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IssueChart;
