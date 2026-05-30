"use client";

import TimeBucketSelector from "@/components/TimeBucketSelector";
import { useCallback, useEffect, useState } from "react";

const FASTAPI_ENDPOINT = "http://localhost:8002/api/video-events/";

function formatTime(seconds) {
  if (seconds < 0) return "-";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function MetricsTable({ videoId }) {
  const [bucket, setBucket] = useState(1);
  const [bucketUnit, setBucketUnit] = useState("weeks");
  const [hoursAgo, setHoursAgo] = useState(8760);
  const [hoursUntil, setHoursUntil] = useState(0);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const timeBucket = `${bucket} ${bucketUnit}`;
  const url = `${FASTAPI_ENDPOINT}${videoId}?bucket=${encodeURIComponent(timeBucket)}&hours-ago=${hoursAgo}&hours-until=${hoursUntil}`;

  const fetchData = useCallback(async () => {
    if (!videoId) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching URL:", url);

      const res = await fetch(url);

      console.log("Status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      console.log("API RESPONSE:", json);

      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, videoId]);

  useEffect(() => {
    async function loadData() {
      if (!videoId) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const res = await fetch(url);
  
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
  
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    loadData();
  }, [url, videoId]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <TimeBucketSelector
        bucket={bucket}
        setBucket={setBucket}
        bucketUnit={bucketUnit}
        setBucketUnit={setBucketUnit}
      />

      <div className="flex flex-wrap gap-4 items-end mb-4 mt-2">
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Watch Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Watch Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Sessions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                No data returned from API
              </td>
            </tr>
          ) : (
            data.map((val, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(val.time).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {val.total_events.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  {formatTime(val.max_viewership ?? 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(val.avg_viewership ?? 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {val.unique_views ?? 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}