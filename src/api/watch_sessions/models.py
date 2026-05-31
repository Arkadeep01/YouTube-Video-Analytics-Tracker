import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field, Column, DateTime
from sqlalchemy import text


def generate_session_id():
    return str(uuid.uuid4())


class WatchSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=text("now()")),
    )
    watch_session_id: str = Field(default_factory=generate_session_id, index=True)
    path: Optional[str] = Field(default="", index=True)
    referer: Optional[str] = Field(default="", index=True)
    video_id: Optional[str] = Field(default="", index=True)
    last_active: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))


class WatchSessionCreate(SQLModel, table=False):
    path: Optional[str] = Field(default="")
    video_id: Optional[str] = Field(default="", index=True)