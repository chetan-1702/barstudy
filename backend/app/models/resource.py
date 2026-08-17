from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    exam_id = Column(
        Integer,
        ForeignKey("exams.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    title = Column(String(255), nullable=False)

    description = Column(Text, nullable=True)

    file_name = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    file_type = Column(String(100), nullable=False)

    file_size = Column(Integer, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    subject = relationship(
        "Subject",
        back_populates="resources",
    )

    exam = relationship(
        "Exam",
        back_populates="resources",
    )

    chunks = relationship(
        "ResourceChunk",
        back_populates="resource",
        cascade="all, delete-orphan",
    )
