from backend.app.services.document_chunker import chunk_text
from backend.app.services.document_extractor import extract_text

PDF_PATH = "/home/chetan/Downloads/DORA.pdf"


text = extract_text(PDF_PATH)

chunks = chunk_text(text)


print("=" * 80)
print("DOCUMENT CHUNKING TEST")
print("=" * 80)

print(f"Characters extracted: {len(text)}")
print(f"Chunks created: {len(chunks)}")

print("=" * 80)

for chunk in chunks[:5]:
    print(f"Chunk {chunk['chunk_index']} " f"| Page {chunk['page_number']}")

    print(chunk["content"][:500])

    print("-" * 80)
