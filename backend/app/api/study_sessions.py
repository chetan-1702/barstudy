from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.study_session import StudySession
from backend.app.models.subject import Subject
from backend.app.schemas.study_session import (
    StudySessionCreate,
    StudySessionResponse,
    StudySessionUpdate,
)

router = APIRouter(
    prefix="/api/study-sessions",
    tags=["study-sessions"],
)


@router.get("", response_model=list[StudySessionResponse])
def get_study_sessions(
    db: Session = Depends(get_db),
):
    sessions = db.scalars(
        select(StudySession).order_by(StudySession.session_date.desc())
    ).all()

    return sessions


@router.get(
    "/{session_id}",
    response_model=StudySessionResponse,
)
def get_study_session(
    session_id: int,
    db: Session = Depends(get_db),
):
    session = db.get(StudySession, session_id)

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Study session not found",
        )

    return session


@router.post(
    "",
    response_model=StudySessionResponse,
    status_code=201,
)
def create_study_session(
    session_data: StudySessionCreate,
    db: Session = Depends(get_db),
):
    subject = db.get(
        Subject,
        session_data.subject_id,
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    if session_data.duration_minutes <= 0:
        raise HTTPException(
            status_code=400,
            detail="Duration must be greater than zero",
        )

    session = StudySession(**session_data.model_dump())

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.put(
    "/{session_id}",
    response_model=StudySessionResponse,
)
def update_study_session(
    session_id: int,
    session_data: StudySessionUpdate,
    db: Session = Depends(get_db),
):
    session = db.get(
        StudySession,
        session_id,
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Study session not found",
        )

    update_data = session_data.model_dump(exclude_unset=True)

    if "subject_id" in update_data:
        subject = db.get(
            Subject,
            update_data["subject_id"],
        )

        if not subject:
            raise HTTPException(
                status_code=404,
                detail="Subject not found",
            )

    if "duration_minutes" in update_data and update_data["duration_minutes"] <= 0:
        raise HTTPException(
            status_code=400,
            detail="Duration must be greater than zero",
        )

    for key, value in update_data.items():
        setattr(session, key, value)

    db.commit()
    db.refresh(session)

    return session


@router.delete(
    "/{session_id}",
    status_code=204,
)
def delete_study_session(
    session_id: int,
    db: Session = Depends(get_db),
):
    session = db.get(
        StudySession,
        session_id,
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Study session not found",
        )

    db.delete(session)
    db.commit()
