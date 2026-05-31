"use client";

import TimeBucketSelector from "@/components/TimeBucketSelector";
import { useEffect, useState } from "react";

const FASTAPI_ENDPOINT = "http://localhost:8002/api/video-events/";

function formatTime(seconds) {
  if (!seconds) return "0s";

  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);

  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function MetricsTable({ videoId }) {
  const [bucket, setBucket] = useState(5);
  const [bucketUnit, setBucketUnit] = useState("minutes");

  const [hoursAgo] = useState(8760);
  const [hoursUntil] = useState(0);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeBucket = `${bucket} ${bucketUnit}`;

  const url =
    `${FASTAPI_ENDPOINT}${videoId}` +
    `?bucket=${encodeURIComponent(timeBucket)}` +
    `&hours-ago=${hoursAgo}` +
    `&hours-until=${hoursUntil}`;

  useEffect(() => {
    async function load() {
      if (!videoId) return;

      setLoading(true);

      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();

        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [url, videoId]);

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">Metrics</h3>

        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Auto Refresh
        </span>
      </div>

      <div className="mb-6">
        <TimeBucketSelector
          bucket={bucket}
          setBucket={setBucket}
          bucketUnit={bucketUnit}
          setBucketUnit={setBucketUnit}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-10 text-center text-muted-foreground">
          Loading metrics...
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase">Time</th>
                <th className="px-4 py-3 text-right text-xs uppercase">Events</th>
                <th className="px-4 py-3 text-right text-xs uppercase">Max</th>
                <th className="px-4 py-3 text-right text-xs uppercase">Avg</th>
                <th className="px-4 py-3 text-right text-xs uppercase">Unique</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No metrics found
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-border hover:bg-accent/20"
                  >
                    <td className="px-4 py-4 text-sm">
                      {new Date(item.time).toLocaleString()}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {item.total_events}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {formatTime(item.max_viewership)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {formatTime(item.avg_viewership)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {item.unique_views}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
