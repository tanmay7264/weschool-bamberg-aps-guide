import assert from 'node:assert/strict';
import {suggestNext,practiceQuestions} from '../app/suggestions.js';

const complete=Object.fromEntries(Array.from({length:12},(_,i)=>['step-'+(i+1),true]));
for(const task of ['resume','selection','documents','form','handover','waiting']) {
  assert.equal(suggestNext('unknown',task,complete).step,2,'Unconfirmed routes must keep the confirmation gate');
  assert.match(suggestNext('exempt',task).text,/Stop the APS registration and payment path/);
}
assert.equal(suggestNext('process-a','resume',{}).step,1);
assert.equal(suggestNext('process-a','resume',{'step-1':true,'step-2':true}).step,3);
assert.match(suggestNext('process-a','resume',complete).text,/do not confirm APS approval/);
assert.equal(suggestNext('process-a','documents',{}).view,'documents');
const documents=Object.fromEntries(Array.from({length:13},(_,i)=>['doc-'+i,true]));
assert.equal(suggestNext('process-a','documents',documents).step,6);
assert.equal(suggestNext('process-a','form',{}).step,7);
assert.equal(suggestNext('process-a','form',{'step-7':true}).step,8);
assert.equal(suggestNext('process-a','handover',{}).view,'help');
assert.equal(suggestNext('process-a','waiting',{}).step,12);
assert(practiceQuestions.every(q=>q.answer>=0&&q.answer<q.options.length&&q.step>=1&&q.step<=12));
console.log('Suggestion route gates, saved progress, document counts and practice links passed.');
