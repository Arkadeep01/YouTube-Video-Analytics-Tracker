"use client";

import useWatchSession from "@/hooks/useWatchSession";
import useYouTubePlayer from "@/hooks/useYoutubePlayer";
import ActivityGraph from "@/components/ActivityGraph";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import MetricsTable from "./metricsTable";

const FASTAPI_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/video-events/`;

function WatchContent() {
  const searchParams = useSearchParams();

  const video_id = searchParams.get("v");
  const startTime = searchParams.get("t") || undefined;

  const [graphData, setGraphData] = useState([]);
  const session_id = useWatchSession(video_id);

  const playerElementId = "youtube-player";

  const playerState = useYouTubePlayer(
    video_id,
    playerElementId,
    startTime,
    1500
  );

  const updateBackend = useCallback(
    async (currentPlayerState) => {
      const headers = {};

      if (session_id) {
        headers["X-Session-ID"] = session_id;
      }

      try {
        const response = await fetch(FASTAPI_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({
            ...currentPlayerState,
            video_id,
          }),
        });

        if (!response.ok) {
          console.log(
            "[WatchPage] POST error:",
            await response.text()
          );
        }
      } catch (error) {
        console.log("[WatchPage] fetch failed:", error);
      }
    },
    [video_id, session_id]
  );

  useEffect(() => {
    if (!playerState.is_ready) return;
    if (playerState.video_state_label !== "PLAYING") return;

    updateBackend(playerState);
  }, [playerState, updateBackend]);

  useEffect(() => {
    async function loadGraph() {
      if (!video_id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/video-events/${video_id}?bucket=5%20minutes&hours-ago=1&hours-until=0`
        );

        if (!res.ok) return;

        const json = await res.json();

        setGraphData(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error(err);
      }
    }

    loadGraph();
  }, [video_id]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="p-6">
                <div
                  id="video-container"
                  className="relative w-full overflow-hidden rounded-xl border border-border"
                >
                  <div className="relative w-full pt-[56.25%] bg-black">
                    <div
                      id={playerElementId}
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h1 className="text-3xl font-bold">
                    {playerState.video_title || "Loading video..."}
                  </h1>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Video ID: {video_id}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href="/top"
                    className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent transition"
                  >
                    View all tracked videos →
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <ActivityGraph data={graphData} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-6 text-xl font-bold">
                Session
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Session ID
                  </span>

                  <span className="font-mono">
                    {session_id
                      ? `${session_id.slice(0, 8)}...`
                      : "Loading"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Status
                  </span>

                  <span className="text-green-500">
                    Active
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Player State
                  </span>

                  <span className="font-medium">
                    {playerState.video_state_label}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Current Time
                  </span>

                  <span className="font-mono">
                    {Math.floor(playerState.current_time || 0)}s
                  </span>
                </div>
              </div>
            </div>

            <MetricsTable videoId={video_id} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchContent />
    </Suspense>
  );
}