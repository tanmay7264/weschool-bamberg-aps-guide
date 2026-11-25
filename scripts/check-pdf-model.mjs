import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {flowNodes,flowEdges,exemptionEdge,returnEdge} from '../app/flow-model.js';

const hash=createHash('sha256').update(JSON.stringify({flowNodes,flowEdges,exemptionEdge,returnEdge})).digest('hex');
for(const name of ['APS_Exchange_Flowchart.pdf','APS_Exchange_Student_SOP.pdf']) {
  const pdf=(await readFile(new URL('../'+name,import.meta.url))).toString('latin1');
  if(!pdf.includes(`/FlowModelSHA256 (${hash})`)) throw new Error(`${name} is out of date. Run scripts/build-flowchart-pdfs.py before publishing.`);
}
console.log('Both PDFs match the current website flow model.');
