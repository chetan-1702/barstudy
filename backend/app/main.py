from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.exams import router as exams_router
from backend.app.api.resources import router as resources_router
from backend.app.api.study_sessions import router as study_sessions_router
from backend.app.api.subjects import router as subjects_router
from backend.app.api.tasks import router as tasks_router
from backend.app.db.database import Base, engine
from backend.app.models.user import User

Base.metadata.create_all(bind=engine)

from backend.app.db.database import SessionLocal


def create_development_user():
    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.id == 1).first()

        if not existing_user:
            user = User(
                name="Development User",
                email="dev@barstudy.local",
                inn_registered=False,
            )

            db.add(user)
            db.commit()
    finally:
        db.close()


create_development_user()

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

app.include_router(subjects_router)
app.include_router(exams_router)
app.include_router(tasks_router)
app.include_router(study_sessions_router)
app.include_router(resources_router)


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
