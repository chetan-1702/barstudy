from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.resource import Resource
from backend.app.models.subject import Subject
from backend.app.schemas.resource import (
    ResourceCreate,
    ResourceResponse,
    ResourceUpdate,
)

router = APIRouter(
    prefix="/api/resources",
    tags=["resources"],
)


@router.get("", response_model=list[ResourceResponse])
def get_resources(
    db: Session = Depends(get_db),
):
    resources = db.scalars(select(Resource).order_by(Resource.created_at.desc())).all()

    return resources


@router.get(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = db.get(Resource, resource_id)

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    return resource


@router.post(
    "",
    response_model=ResourceResponse,
    status_code=201,
)
def create_resource(
    resource_data: ResourceCreate,
    db: Session = Depends(get_db),
):
    subject = db.get(
        Subject,
        resource_data.subject_id,
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    resource = Resource(**resource_data.model_dump())

    db.add(resource)
    db.commit()
    db.refresh(resource)

    return resource


@router.put(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def update_resource(
    resource_id: int,
    resource_data: ResourceUpdate,
    db: Session = Depends(get_db),
):
    resource = db.get(Resource, resource_id)

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    update_data = resource_data.model_dump(exclude_unset=True)

    if "subject_id" in update_data:
        subject = db.get(
            Subject,
            update_data["subject_id"],
        )

        if not subject:
            raise HTTPException(
                status_code=404,
                detail="Subject not found",
            )

    for key, value in update_data.items():
        setattr(resource, key, value)

    db.commit()
    db.refresh(resource)

    return resource


@router.delete(
    "/{resource_id}",
    status_code=204,
)
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = db.get(Resource, resource_id)

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    db.delete(resource)
    db.commit()
