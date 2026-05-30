"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

const useYouTubePlayer = (
  videoId,
  elementId = "video-player",
  startTime = 200,
  interval = 5000,
) => {
  const playerRef = useRef(null);

  const [playerState, setPlayerState] = useState({
    is_ready: false,
    current_time: 0,
    video_title: "",
    video_state_label: "",
    video_state_value: -1,
  });

  const handleOnStateChange = useCallback(() => {
    if (typeof window === "undefined" || !window.YT || !playerRef.current) {
      return;
    }

    // Ensure methods exist
    if (
      typeof playerRef.current.getVideoData !== "function" ||
      typeof playerRef.current.getCurrentTime !== "function"
    ) {
      return;
    }
    try {
      const YTPlayerStateObj = window.YT.PlayerState;
      const playerInfo = playerRef.current.playerInfo || {};
      const videoData = playerRef.current.getVideoData();
      const currentTimeSeconds = playerRef.current.getCurrentTime();
      const videoStateValue = playerInfo.playerState ?? -1;
      const video_state_label =
        getKeyByValue(YTPlayerStateObj, videoStateValue) || "UNSTARTED";
      setPlayerState((prev) => ({
        ...prev,
        video_title: videoData?.title || "",
        current_time: currentTimeSeconds || 0,
        video_state_label: video_state_label,
        video_state_value: videoStateValue,
      }));
    } catch (error) {
      console.error("YouTube Player Error:", error);
    }
  }, []);

  const handleOnReady = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      is_ready: true,
    }));

    handleOnStateChange();
  }, [handleOnStateChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializePlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(elementId, {
        height: "390",
        width: "640",
        videoId,
        playerVars: {
          playsinline: 1,
          start: startTime,
        },
        events: {
          onReady: handleOnReady,
          onStateChange: handleOnStateChange,
        },
      });
    };

    // Already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      );

      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, elementId, startTime, handleOnReady, handleOnStateChange]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleOnStateChange();
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, handleOnStateChange]);

  return playerState;
};

export default useYouTubePlayer;
