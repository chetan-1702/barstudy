from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class TaskBase(BaseModel):
    subject_id: int
    title: str
    description: str | None = None
    due_date: date | None = None
    priority: str = "Medium"
    status: str = "Pending"
    exam_id: int | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    subject_id: int | None = None
    title: str | None = None
    description: str | None = None
    due_date: date | None = None
    priority: str | None = None
    status: str | None = None
    exam_id: int | None = None


class TaskResponse(TaskBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
