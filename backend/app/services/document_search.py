from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.resource_chunk import ResourceChunk


def search_resource(
    db: Session,
    resource_id: int,
    query: str,
    limit: int = 20,
):
    query = query.strip()

    if not query:
        return []

    # PostgreSQL case-insensitive search.
    statement = (
        select(ResourceChunk)
        .where(
            ResourceChunk.resource_id == resource_id,
            ResourceChunk.content.ilike(f"%{query}%"),
        )
        .order_by(ResourceChunk.chunk_index)
        .limit(limit)
    )

    return db.scalars(statement).all()
