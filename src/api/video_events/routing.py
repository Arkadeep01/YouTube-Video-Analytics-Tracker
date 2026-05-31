from typing import Any, List, Optional
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Request, Depends, HTTPException

from sqlalchemy import func
from sqlmodel import Session, select

from api.utils import parse_int_or_fallback

from api.db.session import get_session
from api.watch_sessions.models import WatchSession
from .models import YouTubeWatchEvent, YouTubePlayerState, VideoStat

router = APIRouter()


def parse_bucket(bucket_param: str, time_col):
    unit = bucket_param.split()[-1].rstrip("s")
    trunc_map = {
        "minute": "minute", "minutes": "minute",
        "hour": "hour", "hours": "hour",
        "day": "day", "days": "day",
        "week": "week", "weeks": "week",
        "month": "month", "months": "month",
        "year": "year", "years": "year",
    }
    trunc_unit = trunc_map.get(unit, "day")
    return func.date_trunc(trunc_unit, time_col)


@router.post("/")
def create_video_event(request: Request, payload: YouTubePlayerState, session: Session = Depends(get_session)):
  headers = request.headers
  watch_session_id = headers.get('x-session-id')
  print('session id', watch_session_id)
  print()
  referer = headers.get("referer")
  data = payload.model_dump()
  obj = YouTubeWatchEvent(**data)
  obj.referer = referer
  print("POST ENDPOINT HIT")
  print(payload)

  obj.id = None

  if watch_session_id:
    watch_session_query = select(WatchSession).where(WatchSession.watch_session_id == watch_session_id)
    watch_session_obj = session.exec(watch_session_query).first()
    if watch_session_obj:
      obj.watch_session_id = watch_session_id
      watch_session_obj.last_active = datetime.now(timezone.utc)
      session.add(watch_session_obj)

  session.add(obj)
  session.commit()
  session.refresh(obj)
  print("SAVED EVENT:", obj.id)
  return obj


@router.get("/top", response_model=List[VideoStat])
def get_top_video_stats(
        request: Request,
        db_session: Session = Depends(get_session)
    ):
    params = request.query_params
    bucket_param = params.get("bucket") or "1 day"
    bucket = parse_bucket(bucket_param, YouTubeWatchEvent.time)
    hours_ago = parse_int_or_fallback(params.get("hours-ago"), fallback=10)
    hours_until = parse_int_or_fallback(params.get("hours-until"), fallback=0)
    start = datetime.now(timezone.utc) - timedelta(hours=hours_ago)
    end = datetime.now(timezone.utc) - timedelta(hours=hours_until)
    unique_views = func.count(func.distinct(YouTubeWatchEvent.watch_session_id)).label("unique_views")
    query = (
        select(  # pyright: ignore[reportCallIssue]
            bucket,
            YouTubeWatchEvent.video_id,
            func.count().label("total_events"),
            func.max(YouTubeWatchEvent.current_time).label("max_viewership"),
            func.avg(YouTubeWatchEvent.current_time).label("avg_viewership"),
            unique_views
        )
        .where(
            YouTubeWatchEvent.time > start,
            YouTubeWatchEvent.time <= end,
            YouTubeWatchEvent.video_state_label != "CUED",
        )
        .group_by(
            bucket,
            YouTubeWatchEvent.video_id
        )
        .order_by(
            bucket.desc(),
            func.max(YouTubeWatchEvent.current_time).desc(),
            YouTubeWatchEvent.video_id
        )

    )
    try:
        results = db_session.exec(query).fetchall()
    except:
        raise HTTPException(
            status_code=400,
            detail='Invalid query'
        )
    results = [
        VideoStat(
        time=x[0],
        video_id=x[1],
        total_events=x[2],
        max_viewership=x[3],
        avg_viewership=x[4],
        unique_views=x[5],
    ) for x in results]
    return results


@router.get("/{video_id}", response_model=List[VideoStat])
def get_video_stats(video_id: str, request: Request, session: Session = Depends(get_session)):
  params = request.query_params
  bucket_param = params.get("bucket") or "1 day"
  bucket = parse_bucket(bucket_param, YouTubeWatchEvent.time).label("bucket")
  hours_ago = parse_int_or_fallback(params.get("hours-ago"), fallback=24 * 31 * 3)
  hours_until = parse_int_or_fallback(params.get("hours-until"), fallback=0)
  start = datetime.now(timezone.utc) - timedelta(hours=hours_ago)
  end = datetime.now(timezone.utc) - timedelta(hours=hours_until)

  query = (
    select(
      bucket,
      YouTubeWatchEvent.video_id,
      func.count().label("total_events"),
      func.max(YouTubeWatchEvent.current_time).label("max_viewership"),
      func.avg(YouTubeWatchEvent.current_time).label("avg_viewership"),
      func.count(func.distinct(YouTubeWatchEvent.watch_session_id)).label("unique_views"),
    )
    .where (
      YouTubeWatchEvent.time > start,
      YouTubeWatchEvent.time < end,
      YouTubeWatchEvent.video_id == video_id
    )
    .group_by(
      bucket,
      YouTubeWatchEvent.video_id
    )
    .order_by(
      bucket,
      YouTubeWatchEvent.video_id
    )
  )
  print("=" * 50)
  print("VIDEO ID FROM URL:", video_id)

  all_rows = session.exec(
      select(YouTubeWatchEvent)
  ).all()

  print("TOTAL ROWS IN TABLE:", len(all_rows))

  all_video_ids = session.exec(
      select(YouTubeWatchEvent.video_id)
  ).all()

  print("VIDEO IDS IN DB:", all_video_ids[:20])

  matching_rows = session.exec(
      select(YouTubeWatchEvent)
      .where(YouTubeWatchEvent.video_id == video_id)
  ).all()

  print("MATCHING ROWS:", len(matching_rows))

  for row in matching_rows[:5]:
    print(
      "ID:",
      row.id,
      "VIDEO:",
      row.video_id,
      "TIME:",
      row.time,
      "CURRENT_TIME:",
      row.current_time,
    )

  print("=" * 50)

  try:
    results = session.exec(query).fetchall()
  except:
    raise HTTPException(
        status_code=400,
        detail='Invalid query'
    )

  results = [
    VideoStat(
    time=x[0],
    video_id=x[1],
    total_events=x[2],
    max_viewership=x[3],
    avg_viewership=x[4],
    unique_views=x[5],
  ) for x in results]
  return results
