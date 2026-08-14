from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.subject import Subject
from backend.app.schemas.subject import SubjectCreate, SubjectResponse

router = APIRouter(
    prefix="/api/subjects",
    tags=["subjects"],
)


# Temporary development user.
# Authentication will replace this later.
DEVELOPMENT_USER_ID = 1


@router.get("", response_model=list[SubjectResponse])
def get_subjects(db: Session = Depends(get_db)):
    return (
        db.query(Subject)
        .filter(Subject.user_id == DEVELOPMENT_USER_ID)
        .order_by(Subject.name)
        .all()
    )


@router.post("", response_model=SubjectResponse, status_code=201)
def create_subject(
    subject: SubjectCreate,
    db: Session = Depends(get_db),
):
    new_subject = Subject(
        user_id=DEVELOPMENT_USER_ID,
        name=subject.name,
        code=subject.code,
        description=subject.description,
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return new_subject


@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = (
        db.query(Subject)
        .filter(
            Subject.id == subject_id,
            Subject.user_id == DEVELOPMENT_USER_ID,
        )
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    return subject


@router.delete("/{subject_id}", status_code=204)
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = (
        db.query(Subject)
        .filter(
            Subject.id == subject_id,
            Subject.user_id == DEVELOPMENT_USER_ID,
        )
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    db.delete(subject)
    db.commit()
