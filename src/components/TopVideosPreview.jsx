"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FASTAPI_ENDPOINT = "http://localhost:8002/api/video-events/top";

function formatTime(seconds) {
  if (seconds < 0) return "-";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function TopVideosPreview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${FASTAPI_ENDPOINT}?bucket=1+year&hours-ago=8760&hours-until=0`)
      .then((r) => r.json())
      .then((json) => { setData(Array.isArray(json) ? json.slice(0, 6) : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Top Videos</h2>
        <Link href="/top" className="text-sm text-blue-600 hover:text-blue-800">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((val, idx) => (
          <Link
            key={idx}
            href={`/watch?v=${val.video_id}&t=0`}
            className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}</span>
              <span className="text-sm font-mono text-gray-600 truncate">{val.video_id}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Watch Time: <strong className="text-gray-700">{formatTime(val.max_viewership)}</strong></span>
              <span>{val.total_events} events</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
