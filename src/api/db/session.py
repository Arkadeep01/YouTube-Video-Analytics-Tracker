import os
import sqlmodel
import timescaledb
from sqlmodel import SQLModel, Session
from timescaledb import create_engine

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
  raise ValueError("DATABASE_URL needs to be set")

engine = create_engine(DATABASE_URL, timezone="utc")

def init_db():
  SQLModel.metadata.create_all(engine)
  timescaledb.metadata.create_all(engine)

def get_session():
  with Session(engine) as session:
    yield session