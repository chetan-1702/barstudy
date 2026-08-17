from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name = Column(String(150), nullable=False)

    code = Column(String(50), nullable=True)

    description = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="subjects",
    )

    exams = relationship(
        "Exam",
        back_populates="subject",
        cascade="all, delete-orphan",
    )

    tasks = relationship(
        "Task",
        back_populates="subject",
        cascade="all, delete-orphan",
    )

    study_sessions = relationship(
        "StudySession",
        back_populates="subject",
        cascade="all, delete-orphan",
    )

    resources = relationship(
        "Resource",
        back_populates="subject",
        cascade="all, delete-orphan",
    )

    