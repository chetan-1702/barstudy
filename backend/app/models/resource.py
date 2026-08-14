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

    name = Column(String(255), nullable=False)

    resource_type = Column(String(100), nullable=False)

    url = Column(Text, nullable=True)

    description = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    subject = relationship(
        "Subject",
        back_populates="resources",
    )
