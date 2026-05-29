from typing import Optional
from pydantic import BaseModel
from sqlmodel import SQLModel, Field

class YouTubeVideoData(BaseModel):
  title: str

class YouTubePlayerState(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  is_ready: bool 
  video_id: str = Field(index=True)
  video_title: str
  current_time: float
  video_state_label: str
  video_state_value: int