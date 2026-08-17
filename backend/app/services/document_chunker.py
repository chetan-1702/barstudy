import re

PAGE_PATTERN = re.compile(r"\[Page\s+(\d+)\]")


def chunk_text(
    text: str,
    chunk_size: int = 1500,
    overlap: int = 250,
) -> list[dict]:
    """
    Split extracted document text into overlapping chunks.

    The extractor adds page markers such as:

        [Page 1]
        [Page 2]

    The chunker preserves those page numbers and performs
    basic text normalization before creating chunks.
    """

    if not text or not text.strip():
        return []

    pages = _split_into_pages(text)

    chunks = []

    global_chunk_index = 0

    for page_number, page_text in pages:

        cleaned = _clean_text(page_text)

        if not cleaned:
            continue

        page_chunks = _chunk_page(
            cleaned,
            chunk_size=chunk_size,
            overlap=overlap,
        )

        for chunk in page_chunks:
            chunks.append(
                {
                    "chunk_index": global_chunk_index,
                    "page_number": page_number,
                    "content": chunk,
                }
            )

            global_chunk_index += 1

    return chunks


def _split_into_pages(
    text: str,
) -> list[tuple[int | None, str]]:
    matches = list(PAGE_PATTERN.finditer(text))

    if not matches:
        return [(None, text)]

    pages = []

    for index, match in enumerate(matches):

        page_number = int(match.group(1))

        start = match.end()

        if index + 1 < len(matches):
            end = matches[index + 1].start()
        else:
            end = len(text)

        page_text = text[start:end]

        pages.append(
            (
                page_number,
                page_text,
            )
        )

    return pages


def _clean_text(
    text: str,
) -> str:
    """
    Normalize extracted PDF text.

    PDF extraction can sometimes introduce spaces inside words,
    for example:

        "f inancial" -> "financial"
        "r isk"      -> "risk"
        "g lobal"    -> "global"
        "w ork"      -> "work"
        "ICT"        -> "ICT"

    We repair obvious single-letter word splits while avoiding
    normal phrases such as "a system".
    """

    # Normalize whitespace first.
    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    # Repair sequences such as:
    #
    #   f inancial -> financial
    #   r isk      -> risk
    #   g lobal    -> global
    #   w ork      -> work
    #
    # Exclude "a" and "i" because these are commonly legitimate
    # standalone words.
    previous = None

    while previous != text:
        previous = text

        text = re.sub(
            r"\b([b-hj-zB-HJ-Z])\s+([a-zA-Z]{2,})\b",
            r"\1\2",
            text,
        )

    # Repair acronyms extracted as:
    #
    #   I C T -> ICT
    #   E U   -> EU
    #   I C T r isk -> ICT risk
    #
    # Only sequences consisting entirely of single-letter tokens
    # are affected here.
    while True:
        repaired = re.sub(
            r"\b([A-Za-z])\s+([A-Za-z])\b",
            r"\1\2",
            text,
        )

        if repaired == text:
            break

        text = repaired

    return text.strip()


def _chunk_page(
    text: str,
    chunk_size: int,
    overlap: int,
) -> list[str]:

    if len(text) <= chunk_size:
        return [text]

    chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(text):
            break

        start = end - overlap

    return chunks
