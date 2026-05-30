"""Seed the database with realistic dummy data for demo purposes.

Usage:
    python scripts/seed_data.py

Requires DATABASE_URL env var, or defaults to local non-Docker connection:
    postgresql+psycopg://time-user:time-pw@localhost:5432/timescaledb
"""

import os
import sys
import uuid
from datetime import datetime, timedelta, timezone

from sqlmodel import select, delete, true

_script_dir = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.dirname(_script_dir)
_src_candidate = os.path.join(_project_root, "src")
sys.path.insert(0, _src_candidate if os.path.isdir(_src_candidate) else _project_root)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://time-user:time-pw@localhost:5432/timescaledb",
)

from timescaledb import create_engine
from timescaledb.utils import get_utc_now
from sqlmodel import Session, SQLModel

engine = create_engine(DATABASE_URL, timezone="utc")

VIDEOS = [
    {"video_id": "dQw4w9WgXcQ", "title": "Rick Astley - Never Gonna Give You Up", "duration": 212},
    {"video_id": "9bZkp7q19f0", "title": "PSY - GANGNAM STYLE", "duration": 253},
    {"video_id": "kJQP7kiw5Fk", "title": "Luis Fonsi - Despacito ft. Daddy Yankee", "duration": 282},
    {"video_id": "JGwWNGJdvx8", "title": "Ed Sheeran - Shape of You", "duration": 263},
    {"video_id": "RgKAFK5djSk", "title": "Wiz Khalifa - See You Again ft. Charlie Puth", "duration": 237},
    {"video_id": "kXYiU_JCYtU", "title": "Nyan Cat (original)", "duration": 218},
]

def seed(force=False):
    import random
    random.seed(42)

    SQLModel.metadata.create_all(engine)
    import timescaledb
    timescaledb.metadata.create_all(engine)

    from ..src.api.video_events.models import YouTubeWatchEvent
    from ..src.api.watch_sessions.models import WatchSession

    with Session(engine) as session:
        existing = session.exec(
            select(YouTubeWatchEvent).limit(1)
        ).first()
        if existing:
            if not force:
                overwrite = input(
                    "Database already has data. Overwrite? (y/N): "
                ).strip().lower()
                if overwrite != "y":
                    print("Aborted.")
                    return
            session.exec(delete(YouTubeWatchEvent).where(true()))
            session.exec(delete(WatchSession).where(true()))
            session.commit()
            print("Cleared existing data.")

    print("Seeding database...")
    now = get_utc_now()

    engagement_tiers = {
        "dQw4w9WgXcQ": {"sessions": 6, "depth": "high"},    # popular, long watch
        "9bZkp7q19f0": {"sessions": 4, "depth": "medium"},
        "kJQP7kiw5Fk": {"sessions": 5, "depth": "high"},
        "JGwWNGJdvx8": {"sessions": 3, "depth": "low"},
        "RgKAFK5djSk": {"sessions": 4, "depth": "medium"},
        "kXYiU_JCYtU": {"sessions": 5, "depth": "high"},
    }

    depth_ranges = {
        "high":   (0.7, 1.0),
        "medium": (0.3, 0.7),
        "low":    (0.05, 0.3),
    }

    all_sessions = []
    all_events = []

    for v in VIDEOS:
        vid = v["video_id"]
        title = v["title"]
        dur = v["duration"]
        cfg = engagement_tiers[vid]
        lo, hi = depth_ranges[cfg["depth"]]

        for _ in range(cfg["sessions"]):
            wsid = str(uuid.uuid4())
            session_start = now - timedelta(
                hours=random.uniform(1, 168),
                minutes=random.uniform(0, 59),
            )

            watch_session = WatchSession(
                watch_session_id=wsid,
                path=f"/watch?v={vid}",
                video_id=vid,
                time=session_start,
                last_active=session_start + timedelta(minutes=random.uniform(1, 10)),
            )
            all_sessions.append(watch_session)

            base_time = session_start
            max_time = dur * random.uniform(lo, hi)
            num_events = random.randint(15, 60)
            states = ["PLAYING", "PLAYING", "PLAYING", "PAUSED", "PLAYING", "BUFFERING", "PLAYING", "ENDED"]

            for i in range(num_events):
                ts = base_time + timedelta(seconds=i * random.uniform(0.8, 2.5))
                progress = i / num_events
                current = min(max_time * progress + random.uniform(-2, 2), max_time)
                current = max(0, current)
                label = random.choice(states)
                state_value = {"PLAYING": 1, "PAUSED": 2, "BUFFERING": 3, "ENDED": 0}.get(label, 1)
                if i == num_events - 1:
                    label = "ENDED"
                    state_value = 0

                event = YouTubeWatchEvent(
                    is_ready=True,
                    video_id=vid,
                    video_title=title,
                    current_time=current,
                    video_state_label=label,
                    video_state_value=state_value,
                    watch_session_id=wsid,
                    time=ts,
                )
                all_events.append(event)

    with Session(engine) as session:
        for ws in all_sessions:
            session.add(ws)
        session.commit()
        print(f"  Inserted {len(all_sessions)} watch sessions")

        for ev in all_events:
            session.add(ev)
        session.commit()
        print(f"  Inserted {len(all_events)} watch events")

    print("\nDone! Summary:")
    print(f"  Videos: {len(VIDEOS)}")
    print(f"  Sessions: {len(all_sessions)}")
    print(f"  Events: {len(all_events)}")
    print(f"\nTop video by watch time should be visible at /top")

if __name__ == "__main__":
    force = "-f" in sys.argv or "--force" in sys.argv
    seed(force=force)
