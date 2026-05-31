"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const FASTAPI_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/video-events/top`;

function formatTime(seconds) {
  if (!seconds) return "0s";

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
      .then((json) => {
        setData(Array.isArray(json) ? json.slice(0, 6) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold">Top Videos</h2>

          <p className="mt-2 text-muted-foreground">
            Aggregated viewership statistics across all tracked videos.
          </p>
        </div>

        <Link
          href="/top"
          className="rounded-xl border border-border px-5 py-3 hover:bg-accent"
        >
          View all
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <h3 className="text-2xl font-bold">No videos yet</h3>

          <p className="mt-3 text-muted-foreground">
            Start tracking a video to see statistics here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((video, index) => (
            <Link
              key={index}
              href={`/watch?v=${video.video_id}&t=0`}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  
                  #{index + 1}
                </div>

                <div className="text-xs text-muted-foreground">
                  {video.unique_views} viewers
                </div>
              </div>

              <div className="mb-4 overflow-hidden rounded-xl">
                <Image
                  src={`https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`}
                  alt={video.video_id}
                  width={480}
                  height={360}
                  className="h-48 w-full object-cover transition group-hover:scale-105"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Events
                  </p>

                  <p className="text-xl font-bold">{video.total_events}</p>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Max Watch
                  </p>

                  <p className="text-xl font-bold">
                    {formatTime(video.max_viewership)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
