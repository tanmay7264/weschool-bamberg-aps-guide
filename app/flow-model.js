export const flowNodes=[
  {n:1,x:34,y:154,title:['Selection','confirmed'],owner:'Student',chapter:1},
  {n:2,x:294,y:154,title:['Confirm','the APS route'],owner:'Both universities',chapter:1},
  {n:3,x:554,y:154,title:['Nomination','& admission'],owner:'Student + universities',chapter:1},
  {n:4,x:814,y:154,title:['Group','instructions'],owner:'Universities + APS',chapter:1},
  {n:5,x:814,y:386,title:['Gather','your documents'],owner:'Student',chapter:2},
  {n:6,x:554,y:386,title:['Quality-check','every record'],owner:'Student + home office',chapter:2},
  {n:7,x:294,y:386,title:['Create','your account'],owner:'Student',chapter:2},
  {n:8,x:34,y:386,title:['Complete','the APS form'],owner:'Student',chapter:2},
  {n:9,x:34,y:632,title:['Review, print','& sign'],owner:'Student',chapter:2},
  {n:10,x:294,y:632,title:['Coordinate','group payment'],owner:'Group payer',chapter:3},
  {n:11,x:554,y:632,title:['Submit the','group packet'],owner:'Student + universities',chapter:3},
  {n:12,x:814,y:632,title:['Verification','& result'],owner:'APS + host university',chapter:3},
];

// The two university tasks are parallel, and both feed the preparation path.
export const flowEdges=[
  {from:1,to:2,d:'M254 210H294'},
  {from:2,to:3,d:'M514 210H554'},
  {from:2,to:4,d:'M404 266V292Q404 302 414 302H914Q924 302 924 292V278',parallel:true},
  {from:3,to:5,d:'M664 266V320Q664 332 676 332H1070Q1092 332 1092 354V420Q1092 442 1070 442H1034',parallel:true},
  {from:4,to:5,d:'M1034 210H1070Q1108 210 1108 248V420Q1108 442 1070 442H1034',parallel:true},
  {from:5,to:6,d:'M814 442H774'},
  {from:6,to:7,d:'M554 442H514'},
  {from:7,to:8,d:'M294 442H254'},
  {from:8,to:9,d:'M144 498V632'},
  {from:9,to:10,d:'M254 688H294'},
  {from:10,to:11,d:'M514 688H554'},
  {from:11,to:12,d:'M774 688H814'},
];
export const exemptionEdge={from:2,to:'exempt',d:'M404 154V84Q404 66 422 66H704'};
export const returnEdge={from:12,to:5,d:'M1034 716H1104Q1136 716 1136 670V490Q1136 442 1104 442H1034'};
export const chapters=[
  {id:1,label:'Confirm & coordinate',first:1},
  {id:2,label:'Prepare & register',first:5},
  {id:3,label:'Submit & follow through',first:10},
];
export function nextTourStep(step){return step>=12?null:step+1;}
export function firstUnfinished(checks){return flowNodes.find(s=>checks['step-'+s.n]!==true)?.n||1;}
