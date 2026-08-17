from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResourceBase(BaseModel):
    subject_id: int
    exam_id: int | None = None
    title: str
    description: str | None = None


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(BaseModel):
    subject_id: int | None = None
    exam_id: int | None = None
    title: str | None = None
    description: str | None = None


class ResourceResponse(ResourceBase):
    id: int

    file_name: str
    file_type: str
    file_size: int

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
