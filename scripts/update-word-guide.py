"""Keep the editable SOP's chart and creator credit aligned with the PDFs."""
from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
import json
import shutil
import subprocess
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pypdf import PdfReader
from PIL import Image

REPO = Path(__file__).resolve().parent.parent
OUT = REPO.parent.parent / 'outputs'
WORK = REPO.parent / 'word-sync'
WORK.mkdir(exist_ok=True)
NAME = 'Tanmay Narnaware'
FILE = 'APS_Exchange_Student_SOP.docx'
source = OUT / FILE
backup = WORK / 'before-update.docx'
if not backup.exists():
    shutil.copy2(source, backup)
pdf = PdfReader(OUT / 'APS_Exchange_Flowchart.pdf')
model_hash = pdf.metadata['/FlowModelSHA256']
chart_base = WORK / 'current-journey-map'
# Crop the diagram body from the same vector PDF, leaving Word's own heading/footer.
subprocess.run(['pdftoppm', '-singlefile', '-r', '300', '-x', '300', '-y', '267',
                '-W', '2708', '-H', '2025', '-png', str(OUT / 'APS_Exchange_Flowchart.pdf'),
                str(chart_base)], check=True)
image = chart_base.with_suffix('.png')
doc = Document(source)
original_body = [p.text for p in doc.paragraphs]
original_tables = [[cell.text for row in t.rows for cell in row.cells] for t in doc.tables]
assert len(doc.inline_shapes) == 1
shape = doc.inline_shapes[0]
rid = shape._inline.graphic.graphicData.pic.blipFill.blip.embed
image_part = str(doc.part.related_parts[rid].partname).lstrip('/')
width, height = Image.open(image).size
shape.width = Inches(9)
shape.height = round(Inches(9) * height / width)
shape._inline.docPr.set('descr', 'APS exchange journey with twelve steps, a confirmed exemption exit, parallel university tasks and a return to document preparation')
shape._inline.docPr.set('title', 'Current APS exchange journey map')
for paragraph in doc.paragraphs:
    if paragraph.text == 'The Process A journey':
        paragraph.runs[0].text = 'APS exchange journey'
        for run in paragraph.runs[1:]:
            run.text = ''
    if paragraph._p.xpath('.//w:drawing'):
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER

if not any(p.text == 'Created by ' + NAME for p in doc.paragraphs):
    credit = doc.paragraphs[3].insert_paragraph_before('Created by ' + NAME)
    credit.paragraph_format.space_after = Pt(7)
    for run in credit.runs:
        run.font.size = Pt(10)

for section in doc.sections:
    section.footer.is_linked_to_previous = False
    paragraph = section.footer.paragraphs[0]
    paragraph.clear()
    paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
    paragraph.paragraph_format.tab_stops.clear_all()
    paragraph.paragraph_format.tab_stops.add_tab_stop(
        section.page_width - section.left_margin - section.right_margin,
        WD_TAB_ALIGNMENT.RIGHT)
    paragraph.add_run('Created by ' + NAME)
    paragraph.add_run('\tVerified 24 November 2026  |  ')
    field = OxmlElement('w:fldSimple')
    field.set(qn('w:instr'), 'PAGE')
    paragraph._p.append(field)
    for run in paragraph.runs:
        run.font.size = Pt(8)
doc.core_properties.author = NAME
doc.core_properties.last_modified_by = NAME
temporary = WORK / FILE
doc.save(temporary)
# Replace the existing image part, so no obsolete chart remains in the package.
with ZipFile(temporary) as original, ZipFile(source, 'w') as target:
    for info in original.infolist():
        target.writestr(info, image.read_bytes() if info.filename == image_part else original.read(info.filename))
updated = Document(source)
updated_body = [p.text for p in updated.paragraphs]
assert [p for p in updated_body if p != 'Created by ' + NAME] == [
    'APS exchange journey' if p == 'The Process A journey' else p
    for p in original_body if p != 'Created by ' + NAME]
assert [[cell.text for row in t.rows for cell in row.cells] for t in updated.tables] == original_tables
assert updated.core_properties.author == NAME
assert all('Created by ' + NAME in s.footer.paragraphs[0].text for s in updated.sections)
with ZipFile(source) as archive:
    assert archive.read(image_part) == image.read_bytes()
shutil.copy2(source, REPO / FILE)
manifest = {'flowModelSHA256': model_hash, 'wordSHA256': sha256(source.read_bytes()).hexdigest(),
            'wordDiagramSHA256': sha256(image.read_bytes()).hexdigest(), 'author': NAME}
(REPO / 'documents-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Updated the Word chart, cover credit, section footers and author metadata.')
print('All other body text and table contents are unchanged.')
