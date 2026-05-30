from fastapi import APIRouter, Request, Depends
from sqlmodel import Session

from api.db.session import get_session
from .models import WatchSession, WatchSessionCreate

router = APIRouter()

# /api/video-events/
@router.post("/", response_model=WatchSession)
def create_watch_session(
        request: Request, 
        payload: WatchSessionCreate,
        db_session: Session = Depends(get_session)  
    ):
    headers = request.headers
    referer = headers.get("referer")
    # print(db_session)
    data = payload.model_dump()
    obj = WatchSession(**data)
    obj.referer = referer
    db_session.add(obj)
    db_session.commit()
    db_session.refresh(obj)
    print(obj)
    # print(data, referer)
    return obj