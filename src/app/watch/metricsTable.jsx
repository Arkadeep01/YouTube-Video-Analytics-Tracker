"use client";

import TimeBucketSelector from "@/components/TimeBucketSelector";
import { useCallback, useEffect, useState } from "react";

const FASTAPI_ENDPOINT = "http://localhost:8002/api/video-events/";

export default function MetricsTable({ videoId }) {
  const [bucket, setBucket] = useState(1);
  const [bucketUnit, setBucketUnit] = useState("weeks");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const timeBucket = `${bucket} ${bucketUnit}`;
  const url = `${FASTAPI_ENDPOINT}${videoId}?bucket=${encodeURIComponent(timeBucket)}`;

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

      <div className="my-4">
        <strong>Rows Returned:</strong> {data.length}
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-left">Total Events</th>
            <th className="px-6 py-3 text-left">Max Viewership</th>
            <th className="px-6 py-3 text-left">Avg Viewership</th>
            <th className="px-6 py-3 text-left">Unique Views</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                No data returned from API
              </td>
            </tr>
          ) : (
            data.map((val, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">
                  {new Date(val.time).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {val.total_events}
                </td>

                <td className="px-6 py-4">
                  {((val.max_viewership ?? 0) / 60).toFixed(2)}m
                </td>

                <td className="px-6 py-4">
                  {((val.avg_viewership ?? 0) / 60).toFixed(2)}m
                </td>

                <td className="px-6 py-4">
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