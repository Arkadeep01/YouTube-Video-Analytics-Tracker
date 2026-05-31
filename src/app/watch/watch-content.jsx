"use client";

import { useSearchParams } from "next/navigation";
import WatchPageContent from "./watch-page-content";

export default function WatchContent() {
  const searchParams = useSearchParams();

  return (
    <WatchPageContent
      video_id={searchParams.get("v")}
      startTime={searchParams.get("t") || undefined}
    />
  );
}