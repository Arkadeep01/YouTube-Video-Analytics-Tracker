# YouTube Video Event Tracker

A full-stack time-series analytics platform that embeds YouTube videos and tracks **every** player event — play, pause, seek, progress, cue — storing them in TimescaleDB (PostgreSQL for time-series). Built with **Next.js** (frontend) and **FastAPI** (backend).

## What's Implemented

- **YouTube IFrame Player Integration** — embed any YouTube video via URL, with automatic start time support
- **Real-time Event Tracking** — captures all player state changes (UNSTARTED, PLAYING, PAUSED, BUFFERING, CUED, ENDED) at configurable intervals
- **Watch Sessions** — each viewer gets a unique session ID, linking all events in a single viewing session
- **Time-bucketed Analytics** — aggregate events by any time bucket (minutes, hours, days, weeks, months, years) with configurable lookback windows
- **Top Videos Dashboard** — ranked leaderboard of videos by watch time, event count, and unique viewers
- **Per-Video Metrics** — detailed stats per video with max/avg watch time, total events, and unique sessions over time
- **Seed Data Script** — populate the database with realistic demo data across multiple engagement tiers

## How It's Implemented

### Frontend (Next.js)

| File | Purpose |
|---|---|
| `src/hooks/useYoutubePlayer.jsx` | YouTube IFrame API integration — creates/destroys player, polls `currentTime` at intervals, exposes all state changes |
| `src/hooks/useWatchSession.jsx` | Creates a backend watch session on first load, stored in `sessionStorage` |
| `src/app/watch/page.js` | Embed page — loads player, posts events to FastAPI on every poll tick when PLAYING |
| `src/app/watch/metricsTable.jsx` | Time-bucketed event table per video with date range controls |
| `src/app/top/topVideoTable.jsx` | Top videos leaderboard with SWR-based data fetching |
| `src/app/page.js` | Home page with YouTube URL input form |
| `src/components/YouTubeUrlForm.jsx` | URL parser (extracts `v` and `t` params), redirects to `/watch` |
| `src/components/TimeBucketSelector.jsx` | Reusable time bucket picker (number + unit) |
| `src/components/TopVideosPreview.jsx` | Home page preview of top 6 videos |
| `src/lib/extractYouTubeInfo.js` | Regex-based YouTube URL parser |

### Backend (FastAPI + TimescaleDB)

| File | Purpose |
|---|---|
| `src/main.py` | FastAPI app with CORS, lifespan DB init, router mounts |
| `src/api/db/session.py` | SQLModel engine + session factory for TimescaleDB |
| `src/api/video_events/models.py` | `YouTubeWatchEvent` TimescaleModel (hypertable with 7-day chunk, 1-year retention, compression by `video_id`) |
| `src/api/video_events/routing.py` | POST event ingestion, GET per-video stats (time-bucketed), GET top videos |
| `src/api/watch_sessions/models.py` | `WatchSession` TimescaleModel (30-day chunks, 3-year retention) |
| `src/api/watch_sessions/routing.py` | POST create session |
| `src/scripts/seed_data.py` | Generates 6 videos with realistic watch patterns across 90 days |

### Data Flow

1. User pastes a YouTube URL → `extractYouTubeInfo` parses `videoId` & `startTime`
2. `/watch` page creates a **watch session** via `POST /api/watch-sessions/`
3. `useYouTubePlayer` initializes the **YouTube IFrame Player** in the `#youtube-player` div
4. A polling interval (default 1500ms) reads `player.getCurrentTime()` and `player.getPlayerState()`
5. On every poll tick **while PLAYING**, a `POST /api/video-events/` sends the current state (time, state label, video title, session ID)
6. Events are stored as **time-series rows** in the `youtubewatchevent` hypertable
7. The metrics table queries `GET /api/video-events/{video_id}` with `bucket`, `hours-ago`, `hours-until` params, returning aggregated stats via TimescaleDB's `time_bucket()`

### Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, SWR, YouTube IFrame API
- **Backend**: FastAPI, SQLModel, TimescaleDB, psycopg
- **Infrastructure**: TimescaleDB hypertables with automatic partitioning, compression, and data retention

## Benefits (If Integrated Into YouTube)

- **Creator Analytics at Granular Scale** — instead of coarse "views" and "watch time", creators see exact second-by-second engagement curves, pause hotspots, and drop-off points per viewer session
- **Session-level Debugging** — correlate every player event to a single viewing session to understand buffering issues, mid-video exits, and replay patterns
- **Custom Time Buckets** — analysts can zoom from per-minute spikes to yearly trends without pre-aggregated rollups
- **Real-time Feedback** — live event ingestion means creators see engagement data seconds after it happens, not hours later
- **Compression-friendly** — TimescaleDB's native compression (segmented by `video_id`, ordered by time) keeps storage costs low even at YouTube's scale of billions of events per day

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Docker (for TimescaleDB)

### Backend

```bash
# Start TimescaleDB
docker compose -f .env.compose up -d

# Install Python deps
pip install -r requirements.txt

# Seed demo data (optional)
python src/scripts/seed_data.py

# Start FastAPI
uvicorn src.main:app --reload --port 8002
```

### Frontend

```bash
cd video-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), paste a YouTube URL, and watch the events flow in.
