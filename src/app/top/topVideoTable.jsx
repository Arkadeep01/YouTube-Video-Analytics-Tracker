"use client";

import TimeBucketSelector from "@/components/TimeBucketSelector";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const FASTAPI_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/video-events/top`;

function formatTime(seconds) {
  if (!seconds) return "0s";

  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);

  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function TopVideoTable() {
  const [bucket, setBucket] = useState(1);

  const [bucketUnit, setBucketUnit] = useState("days");

  const [hoursAgo, setHoursAgo] = useState(24);

  const [hoursUntil, setHoursUntil] = useState(0);

  const timeBucket = `${bucket} ${bucketUnit}`;

  const url =
    `${FASTAPI_ENDPOINT}?bucket=${encodeURIComponent(timeBucket)}` +
    `&hours-ago=${hoursAgo}` +
    `&hours-until=${hoursUntil}`;

  const fetcher = (url) => fetch(url).then((r) => r.json());

  const { data = [], error } = useSWR(url, fetcher);

  if (error) {
    return <div className="p-10">Failed to load</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-5xl font-bold">Top Videos</h1>

        <p className="mt-3 text-muted-foreground">
          Ranked by total tracked activity.
        </p>
      </div>

      {/* Filters */}

      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <TimeBucketSelector
            bucket={bucket}
            setBucket={setBucket}
            bucketUnit={bucketUnit}
            setBucketUnit={setBucketUnit}
          />

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              From (hours ago)
            </label>

            <input
              type="number"
              value={hoursAgo}
              onChange={(e) => setHoursAgo(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              To (hours ago)
            </label>

            <input
              type="number"
              value={hoursUntil}
              onChange={(e) => setHoursUntil(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3"
            />
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full">
          <thead className="bg-accent">
            <tr>
              <th className="px-4 py-4 text-left">Time</th>

              <th className="px-4 py-4 text-left">Video</th>

              <th className="px-4 py-4 text-right">Events</th>

              <th className="px-4 py-4 text-right">Max</th>

              <th className="px-4 py-4 text-right">Avg</th>

              <th className="px-4 py-4 text-right">Unique</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-accent/30"
              >
                <td className="px-4 py-4">
                  {new Date(item.time).toLocaleString()}
                </td>

                <td className="px-4 py-4">
                  <Link
                    href={`/watch?v=${item.video_id}&t=0`}
                    className="font-mono text-primary hover:underline"
                  >
                    {item.video_id}
                  </Link>
                </td>

                <td className="px-4 py-4 text-right">{item.total_events}</td>

                <td className="px-4 py-4 text-right">
                  {formatTime(item.max_viewership)}
                </td>

                <td className="px-4 py-4 text-right">
                  {formatTime(item.avg_viewership)}
                </td>

                <td className="px-4 py-4 text-right">{item.unique_views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
