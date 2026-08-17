import os
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.exam import Exam
from backend.app.models.resource import Resource
from backend.app.models.subject import Subject
from backend.app.schemas.resource import ResourceResponse

router = APIRouter(
    prefix="/api/resources",
    tags=["Resources"],
)


UPLOAD_DIR = "backend/app/uploads"

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get(
    "",
    response_model=list[ResourceResponse],
)
def get_resources(
    db: Session = Depends(get_db),
):
    return db.query(Resource).order_by(Resource.created_at.desc()).all()


@router.get(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    return resource


@router.post(
    "",
    response_model=ResourceResponse,
)
async def upload_resource(
    subject_id: int = Form(...),
    title: str = Form(...),
    description: str | None = Form(None),
    exam_id: int | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Verify subject
    subject = db.query(Subject).filter(Subject.id == subject_id).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    # Verify exam if supplied
    if exam_id is not None:
        exam = db.query(Exam).filter(Exam.id == exam_id).first()

        if not exam:
            raise HTTPException(
                status_code=404,
                detail="Exam not found",
            )

        if exam.subject_id != subject_id:
            raise HTTPException(
                status_code=400,
                detail="Exam does not belong to the selected subject",
            )

    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are currently supported",
        )

    # Read file
    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty",
        )

    # Generate unique stored filename
    extension = os.path.splitext(file.filename or "")[1].lower()

    stored_filename = f"{uuid.uuid4().hex}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        stored_filename,
    )

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    resource = Resource(
        subject_id=subject_id,
        exam_id=exam_id,
        title=title,
        description=description,
        file_name=file.filename or stored_filename,
        file_path=file_path,
        file_type=file.content_type,
        file_size=len(contents),
    )

    db.add(resource)
    db.commit()
    db.refresh(resource)

    return resource


@router.get(
    "/{resource_id}/download",
)
def download_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    if not os.path.exists(resource.file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    return FileResponse(
        path=resource.file_path,
        filename=resource.file_name,
        media_type=resource.file_type,
    )


@router.delete(
    "/{resource_id}",
)
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    if os.path.exists(resource.file_path):
        os.remove(resource.file_path)

    db.delete(resource)
    db.commit()

    return {"message": "Resource deleted successfully"}
