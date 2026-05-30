import os
from contextlib import asynccontextmanager
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.db.session import init_db
from api.video_events.routing import router as video_events_router
from api.watch_sessions.routing import router as watch_sessions_router

HOST = os.environ.get("HOST")
HOST_SCHEME = os.environ.get("HOST_SCHEME")
HOST_PORT = os.environ.get("HOST_PORT")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if all([HOST, HOST_SCHEME, HOST_PORT]):
    origins.append(f"{HOST_SCHEME}://{HOST}:{HOST_PORT}")
    origins.append(f"{HOST_SCHEME}://{HOST}")

if not origins:
    origins = ["http://localhost:3000"]

print(f"[CORS] allow_origins = {origins!r}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # before app startup up
    init_db()
    yield
    # clean up


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video_events_router, prefix='/api/video-events')
app.include_router(watch_sessions_router, prefix='/api/watch-sessions')
# /api/events

@app.get("/")
def read_root():
    return {"Hello": "World my old friend"}


@app.get("/healthz")
def read_api_health():
    return {"status": "ok"}