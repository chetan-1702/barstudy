from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class StudySessionBase(BaseModel):
    subject_id: int
    title: str
    session_date: date
    duration_minutes: int
    notes: str | None = None


class StudySessionCreate(StudySessionBase):
    pass


class StudySessionUpdate(BaseModel):
    subject_id: int | None = None
    title: str | None = None
    session_date: date | None = None
    duration_minutes: int | None = None
    notes: str | None = None


class StudySessionResponse(StudySessionBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
