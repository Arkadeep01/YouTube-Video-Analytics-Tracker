"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
  Cell,
} from "recharts";

export default function ActivityGraph({ data = [] }) {
  const now = new Date();

  const slots = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setMinutes(now.getMinutes() - (29 - i));
    d.setSeconds(0);
    d.setMilliseconds(0);

    return {
      time: d.getTime(),
      label:
        i === 0
          ? "30m ago"
          : i === 29
          ? "now"
          : "",
      events: 1, // minimum visible bar
      active: false,
    };
  });

  data.forEach((row) => {
    const t = new Date(row.time);
    t.setSeconds(0);
    t.setMilliseconds(0);

    const idx = slots.findIndex(
      (slot) => slot.time === t.getTime()
    );

    if (idx !== -1) {
      slots[idx].events = Math.max(row.total_events, 0);
      slots[idx].active = true;
    }
  });

  const maxValue = Math.max(
    ...slots.map((s) => s.events),
    10
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">
        Activity · last 30 min
      </h3>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={slots}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fill: "#888", fontSize: 12 }}
            />

            <YAxis hide domain={[0, maxValue]} />

            <Tooltip />

            <Bar
              dataKey="events"
              radius={[6, 6, 0, 0]}
              barSize={14}
            >
              {slots.map((entry, index) => (
                <Cell
                  key={index}
                  fill="#ff0033"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}