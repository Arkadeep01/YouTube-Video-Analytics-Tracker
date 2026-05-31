"use client";

import { useCallback, useEffect, useState } from "react";

const FASTAPI_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/watch-sessions/`;
const API_WATCH_SESSION_STORAGE_KEY = "watch_session";

export default function useWatchSession(video_id) {
  // Lazy initialize from sessionStorage
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      const storedData = sessionStorage.getItem(API_WATCH_SESSION_STORAGE_KEY);
      if (!storedData) return null;
      const parsed = JSON.parse(storedData);
      return parsed.watch_session_id || null;
    } catch {
      return null;
    }
  });

  const createSession = useCallback(async () => {
    try {
      const response = await fetch(FASTAPI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: video_id || "",
        }),
      });

      if (!response.ok) {
        console.error("Failed to create watch session");
        console.error(await response.text());
        return;
      }

      const responseData = await response.json();
      sessionStorage.setItem(
        API_WATCH_SESSION_STORAGE_KEY,
        JSON.stringify(responseData),
      );

      setSessionId(responseData.watch_session_id);
    } catch (error) {
      console.error(error);
    }
  }, [video_id]);

  useEffect(() => {
    if (!sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      createSession();
    }
  }, [sessionId, createSession]);

  return sessionId;
}
