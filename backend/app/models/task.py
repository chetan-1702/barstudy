from datetime import datetime

from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    exam_id = Column(
        Integer,
        ForeignKey("exams.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    due_date = Column(
        Date,
        nullable=True,
    )

    priority = Column(
        String(20),
        nullable=False,
        default="Medium",
    )

    status = Column(
        String(20),
        nullable=False,
        default="Pending",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    subject = relationship(
        "Subject",
        back_populates="tasks",
    )

    exam = relationship(
        "Exam",
        back_populates="tasks",
    )
