import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {flowNodes,flowEdges,exemptionEdge,returnEdge} from '../app/flow-model.js';

const hash=createHash('sha256').update(JSON.stringify({flowNodes,flowEdges,exemptionEdge,returnEdge})).digest('hex');
for(const name of ['APS_Exchange_Flowchart.pdf','APS_Exchange_Student_SOP.pdf']) {
  const pdf=(await readFile(new URL('../'+name,import.meta.url))).toString('latin1');
  if(!pdf.includes(`/FlowModelSHA256 (${hash})`)) throw new Error(`${name} is out of date. Run scripts/build-flowchart-pdfs.py before publishing.`);
}
const manifest=JSON.parse(await readFile(new URL('../documents-manifest.json',import.meta.url),'utf8'));
const word=await readFile(new URL('../APS_Exchange_Student_SOP.docx',import.meta.url));
if(manifest.flowModelSHA256!==hash||manifest.wordSHA256!==createHash('sha256').update(word).digest('hex')) {
  throw new Error('The Word guide is out of date. Run scripts/update-word-guide.py after generating the PDFs.');
}
console.log('Both PDFs and the Word guide match the current website flow model.');
