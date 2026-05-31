"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function ActivityGraph({ data = [] }) {
  const graphData = data.map((row) => ({
    time: new Date(row.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    events: row.total_events,
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">Activity · last 30 min</h3>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={graphData}>
            <XAxis dataKey="time" tick={{ fill: "#888" }} />

            <Tooltip />

            <Bar dataKey="events" radius={[8, 8, 0, 0]} fill="#ff0033" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
