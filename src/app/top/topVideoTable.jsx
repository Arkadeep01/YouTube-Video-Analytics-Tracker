"use client";
import TimeBucketSelector from "@/components/TimeBucketSelector";
import useWatchSession from "@/hooks/useWatchSession";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const FASTAPI_ENDPOINT = "http://localhost:8002/api/video-events/top";

function formatTime(seconds) {
  if (seconds < 0) return "-";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function TopVideoTable() {
  const [bucket, setBucket] = useState(1);
  const [bucketUnit, setBucketUnit] = useState("weeks");
  const [hoursAgo, setHoursAgo] = useState(8760);
  const [hoursUntil, setHoursUntil] = useState(0);
  const timeBucket = `${bucket} ${bucketUnit}`;
  const url = `${FASTAPI_ENDPOINT}?bucket=${encodeURIComponent(timeBucket)}&hours-ago=${hoursAgo}&hours-until=${hoursUntil}`;
  const session_id = useWatchSession();
  const headers = {
    "Content-Type": "application/json",
    "X-Session-ID": session_id,
  };

  const fetcher = (url) =>
    fetch(url, { headers: headers }).then((res) => res.json());

  const { data, error, isLoading } = useSWR(url, fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <TimeBucketSelector
          bucket={bucket}
          setBucket={setBucket}
          bucketUnit={bucketUnit}
          setBucketUnit={setBucketUnit}
        />
        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-500 font-medium">From (hours ago)</label>
          <input
            type="number"
            value={hoursAgo}
            min="0"
            onChange={(e) => setHoursAgo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-28 text-right"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-500 font-medium">To (hours ago)</label>
          <input
            type="number"
            value={hoursUntil}
            min="0"
            onChange={(e) => setHoursUntil(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-28 text-right"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => { setHoursAgo(24); setHoursUntil(0); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >24h</button>
          <button
            onClick={() => { setHoursAgo(168); setHoursUntil(0); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >7d</button>
          <button
            onClick={() => { setHoursAgo(720); setHoursUntil(0); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >30d</button>
          <button
            onClick={() => { setHoursAgo(8760); setHoursUntil(0); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >1y</button>
        </div>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Video
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Events
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Max Watch Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Watch Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unique Sessions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((val, idx) => {
            const isTop = idx === 0;
            return (
              <tr
                className={`hover:bg-gray-50 ${isTop ? "bg-yellow-50" : ""}`}
                key={idx}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">
                  {isTop ? "🥇" : `#${idx + 1}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(val.time).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    href={`/watch?v=${val.video_id}&t=0`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {val.video_id}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {val.total_events.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  {formatTime(val.max_viewership)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(val.avg_viewership)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {val.unique_views}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
