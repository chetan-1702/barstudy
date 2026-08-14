from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.exam import Exam
from backend.app.models.subject import Subject
from backend.app.schemas.exam import ExamCreate, ExamResponse, ExamUpdate

router = APIRouter(
    prefix="/api/exams",
    tags=["exams"],
)


@router.get("", response_model=list[ExamResponse])
def get_exams(db: Session = Depends(get_db)):
    exams = db.scalars(select(Exam).order_by(Exam.exam_date)).all()

    return exams


@router.get("/{exam_id}", response_model=ExamResponse)
def get_exam(
    exam_id: int,
    db: Session = Depends(get_db),
):
    exam = db.get(Exam, exam_id)

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Exam not found",
        )

    return exam


@router.post("", response_model=ExamResponse, status_code=201)
def create_exam(
    exam_data: ExamCreate,
    db: Session = Depends(get_db),
):
    subject = db.get(Subject, exam_data.subject_id)

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    exam = Exam(**exam_data.model_dump())

    db.add(exam)
    db.commit()
    db.refresh(exam)

    return exam


@router.put("/{exam_id}", response_model=ExamResponse)
def update_exam(
    exam_id: int,
    exam_data: ExamUpdate,
    db: Session = Depends(get_db),
):
    exam = db.get(Exam, exam_id)

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Exam not found",
        )

    update_data = exam_data.model_dump(exclude_unset=True)

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

    for key, value in update_data.items():
        setattr(exam, key, value)

    db.commit()
    db.refresh(exam)

    return exam


@router.delete("/{exam_id}", status_code=204)
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
):
    exam = db.get(Exam, exam_id)

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Exam not found",
        )

    db.delete(exam)
    db.commit()
