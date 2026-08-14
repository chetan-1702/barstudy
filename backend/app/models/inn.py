from datetime import datetime, date

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class InnProfile(Base):
    __tablename__ = "inn_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    registered = Column(Boolean, nullable=False, default=False)

    inn_name = Column(String(150), nullable=True)

    application_status = Column(String(100), nullable=True)

    intended_application_date = Column(Date, nullable=True)

    joining_date = Column(Date, nullable=True)

    membership_status = Column(String(100), nullable=True)

    important_dates = Column(Text, nullable=True)

    documents = Column(Text, nullable=True)

    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="inn_profile",
    )
