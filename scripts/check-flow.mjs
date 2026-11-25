import assert from 'node:assert/strict';
import {flowNodes,flowEdges,exemptionEdge,returnEdge,nextTourStep,firstUnfinished} from '../app/flow-model.js';

assert.deepEqual(flowNodes.map(n=>n.n).sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i+1));
assert(flowNodes.every(n=>n.x>=0&&n.x+220<=1180&&n.y+112<=910));
const edges=flowEdges.map(e=>`${e.from}>${e.to}`);
assert(edges.includes('2>3')&&edges.includes('2>4'),'Nomination and group instructions branch in parallel');
assert(!edges.includes('3>4'),'Do not turn parallel tasks into a dependency');
assert(edges.includes('3>5')&&edges.includes('4>5'),'Both university tasks feed the preparation path');
assert.deepEqual([exemptionEdge.from,exemptionEdge.to],[2,'exempt']);
assert.deepEqual([returnEdge.from,returnEdge.to],[12,5]);
for(let n=1;n<=12;n++) assert.equal(nextTourStep(n),n===12?null:n+1);
assert.equal(firstUnfinished({}),1);
assert.equal(firstUnfinished({'step-1':true,'step-2':true}),3);
const reachable=new Set([1]);for(let i=0;i<12;i++)for(const e of flowEdges)if(reachable.has(e.from))reachable.add(e.to);
assert.equal(reachable.size,12,'Every numbered stage must be reachable');
console.log('Flow topology, parallel branch, exemption exit, return loop and walkthrough boundary passed.');
