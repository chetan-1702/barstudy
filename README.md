# barstudy
# BarStudy

A focused study management and legal document research prototype for Bar Course students.

BarStudy is designed to provide a single place for students to organise their legal studies, track exams and study sessions, and work with searchable legal study materials.

The current version is intentionally lightweight. The goal of this prototype is to validate the core workflow with real users before adding more advanced functionality.

## Current Prototype

The current MVP provides:

* Subject management
* Exam management
* Study session tracking
* Task management
* Inn of Court information
* Legal resource management
* PDF/document upload
* Document metadata
* Document deletion
* Document viewing in the browser
* Automatic text extraction from uploaded documents
* Page-aware document chunking
* Search within individual legal documents
* Search results with:

  * Page number
  * Chunk number
  * Relevant extracted text
  * Search-term highlighting

## Core Workflow

The current resource workflow is:

```text
Upload legal document
        ↓
Extract document text
        ↓
Split text into page-aware chunks
        ↓
Store chunks in PostgreSQL
        ↓
Search document
        ↓
Return matching passages
        ↓
Open the original document
```

This provides the foundation for a future legal research and study assistant without requiring an LLM at this stage.

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* Alembic

### Database

* PostgreSQL

### Document Processing

The prototype currently supports document extraction and chunking for uploaded legal study materials.

Extracted content is stored in the `resource_chunks` table with:

* Resource ID
* Chunk index
* Page number
* Extracted content
* Creation timestamp

## Project Structure

```text
barstudy/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
├── frontend/
│   ├── app/
│   │   ├── resources/
│   │   ├── exams/
│   │   └── ...
│   └── src/
│       ├── services/
│       └── components/
│
├── alembic/
│   └── versions/
│
├── .gitignore
└── README.md
```

## Running the Project

### Backend

Activate the Python environment:

```bash
source .venv/bin/activate
```

Start the FastAPI backend:

```bash
uvicorn backend.app.main:app --reload --port 8000
```

The API will be available at:

```text
http://localhost:8000
```

### Frontend

From the frontend directory:

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

The frontend will then be available at:

```text
http://localhost:3001
```

## Database

The project uses PostgreSQL.

After configuring the database connection, run migrations with:

```bash
alembic upgrade head
```

## Testing Document Processing

The document extraction and chunking components can be tested independently.

From the project root:

```bash
python -m backend.test_document_extractor
```

and:

```bash
python -m backend.test_document_chunker
```

The chunking test verifies that extracted legal documents are divided into page-aware chunks suitable for document search.

## Current Search Approach

The current prototype deliberately uses a simple PostgreSQL text search approach rather than an LLM or vector database.

A search such as:

```text
ICT risk
```

returns document chunks containing the searched phrase.

This keeps the initial prototype:

* Simple
* Fast
* Explainable
* Easy to test
* Easy to debug

More advanced semantic search can be evaluated after the basic workflow has been validated with users.

## Prototype Scope

This version is an MVP and is not intended to be a complete legal research platform.

The immediate objective is to validate:

1. Whether students find the resource organisation useful.
2. Whether searching inside legal documents saves time.
3. Whether page-aware search results are useful during study.
4. Which additional features students actually need.

## Potential Future Development

Future versions may explore:

* Semantic/vector search
* Hybrid keyword + semantic search
* Legal document metadata improvements
* Document comparison
* Cross-document search
* Legal authority extraction
* Case and statute references
* Citation-aware search
* Study recommendations
* Spaced repetition
* Question generation
* LLM-assisted legal research
* Source-grounded answers with citations

These features are intentionally not part of the current MVP.

## Development Philosophy

BarStudy is being developed incrementally.

The priority is to establish a reliable and useful core product before introducing more complex AI functionality.

The current prototype therefore focuses on:

**Reliable data → reliable documents → reliable search → user validation → advanced features.**
