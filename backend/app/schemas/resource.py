from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResourceBase(BaseModel):
    subject_id: int
    name: str
    resource_type: str
    url: str | None = None
    description: str | None = None


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(BaseModel):
    subject_id: int | None = None
    name: str | None = None
    resource_type: str | None = None
    url: str | None = None
    description: str | None = None


class ResourceResponse(ResourceBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
