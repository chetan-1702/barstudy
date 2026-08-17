from backend.app.services.document_extractor import extract_text

PDF_PATH = "/home/chetan/Downloads/DORA.pdf"


text = extract_text(PDF_PATH)

print("=" * 80)
print("EXTRACTED TEXT")
print("=" * 80)

print(text[:5000])

print("=" * 80)
print(f"Characters extracted: {len(text)}")
print("=" * 80)
