"""Export the website graph as a vector print map and replace the SOP's chart page."""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import math
import re
import shutil
import subprocess
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from pypdf import PdfReader, PdfWriter

REPO = Path(__file__).resolve().parent.parent
OUT = REPO.parent.parent / 'outputs'
BUILD = REPO.parent / 'flow-pdf-build'
BUILD.mkdir(exist_ok=True)
raw = subprocess.check_output(['node', '--input-type=module', '-e',
    "import {flowNodes,flowEdges,exemptionEdge,returnEdge} from './app/flow-model.js'; console.log(JSON.stringify({flowNodes,flowEdges,exemptionEdge,returnEdge}));"], cwd=REPO).strip()
model = json.loads(raw)
fingerprint = hashlib.sha256(raw).hexdigest()
BLUE, INK, MUTED, LINE, GOLD = map(HexColor, ['#2563EB', '#172F42', '#526477', '#66788B', '#936B13'])
URL = 'https://tanmay7264.github.io/weschool-bamberg-aps-guide/'


def render(page_number=None):
    stream = BytesIO()
    c = canvas.Canvas(stream, pagesize=(792, 612), invariant=True)
    c.setTitle('Your APS journey, mapped. - Print edition 2')
    c.setAuthor('Tanmay Narnaware')
    c.setFillColor(white)
    c.rect(0, 0, 792, 612, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 22)
    c.drawString(36, 581, 'Your APS journey, mapped.')
    c.setFont('Helvetica', 8.5)
    c.setFillColor(MUTED)
    c.drawString(36, 564, 'Germany Student Exchange | APS Process A | Printable version of the interactive journey map')
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(BLUE)
    c.drawRightString(756, 584, '12 STEPS / 3 CHAPTERS')
    scale, left, top = .55, (792 - 1180 * .55) / 2, 550

    def xy(x, y):
        return left + x * scale, top - y * scale

    def rect(x, y, w, h, fill, stroke=None, radius=16, line=1):
        c.setFillColor(fill)
        c.setStrokeColor(stroke or fill)
        c.setLineWidth(line * scale)
        px, py = xy(x, y + h)
        c.roundRect(px, py, w * scale, h * scale, radius * scale, fill=1, stroke=bool(stroke))

    def text(x, y, value, size=14, bold=False, color=INK):
        c.setFillColor(color)
        c.setFont('Helvetica-Bold' if bold else 'Helvetica', size * scale)
        c.drawString(*xy(x, y), value)

    def arrow(d, color=LINE, dashed=False):
        tokens = re.findall(r'[A-Za-z]|-?\d+(?:\.\d+)?', d)
        p, i, cur, previous = c.beginPath(), 0, (0, 0), (0, 0)
        while i < len(tokens):
            command = tokens[i]
            i += 1
            count = {'M': 2, 'H': 1, 'V': 1, 'Q': 4}[command]
            values = list(map(float, tokens[i:i + count]))
            i += count
            previous = cur
            if command == 'M':
                cur = tuple(values)
                p.moveTo(*xy(*cur))
            elif command in ['H', 'V']:
                cur = (values[0], cur[1]) if command == 'H' else (cur[0], values[0])
                p.lineTo(*xy(*cur))
            else:
                control, end = tuple(values[:2]), tuple(values[2:])
                a = tuple(cur[j] + 2 / 3 * (control[j] - cur[j]) for j in range(2))
                b = tuple(end[j] + 2 / 3 * (control[j] - end[j]) for j in range(2))
                p.curveTo(*xy(*a), *xy(*b), *xy(*end))
                previous, cur = control, end
        c.setStrokeColor(color)
        c.setLineWidth(2.4 * scale)
        c.setDash([5 * scale, 5 * scale] if dashed else [])
        c.drawPath(p)
        c.setDash([])
        end, prev = xy(*cur), xy(*previous)
        dx, dy = end[0] - prev[0], end[1] - prev[1]
        length = math.hypot(dx, dy)
        dx, dy = dx / length, dy / length
        head = c.beginPath()
        head.moveTo(*end)
        for sign in [-1, 1]:
            head.lineTo(end[0] - dx * 5 + sign * -dy * 2.4, end[1] - dy * 5 + sign * dx * 2.4)
        head.close()
        c.setFillColor(color)
        c.drawPath(head, fill=1, stroke=0)

    rect(12, 136, 1114, 660, HexColor('#CBD5DF'), HexColor('#BCC8D3'), 28)
    rect(12, 118, 1114, 660, HexColor('#F7F9FC'), HexColor('#E0E6ED'), 28)
    for y in [360, 596]:
        c.setStrokeColor(HexColor('#DCE4ED'))
        c.setLineWidth(.5)
        c.setDash([1, 4])
        c.line(*xy(24, y), *xy(1112, y))
    c.setDash([])
    for edge in model['flowEdges']:
        arrow(edge['d'], BLUE if edge['from'] in [5, 6, 7, 8] else LINE)
    arrow(model['exemptionEdge']['d'], GOLD, True)
    arrow(model['returnEdge']['d'], GOLD, True)
    arrow('M924 744V812', BLUE)
    text(34, 139, '01 / CONFIRM & COORDINATE', 14, True, MUTED)
    text(34, 365, '02 / PREPARE & REGISTER', 14, True, MUTED)
    text(294, 611, '03 / SUBMIT & FOLLOW THROUGH', 14, True, MUTED)
    text(492, 51, 'IF EXEMPTION IS CONFIRMED', 12, True, GOLD)
    rect(560, 276, 260, 23, HexColor('#F7F9FC'), radius=3)
    text(570, 291, 'PROCESS A / WORK IN PARALLEL', 12, True, MUTED)
    text(745, 625, 'APS VERIFIES', 12, True, MUTED)
    rect(704, 22, 330, 80, HexColor('#FFF8E8'), GOLD)
    text(724, 55, 'Exemption confirmed', 19, True)
    text(724, 81, 'Keep written evidence > visa preparation', 14, color=MUTED)
    c.linkURL(URL + '#step-2', (*xy(704, 102), *xy(1034, 22)), relative=0)
    for node in model['flowNodes']:
        x, y, n = node['x'], node['y'], node['n']
        rect(x + 3, y + 9, 220, 112, HexColor('#D9E2ED'), HexColor('#C9D4E0'))
        rect(x, y, 220, 112, white, GOLD if n == 2 else HexColor('#B8C8DB'), line=2 if n == 2 else 1.3)
        c.setFillColor(HexColor('#EBF2FF'))
        c.circle(*xy(x + 32, y + 32), 20 * scale, fill=1, stroke=0)
        text(x + 18, y + 39, f'{n:02}', 20, True, BLUE)
        text(x + 62, y + 37, node['owner'], 13.2, color=MUTED)
        text(x + 18, y + 75, node['title'][0], 21, True)
        text(x + 18, y + 100, node['title'][1], 21, True)
        c.linkURL(URL + f'#step-{n}', (*xy(x, y + 112), *xy(x + 220, y)), relative=0)
    rect(794, 812, 260, 68, HexColor('#EDF4FF'), BLUE)
    text(814, 840, 'Visa preparation', 19, True)
    text(814, 864, 'Use the confirmed evidence', 14, color=MUTED)
    c.linkURL(URL + '#step-12', (*xy(794, 880), *xy(1054, 812)), relative=0)
    c.saveState()
    c.translate(*xy(1160, 720))
    c.rotate(90)
    c.setFont('Helvetica-Bold', 12 * scale)
    c.setFillColor(GOLD)
    c.drawString(0, 0, 'MORE RECORDS? RETURN TO 05-06')
    c.restoreState()
    c.setFillColor(MUTED)
    c.setFont('Helvetica', 7.5)
    c.drawString(36, 44, 'Confirm the cohort route before registration or payment. Steps 3 and 4 can run in parallel.')
    c.drawString(36, 32, 'Click a numbered tile for full instructions online. Additional records requested? Return to steps 5 and 6.')
    c.setFont('Helvetica', 8)
    c.drawString(36, 16, 'Created by Tanmay Narnaware')
    c.setFont('Helvetica', 7)
    c.drawString(300, 16, 'Sources verified 24 November 2026 | Print edition 2')
    c.setFillColor(BLUE)
    c.drawRightString(756, 16, 'aps-india.de/checklists/')
    c.linkURL('https://aps-india.de/checklists/', (675, 13, 758, 24), relative=0)
    if page_number:
        c.setFillColor(MUTED)
        c.drawRightString(778, 16, str(page_number))
    c.save()
    stream.seek(0)
    return PdfReader(stream)


chart = render()
writer = PdfWriter()
writer.clone_document_from_reader(chart)
writer.add_metadata({'/Author': 'Tanmay Narnaware', '/FlowModelSHA256': fingerprint})
standalone = OUT / 'APS_Exchange_Flowchart.pdf'
writer.write(standalone)
sop = OUT / 'APS_Exchange_Student_SOP.pdf'
original = PdfReader(sop)
writer = PdfWriter()
writer.clone_document_from_reader(original)
page = writer.pages[1]
assert tuple(map(float, page.mediabox)) == (0., 0., 792., 612.)
page.replace_contents(None)
if '/Annots' in page:
    del page['/Annots']
page.merge_page(render(2).pages[0])
writer.add_metadata({'/Author': 'Tanmay Narnaware', '/FlowModelSHA256': fingerprint})
updated = BUILD / sop.name
writer.write(updated)
result = PdfReader(updated)
assert len(result.pages) == len(original.pages)
assert len(result.pages) >= 3
assert 'Your APS journey, mapped.' in result.pages[1].extract_text()
assert 'The Process A journey' not in result.pages[1].extract_text()
for i in range(len(original.pages)):
    if i != 1:
        assert result.pages[i].extract_text() == original.pages[i].extract_text()
assert all('Created by Tanmay Narnaware' in p.extract_text() for p in result.pages)
shutil.copy2(updated, sop)
for path in [standalone, sop]:
    shutil.copy2(path, REPO / path.name)
print('Updated the one-page vector map and SOP page 2 from the website flow model.')
print('All other SOP pages, credits and source notes are preserved.')
