# Optional test-only generator: pip install pypdf cryptography
from pypdf import PdfWriter
writer = PdfWriter(clone_from='tests/fixtures/text.pdf')
writer.encrypt('pacha-test', algorithm='AES-256')
writer.write('tests/fixtures/password.pdf')
