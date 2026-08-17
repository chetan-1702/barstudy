from pathlib import Path

from docx import Document
from pypdf import PdfReader

SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
}


class DocumentExtractionError(Exception):
    pass


def extract_text(file_path: str) -> str:
    """
    Extract text from a supported document.

    Currently supported:
    - PDF
    - DOCX

    Returns:
        Extracted text as a single string.

    Raises:
        DocumentExtractionError:
            If the file type is unsupported or extraction fails.
    """

    path = Path(file_path)

    if not path.exists():
        raise DocumentExtractionError(f"File not found: {file_path}")

    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise DocumentExtractionError(f"Unsupported file type: {extension}")

    try:
        if extension == ".pdf":
            return _extract_pdf(path)

        if extension == ".docx":
            return _extract_docx(path)

    except Exception as exc:
        raise DocumentExtractionError(
            f"Failed to extract text from {path.name}: {exc}"
        ) from exc

    raise DocumentExtractionError(f"Unsupported file type: {extension}")


def _extract_pdf(path: Path) -> str:
    reader = PdfReader(str(path))

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        text = text.strip()

        if text:
            pages.append(f"[Page {page_number}]\n{text}")

    return "\n\n".join(pages).strip()


def _extract_docx(path: Path) -> str:
    document = Document(str(path))

    paragraphs = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n\n".join(paragraphs).strip()
