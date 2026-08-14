from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SubjectCreate(BaseModel):
    name: str
    code: str | None = None
    description: str | None = None


class SubjectResponse(BaseModel):
    id: int
    name: str
    code: str | None
    description: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
