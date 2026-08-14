from datetime import date, datetime

from pydantic import BaseModel


class InnProfileBase(BaseModel):
    registered: bool

    inn_name: str | None = None

    application_status: str | None = None

    intended_application_date: date | None = None

    joining_date: date | None = None

    membership_status: str | None = None

    important_dates: str | None = None

    documents: str | None = None

    notes: str | None = None


class InnProfileCreate(InnProfileBase):
    pass


class InnProfileResponse(InnProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
