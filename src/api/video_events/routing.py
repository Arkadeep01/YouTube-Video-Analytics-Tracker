from typing import List
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Request, Depends, HTTPException

from sqlalchemy import func
from sqlmodel import Session, select

from timescaledb.hyperfunctions import time_bucket
from timescaledb.utils import get_utc_now

from api.db.session import get_session
from .models import YouTubeWatchEvent, YouTubePlayerState, YouTubeWatchEventResponseModel, VideoStat

router = APIRouter()

@router.post("/")
def create_video_event(request: Request,payload: YouTubePlayerState, session: Session = Depends(get_session)):
  headers = request.headers
  watch_session_id = headers.get('x-session-id')
  print('session id', watch_session_id)
  print()
  referer = headers.get("referer")
  data = payload.model_dump()
  obj = YouTubeWatchEvent(**data)
  obj.referer = referer
  # print(data, referer)

# if watch_session_id:
#         watch_session_query = select(WatchSession).where(WatchSession.watch_session_id==watch_session_id)
#         watch_session_obj = db_session.exec(watch_session_query).first()
#         if watch_session_obj:
#             obj.watch_session_id = watch_session_id
#             watch_session_obj.last_active = get_utc_now()
#             db_session.add(watch_session_obj)
  if watch_session_id:
    obj.watch_session_id = watch_session_id
  
  session.add(obj)
  session.commit()
  session.refresh(obj)
  return obj