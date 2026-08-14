from sqlalchemy import Boolean, Column, Integer, String

from backend.app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    inn_registered = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    inn_name = Column(
        String(100),
        nullable=True,
    )
