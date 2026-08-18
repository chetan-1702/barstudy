import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.exams import router as exams_router
from backend.app.api.resources import router as resources_router
from backend.app.api.study_sessions import router as study_sessions_router
from backend.app.api.subjects import router as subjects_router
from backend.app.api.tasks import router as tasks_router

app = FastAPI(
    title="BarStudy API",
    description="Backend API for the BarStudy application",
    version="1.0.0",
)


frontend_url = os.getenv("FRONTEND_URL")

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

if frontend_url:
    allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(subjects_router)
app.include_router(exams_router)
app.include_router(tasks_router)
app.include_router(resources_router)
app.include_router(study_sessions_router)


@app.get("/")
def root():
    return {"message": "BarStudy API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
