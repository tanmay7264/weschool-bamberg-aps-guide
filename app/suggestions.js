export const taskOptions = [
  {value:'resume',label:'Continue from my saved progress'},
  {value:'selection',label:'I have just been selected'},
  {value:'documents',label:'I am gathering documents'},
  {value:'form',label:'I am working on the APS form'},
  {value:'handover',label:'I am preparing the handover'},
  {value:'waiting',label:'Our group packet has been sent'},
];

export function suggestNext(route,task,checks={}) {
  if(route==='exempt') return {title:'Keep your written exemption evidence',text:'Follow the written guidance from your home institution and the German host university. Stop the APS registration and payment path, retain the evidence, and continue with admission and the applicable visa instructions.',step:2,label:'Review route guidance'};
  if(route!=='process-a') return {title:'Confirm your route before registering or paying',text:'Ask your home institution and the German host university whether this cohort follows Process A or an exemption. You can gather your records while you wait for written confirmation.',step:2,label:'Ask my coordinator'};
  if(task==='selection') return {title:'Start with your selection record',text:'Save your selection email and identify the coordinator, semester and current university deadlines. Selection and admission are separate milestones.',step:1,label:'Selection checklist'};
  if(task==='documents') {
    const remaining=Array.from({length:13},(_,i)=>i).filter(i=>checks['doc-'+i]!==true).length;
    return {title:remaining?`${remaining} document ${remaining===1?'item remains':'items remain'} on your checklist`:'Give your documents a final quality check',text:remaining?'Open the checklist and identify what is available now. Some items are produced only after registration or the confirmed group payment.':'Compare names, dates and academic records against the form before you hand anything over.',view:remaining?'documents':undefined,step:remaining?undefined:6,label:remaining?'Document checklist':'Quality check'};
  }
  if(task==='form') return {title:'Check your group instructions before the form',text:'Use the cohort’s registration instructions and confirmed academic classification. Keep records beside you, then review every entry before printing and signing.',step:checks['step-7']===true?8:7,label:'Continue the form guide'};
  if(task==='handover') return {title:'Review, sign and coordinate the handover',text:'Check the signed application and consent, the document copies, and the original enrolment statement. Confirm the coordinated group payment and submission arrangements with the office.',view:'help',label:'Handover checklist'};
  if(task==='waiting') return {title:'Keep the group tracking and enquiry trail',text:'Retain delivery evidence, monitor your email and respond through the coordinator if APS requests more information. Follow the German host university’s result confirmation and the applicable visa instructions.',step:12,label:'Verification and results'};
  const step=Array.from({length:12},(_,i)=>i+1).find(n=>checks['step-'+n]!==true);
  return step?{title:`Your next unchecked preparation step is ${step}`,text:'This suggestion follows your saved ticks. Revisit earlier instructions whenever your coordinator changes the cohort requirements; a tick is your own preparation record.',step,label:'Continue preparation'}:{title:'Your preparation checklist is complete',text:'Your ticks do not confirm APS approval. Retain the result or exemption evidence and use the current university and visa instructions for the next milestone.',step:12,label:'Result and visa handover'};
}

export const practiceQuestions=[
  {question:'Your exchange route is still unconfirmed. What is the best next move?',options:['Register and pay immediately','Confirm with both institutions; gather records meanwhile'],answer:1,explanation:'Confirm Process A or an exemption with your home institution and the German host university before APS registration or payment.',step:2},
  {question:'The form asks for an academic category for your PGDM. What should you do?',options:['Ask for the confirmed eligibility and form-entry instructions','Choose Master because it sounds closest'],answer:0,explanation:'A PGDM needs confirmed eligibility and classification. Do not guess the APS category or describe it as a Master without confirmation.',step:8},
  {question:'Your cohort follows Process A. How should payment and submission be handled?',options:['Every student independently pays and posts a packet','Follow the coordinated collective payment and group submission'],answer:1,explanation:'Process A uses coordinated group payment and a collective packet. Follow the designated office’s current instructions.',step:10},
];
