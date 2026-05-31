from typing import Optional
from datetime import datetime, timezone

from pydantic import BaseModel, Field as PydanticField
from sqlmodel import SQLModel, Field, Column, DateTime
from sqlalchemy import text

class YouTubeVideoData(BaseModel):
  title: str

class YouTubeWatchEvent(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
  time: datetime = Field(
    default_factory=lambda: datetime.now(timezone.utc),
    sa_column=Column(DateTime(timezone=True), server_default=text("now()")),
  )
  is_ready: bool
  video_id: str = Field(index=True)
  video_title: str
  current_time: float
  video_state_label: str
  video_state_value: int
  referer: Optional[str] = Field(default="", index=True)
  watch_session_id: Optional[str] = Field(index=True)


class YouTubePlayerState(SQLModel, table=False):
    is_ready: bool
    video_id: str = Field(index=True)
    video_title: str
    current_time: float
    video_state_label: str
    video_state_value: int


class YouTubeWatchEventResponseModel(SQLModel, table=False):
    id: int = Field(primary_key=True)
    video_id: str = Field(index=True)
    current_time: float
    time: datetime


class VideoStat(BaseModel):
    time: datetime
    video_id: str
    total_events: int
    max_viewership: Optional[float] = PydanticField(default=-1)
    avg_viewership: Optional[float] = PydanticField(default=-1)
    unique_views: Optional[int] = PydanticField(default=-1)