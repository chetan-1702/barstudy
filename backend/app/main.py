from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.db.database import Base, engine

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BarStudy API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "BarStudy API",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}
