from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ExamBase(BaseModel):
    subject_id: int
    name: str
    exam_date: date
    exam_type: str | None = None
    notes: str | None = None


class ExamCreate(ExamBase):
    pass


class ExamUpdate(BaseModel):
    subject_id: int | None = None
    name: str | None = None
    exam_date: date | None = None
    exam_type: str | None = None
    notes: str | None = None


class ExamResponse(ExamBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
