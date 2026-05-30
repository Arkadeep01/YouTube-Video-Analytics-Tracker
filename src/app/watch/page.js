"use client";

import useWatchSession from "@/hooks/useWatchSession"
import useYouTubePlayer from "@/hooks/useYoutubePlayer"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect } from "react"
// import MetricsTable from "./metricsTable"

const FASTAPI_ENDPOINT = "http://localhost:8002/api/video-events/"

export default function WatchPage() {
  const searchParams = useSearchParams()
  const { v: video_id, t: startTime } = Object.fromEntries(searchParams)
  const session_id = useWatchSession(video_id)

  const playerElementId = "youtube-player"
  const playerState = useYouTubePlayer(video_id, playerElementId, startTime, 1500)

  const updateBackend = useCallback(async (currentPlayerState) => {
    const headers = {}
    if (session_id) {
      headers["X-Session-ID"] = session_id
    }

    try {
      const response = await fetch(FASTAPI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ ...currentPlayerState, video_id: video_id })
      })
      if (!response.ok) {
        console.log("[WatchPage] POST error:", await response.text())
      } else {
        const responseData = await response.json()
        console.log("[WatchPage] event saved, id:", responseData.id)
      }
    } catch (error) {
      console.log("[WatchPage] fetch failed:", error)
    }
  }, [video_id, session_id])

  useEffect(() => {
    if (!playerState.is_ready) {
      console.log("[WatchPage] blocked: !is_ready")
      return
    }
    if (playerState.video_state_label !== "PLAYING") {
      console.log("[WatchPage] blocked: state is", playerState.video_state_label)
      return
    }
    console.log("[WatchPage] posting event, session_id:", session_id)
    updateBackend(playerState)
  }, [playerState, session_id, updateBackend])

  return <>
    <div className="item-center w-[50vw] mx-auto h-full px-5">
      <div id="video-container" className="relative w-full">
        <div className="relative w-full pt-[56.25%] bg-black">
          <div id={playerElementId} className="absolute top-0 left-0 w-full h-full" />
        </div>
      </div>

      <h1 className='text-xl'>{playerState.video_title}</h1>
      {/* <MetricsTable videoId={video_id} /> */}
    </div>
  </>
}