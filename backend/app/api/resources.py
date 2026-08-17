import os
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.models.exam import Exam
from backend.app.models.resource import Resource
from backend.app.models.resource_chunk import ResourceChunk
from backend.app.models.subject import Subject
from backend.app.schemas.resource import ResourceResponse, ResourceUpdate
from backend.app.services.document_chunker import chunk_text
from backend.app.services.document_extractor import (
    DocumentExtractionError,
    extract_text,
)
from backend.app.services.document_search import search_resource

router = APIRouter(
    prefix="/api/resources",
    tags=["resources"],
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
    resources = db.scalars(select(Resource).order_by(Resource.created_at.desc())).all()

    return resources


@router.get(
    "/{resource_id}/search",
)
def search_resource_chunks(
    resource_id: int,
    q: str,
    db: Session = Depends(get_db),
):
    resource = db.get(Resource, resource_id)

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    query = q.strip()

    if not query:
        return []

    chunks = search_resource(
        db=db,
        resource_id=resource_id,
        query=query,
    )

    return [
        {
            "chunk_id": chunk.id,
            "chunk_index": chunk.chunk_index,
            "page_number": chunk.page_number,
            "content": chunk.content,
        }
        for chunk in chunks
    ]


@router.get(
    "/{resource_id}/view",
)
def view_resource(
    resource_id: int,
    db: Session = Depends(get_db),
):
    resource = db.get(Resource, resource_id)

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    file_path = resource.file_path

    if not file_path:
        raise HTTPException(
            status_code=404,
            detail="Resource file not found",
        )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Resource file not found on disk",
        )

    return FileResponse(
        path=file_path,
        media_type=resource.file_type,
        headers={
            "Content-Disposition": "inline",
        },
    )


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
async def create_resource(
    subject_id: int = Form(...),
    title: str = Form(...),
    description: str | None = Form(None),
    exam_id: int | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # ---------------------------------------------------------
    # Validate subject
    # ---------------------------------------------------------

    subject = db.get(
        Subject,
        subject_id,
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found",
        )

    # ---------------------------------------------------------
    # Validate exam
    # ---------------------------------------------------------

    if exam_id is not None:
        exam = db.get(
            Exam,
            exam_id,
        )

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

    # ---------------------------------------------------------
    # Validate file
    # ---------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="A file is required",
        )

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are currently supported",
        )

    # ---------------------------------------------------------
    # Read uploaded file
    # ---------------------------------------------------------

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty",
        )

    # ---------------------------------------------------------
    # Generate unique filename
    # ---------------------------------------------------------

    extension = os.path.splitext(file.filename)[1].lower()

    stored_filename = f"{uuid.uuid4().hex}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        stored_filename,
    )

    # ---------------------------------------------------------
    # Save original file
    # ---------------------------------------------------------

    try:
        with open(
            file_path,
            "wb",
        ) as buffer:
            buffer.write(contents)

        # -----------------------------------------------------
        # Extract document text
        # -----------------------------------------------------

        try:
            extracted_text = extract_text(file_path)

        except DocumentExtractionError as exc:
            if os.path.exists(file_path):
                os.remove(file_path)

            raise HTTPException(
                status_code=400,
                detail=str(exc),
            ) from exc

        if not extracted_text.strip():
            if os.path.exists(file_path):
                os.remove(file_path)

            raise HTTPException(
                status_code=400,
                detail=(
                    "No readable text could be extracted " "from the uploaded document"
                ),
            )

        # -----------------------------------------------------
        # Create chunks
        # -----------------------------------------------------

        chunks = chunk_text(extracted_text)

        if not chunks:
            if os.path.exists(file_path):
                os.remove(file_path)

            raise HTTPException(
                status_code=400,
                detail=("The document could not be divided " "into searchable chunks"),
            )

        # -----------------------------------------------------
        # Create Resource
        # -----------------------------------------------------

        resource = Resource(
            subject_id=subject_id,
            exam_id=exam_id,
            title=title,
            description=description,
            file_name=file.filename,
            file_path=file_path,
            file_type=file.content_type,
            file_size=len(contents),
            created_at=datetime.utcnow(),
        )

        db.add(resource)

        # Flush so resource.id becomes available
        # before creating ResourceChunk records.
        db.flush()

        # -----------------------------------------------------
        # Create ResourceChunk records
        # -----------------------------------------------------

        for chunk in chunks:
            resource_chunk = ResourceChunk(
                resource_id=resource.id,
                chunk_index=chunk["chunk_index"],
                page_number=chunk["page_number"],
                content=chunk["content"],
                created_at=datetime.utcnow(),
            )

            db.add(resource_chunk)

        # -----------------------------------------------------
        # Commit everything together
        # -----------------------------------------------------

        db.commit()

        db.refresh(resource)

        return resource

    except HTTPException:
        db.rollback()
        raise

    except Exception as exc:
        db.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to process resource: {exc}",
        ) from exc


@router.put(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def update_resource(
    resource_id: int,
    resource_data: ResourceUpdate,
    db: Session = Depends(get_db),
):
    resource = db.get(
        Resource,
        resource_id,
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    update_data = resource_data.model_dump(exclude_unset=True)

    # ---------------------------------------------------------
    # Validate subject if being changed
    # ---------------------------------------------------------

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

    # ---------------------------------------------------------
    # Validate exam if being changed
    # ---------------------------------------------------------

    if "exam_id" in update_data:
        new_exam_id = update_data["exam_id"]

        if new_exam_id is not None:
            exam = db.get(
                Exam,
                new_exam_id,
            )

            if not exam:
                raise HTTPException(
                    status_code=404,
                    detail="Exam not found",
                )

            effective_subject_id = update_data.get(
                "subject_id",
                resource.subject_id,
            )

            if exam.subject_id != effective_subject_id:
                raise HTTPException(
                    status_code=400,
                    detail=("Exam does not belong to " "the selected subject"),
                )

    # ---------------------------------------------------------
    # Update
    # ---------------------------------------------------------

    for field, value in update_data.items():
        setattr(
            resource,
            field,
            value,
        )

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
    resource = db.get(
        Resource,
        resource_id,
    )

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

    from fastapi.responses import FileResponse

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
    resource = db.get(
        Resource,
        resource_id,
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    file_path = resource.file_path

    db.delete(resource)
    db.commit()

    if os.path.exists(file_path):
        os.remove(file_path)

    return {"message": "Resource deleted successfully"}
