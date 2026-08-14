from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.inn import InnProfile
from backend.app.schemas.inn import InnProfileCreate, InnProfileResponse

router = APIRouter(
    prefix="/api/inn",
    tags=["Inn of Court"],
)


# Prototype user
# Later this will come from authentication.
PROTOTYPE_USER_ID = 1


@router.get(
    "",
    response_model=InnProfileResponse | None,
)
def get_inn_profile(
    db: Session = Depends(get_db),
):
    return db.query(InnProfile).filter(InnProfile.user_id == PROTOTYPE_USER_ID).first()


@router.post(
    "",
    response_model=InnProfileResponse,
)
def create_or_update_inn_profile(
    data: InnProfileCreate,
    db: Session = Depends(get_db),
):
    profile = (
        db.query(InnProfile).filter(InnProfile.user_id == PROTOTYPE_USER_ID).first()
    )

    if profile:
        for field, value in data.model_dump().items():
            setattr(profile, field, value)
    else:
        profile = InnProfile(
            user_id=PROTOTYPE_USER_ID,
            **data.model_dump(),
        )

        db.add(profile)

    db.commit()
    db.refresh(profile)

    return profile
