import React,{useEffect,useId,useRef,useState} from 'react';
import {VStack,HStack} from '@astryxdesign/core/Stack';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {Link} from '@astryxdesign/core/Link';
import {PlayIcon,PauseIcon,CubeIcon,ListBulletIcon,ArrowRightIcon,ArrowLeftIcon,PlusIcon,MinusIcon,ArrowTopRightOnSquareIcon} from '@heroicons/react/24/outline';
import data from './content.json';
import {flowNodes,flowEdges,exemptionEdge,returnEdge,chapters,nextTourStep,firstUnfinished} from './flow-model.js';
import mapStyles from './flow-styles.js';

const P=({children,...props})=><Text as="p" display="block" {...props}>{children}</Text>;

function MapNode({node,selected,done,choose,move}) {
  const active=selected===node.n;
  return <a href="#flowchart" data-stage={node.n} className={`map-node ${active?'is-selected':''} ${done?'is-done':''} ${node.n===2?'is-gate':''}`} transform={`translate(${node.x} ${node.y})`} aria-label={`Preview step ${node.n}: ${data.stages[node.n-1].title}${done?'. Preparation checked':''}`} aria-current={active?'step':undefined} onClick={e=>{e.preventDefault();choose(node.n);}} onFocus={()=>choose(node.n)} onKeyDown={e=>{const next=e.key==='ArrowRight'?Math.min(12,node.n+1):e.key==='ArrowLeft'?Math.max(1,node.n-1):e.key==='Home'?1:e.key==='End'?12:null;if(next){e.preventDefault();move(next);}}}>
    <title>{data.stages[node.n-1].title}</title>
    <g className="map-tile">
      <rect className="node-depth" x="3" y="10" width="220" height="112" rx="18"/>
      <rect className="node-face" width="220" height="112" rx="18"/>
      <circle className="node-number-bg" cx="32" cy="32" r="20"/>
      <text className="node-number" x="32" y="39" textAnchor="middle">{String(node.n).padStart(2,'0')}</text>
      <text className="node-owner" x="62" y="37">{node.owner}</text>
      <text className="node-title" x="18" y="75">{node.title[0]}</text><text className="node-title" x="18" y="100">{node.title[1]}</text>
      {done&&<g aria-hidden="true"><circle className="done-dot" cx="204" cy="6" r="12"/><path className="done-check" d="M198 6l4 4 8-9"/></g>}
    </g>
  </a>;
}

function JourneyMap({selected,checks,choose,move,depth,motion,zoom,viewportRef}) {
  const uid=useId().replaceAll(':','');
  return <VStack className={`map-viewport ${depth?'has-depth':''} ${motion?'has-motion':''}`} ref={viewportRef} role="region" aria-label="Interactive APS journey map. Tab to a step; use left and right arrows to explore." tabIndex={0}>
    <svg className="journey-map" viewBox="0 0 1180 910" style={{'--map-zoom':zoom}} role="group" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>The APS exchange journey in twelve steps</title><desc id={`${uid}-desc`}>Selection leads to route confirmation. A confirmed exemption exits to evidence and visa preparation. Process A continues with nomination and group setup in parallel, then documents, quality checks, account, form, signing, coordinated payment, collective dispatch, verification and university result confirmation. Additional document requests return to preparation. The numbered tour is a reading order, not a timetable.</desc>
      <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>
      <rect className="map-floor-depth" x="12" y="136" width="1114" height="660" rx="28"/>
      <rect className="map-floor" x="12" y="118" width="1114" height="660" rx="28"/>
      <path className="map-floor-grid" d="M24 360H1112M24 596H1112"/>
      <text className="map-chapter" x="34" y="139">01 · CONFIRM & COORDINATE</text><text className="map-chapter" x="34" y="365">02 · PREPARE & REGISTER</text><text className="map-chapter" x="294" y="611">03 · SUBMIT & FOLLOW THROUGH</text>
      <g markerEnd={`url(#${uid}-arrow)`} aria-hidden="true">
        {flowEdges.map((edge,i)=><path key={i} className={`map-edge ${edge.from===selected||edge.to===selected?'is-active':''} ${edge.parallel?'is-parallel':''}`} d={edge.d}/>)}
        <path className={`map-edge exemption-edge ${selected===2||selected==='exempt'?'is-active':''}`} d={exemptionEdge.d}/>
        <path className={`map-edge return-edge ${selected===12||selected===5||selected===6?'is-active':''}`} d={returnEdge.d}/>
        <path className={`map-edge ${selected===12?'is-active':''}`} d="M924 744V812"/>
      </g>
      <text className="edge-label" x="492" y="51">IF EXEMPTION IS CONFIRMED</text>
      <text className="edge-label" x="570" y="292">PROCESS A · WORK IN PARALLEL</text>
      <text className="edge-label" x="787" y="625" textAnchor="middle">APS VERIFIES</text>
      <a href="#flowchart" className={`map-terminal ${selected==='exempt'?'is-selected':''}`} aria-label="Preview the confirmed exemption branch" onClick={e=>{e.preventDefault();choose('exempt');}}>
        <rect className="terminal-face" x="704" y="22" width="330" height="80" rx="18"/><text className="terminal-title" x="724" y="55">Exemption confirmed</text><text className="terminal-copy" x="724" y="81">Keep written evidence → visa preparation</text>
      </a>
      {flowNodes.map(node=><MapNode key={node.n} node={node} selected={selected} done={checks['step-'+node.n]===true} choose={choose} move={move}/>)}
      <a href="#flowchart" className="map-terminal" aria-label="Preview the result and visa handover" onClick={e=>{e.preventDefault();choose(12);}}><rect className="terminal-face visa-terminal" x="794" y="812" width="260" height="68" rx="18"/><text className="terminal-title" x="814" y="840">Visa preparation</text><text className="terminal-copy" x="814" y="864">Use the confirmed evidence</text></a>
      <a href="#flowchart" className="return-label" transform="translate(1160 720) rotate(-90)" aria-label="Additional records requested: preview document preparation at step 5" onClick={e=>{e.preventDefault();choose(5);}}><rect className="return-hit" x="-8" y="-17" width="282" height="28" rx="8"/><text x="0" y="2">MORE RECORDS? RETURN TO 05–06</text></a>
      <text className="map-footnote" x="34" y="851">Reading order: follow the arrows and step numbers.</text><text className="map-footnote" x="34" y="875">A tick records your preparation, not APS approval.</text>
    </svg>
  </VStack>;
}

export default function FlowchartExperience({checks,openStep,diagram,fullPage,isPage=false}) {
  const [selected,setSelected]=useState(()=>firstUnfinished(checks));
  const [view,setView]=useState(()=>window.matchMedia('(max-width: 640px)').matches?'list':'map');
  const [depth,setDepth]=useState(true),[zoom,setZoom]=useState(1),[playing,setPlaying]=useState(false);
  const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [motion,setMotion]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const viewportRef=useRef(null),experienceRef=useRef(null),sectionId=useId();
  const stage=typeof selected==='number'?data.stages[selected-1]:null;
  const chapter=flowNodes.find(n=>n.n===selected)?.chapter;
  const done=flowNodes.filter(n=>checks['step-'+n.n]===true).length;
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');function change(){setReduced(media.matches);if(media.matches){setMotion(false);setPlaying(false);}}media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  useEffect(()=>{if(!playing||reduced)return;const timer=window.setTimeout(()=>{const next=nextTourStep(typeof selected==='number'?selected:1);if(next)setSelected(next);else setPlaying(false);},5000);return()=>window.clearTimeout(timer);},[playing,selected,reduced]);
  useEffect(()=>{const pause=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);},[]);
  useEffect(()=>{if(view!=='map'||!viewportRef.current)return;const frame=requestAnimationFrame(()=>{const container=viewportRef.current,node=container.querySelector(`[data-stage="${selected}"]`);if(!node)return;const a=container.getBoundingClientRect(),b=node.getBoundingClientRect();const left=b.left<a.left?container.scrollLeft+b.left-a.left-20:b.right>a.right?container.scrollLeft+b.right-a.right+20:container.scrollLeft;const top=b.top<a.top?container.scrollTop+b.top-a.top-20:b.bottom>a.bottom?container.scrollTop+b.bottom-a.bottom+20:container.scrollTop;container.scrollTo({left,top,behavior:motion&&!reduced?'smooth':'auto'});});return()=>cancelAnimationFrame(frame);},[selected,zoom,view,motion,reduced]);
  useEffect(()=>{if(view==='list'&&playing)experienceRef.current?.querySelector(`[data-list-step="${selected}"]`)?.scrollIntoView({block:'center',behavior:motion&&!reduced?'smooth':'auto'});},[view,selected,playing,motion,reduced]);
  function choose(n){setPlaying(false);setSelected(n);}
  function move(n){choose(n);viewportRef.current?.querySelector(`[data-stage="${n}"]`)?.focus();}
  function toggleTour(){if(playing)setPlaying(false);else{if(selected===12||selected==='exempt')setSelected(1);setPlaying(true);}}
  return <VStack gap={5} as="section" aria-labelledby={sectionId} className="flow-experience" ref={experienceRef}>
    <style>{mapStyles}</style>
    <HStack hAlign="between" vAlign="center" wrap="wrap" gap={4}><VStack gap={2}><Text type="label" color="accent" className="eyebrow">THE EXCHANGE JOURNEY</Text><Heading level={isPage?1:2} id={sectionId}>Your APS journey, mapped.</Heading><P color="secondary">Twelve steps. Shared responsibilities. One clear way forward.</P></VStack>{fullPage&&<Button label="Open focused view" onClick={fullPage} endContent={<Icon icon={ArrowTopRightOnSquareIcon}/>}/>}</HStack>
    <Card variant="muted" padding={5}><VStack gap={4}>
      <HStack gap={2} hAlign="between" vAlign="center" wrap="wrap"><HStack gap={2} wrap="wrap"><Button label="3D map" icon={<Icon icon={CubeIcon}/>} variant={view==='map'?'primary':'secondary'} aria-pressed={view==='map'} onClick={()=>setView('map')}/><Button label="Step list" icon={<Icon icon={ListBulletIcon}/>} variant={view==='list'?'primary':'secondary'} aria-pressed={view==='list'} onClick={()=>setView('list')}/></HStack><HStack gap={2} wrap="wrap"><Button label={playing?'Pause walkthrough':'Play walkthrough'} icon={<Icon icon={playing?PauseIcon:PlayIcon}/>} onClick={toggleTour} isDisabled={reduced} tooltip={reduced?'Automatic playback is off for your reduced-motion preference. Use Next step.':undefined}/><Button label={motion?'Pause motion':'Enable motion'} size="sm" variant="ghost" isDisabled={reduced} onClick={()=>{setMotion(v=>!v);setPlaying(false);}}/></HStack></HStack>
      <HStack gap={2} wrap="wrap">{chapters.map(c=><Button key={c.id} label={`${c.id}. ${c.label}`} size="sm" variant={chapter===c.id?'primary':'secondary'} onClick={()=>choose(c.first)} aria-pressed={chapter===c.id}/>)}</HStack>
      <Text type="supporting" color="secondary">{done} of 12 preparation steps checked · Select any stage to see its instructions.</Text>
    </VStack></Card>
    <VStack className={view==='map'?'flow-workspace':'flow-stack'} gap={5}>
    {view==='map'?<Card padding={0}><VStack gap={0}>
      <HStack hAlign="between" vAlign="center" wrap="wrap" gap={3} padding={4}><Text type="supporting" weight="semibold">{stage?`Step ${selected} · ${stage.short}`:'Confirmed exemption'}</Text><HStack gap={2}><Button label="Zoom out" tooltip="Zoom out" isIconOnly icon={<Icon icon={MinusIcon}/>} size="sm" isDisabled={zoom<=.8} onClick={()=>setZoom(v=>Math.max(.8,Math.round((v-.2)*10)/10))}/><Button label={`Reset zoom (${Math.round(zoom*100)}%)`} size="sm" variant="ghost" onClick={()=>setZoom(1)}>{Math.round(zoom*100)}%</Button><Button label="Zoom in" tooltip="Zoom in" isIconOnly icon={<Icon icon={PlusIcon}/>} size="sm" isDisabled={zoom>=1.6} onClick={()=>setZoom(v=>Math.min(1.6,Math.round((v+.2)*10)/10))}/><Button label={depth?'Flat view':'Depth view'} size="sm" onClick={()=>setDepth(v=>!v)}/></HStack></HStack>
      <JourneyMap selected={selected} checks={checks} choose={choose} move={move} depth={depth} motion={motion&&!reduced} zoom={zoom} viewportRef={viewportRef}/>
    </VStack></Card>:<VStack gap={4}>{chapters.map(c=><VStack key={c.id} gap={3}><Heading level={3}>{c.id}. {c.label}</Heading><Grid columns={{minWidth:240,max:3}} gap={3}>{flowNodes.filter(n=>n.chapter===c.id).map(n=><VStack key={n.n} gap={3} data-list-step={n.n}><Button label={`${String(n.n).padStart(2,'0')} · ${n.title.join(' ')}${checks['step-'+n.n]===true?' ✓':''}`} variant={selected===n.n?'primary':'secondary'} onClick={()=>choose(n.n)} aria-expanded={selected===n.n}/>{selected===n.n&&<VStack gap={3} padding={3} aria-label={`Step ${n.n} preview`}><P>{data.stages[n.n-1].purpose}</P><HStack><Button label={`Open instructions for step ${n.n}`} size="sm" onClick={()=>openStep(n.n)} endContent={<Icon icon={ArrowRightIcon}/>}/></HStack></VStack>}</VStack>)}</Grid></VStack>)}</VStack>}
    <Card variant={selected==='exempt'?'yellow':'blue'} padding={5} className="map-detail"><VStack gap={5}>
      <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap"><Text type="label" color="accent">{stage?`STEP ${String(selected).padStart(2,'0')} OF 12`:'CONFIRMED EXEMPTION BRANCH'}{playing?' · WALKTHROUGH PLAYING':''}</Text><HStack gap={2}><Button label="Previous map step" size="sm" isIconOnly tooltip="Previous step" icon={<Icon icon={ArrowLeftIcon}/>} isDisabled={selected===1||selected==='exempt'} onClick={()=>choose(selected-1)}/><Button label="Next map step" size="sm" isIconOnly tooltip="Next step" icon={<Icon icon={ArrowRightIcon}/>} isDisabled={selected===12||selected==='exempt'} onClick={()=>choose(selected+1)}/></HStack></HStack>
      <VStack gap={3} aria-live="polite" aria-atomic="true" className="map-inspector"><Heading level={3}>{stage?stage.title:'Keep written exemption evidence'}</Heading><P>{stage?stage.purpose:'Follow the exemption confirmed by both institutions. Retain the written instruction and supporting evidence; do not register or pay on the APS path when exemption applies.'}</P>{stage&&<Text type="supporting" color="secondary">Responsible: {stage.owner}</Text>}</VStack>
      {stage&&<VStack gap={2}><Text weight="semibold">Ready to move on when</Text><P>{stage.complete}</P></VStack>}
      <HStack gap={3} wrap="wrap"><Button label={stage?`Read full step ${selected}`:'Read route and exemption guidance'} variant="primary" onClick={()=>openStep(stage?selected:2)} endContent={<Icon icon={ArrowRightIcon}/>}/>{(selected===2||selected==='exempt')&&<Button label={selected==='exempt'?'Explore Process A':'Explore exemption branch'} onClick={()=>choose(selected==='exempt'?3:'exempt')}/>}{selected===12&&<Button label="More records requested?" variant="ghost" onClick={()=>choose(5)}/>}</HStack>
      <Collapsible trigger={<Text weight="semibold">Checks, questions & sources</Text>} defaultIsOpen={false}><VStack gap={4} paddingBlock={4}>{stage&&<P>{stage.branch}</P>}
      <HStack gap={3} wrap="wrap">{data.sources.filter(s=>(stage?stage.sources:['S1','S8']).includes(s.id)).map(s=><Link key={s.id} href={s.url} isExternalLink type="supporting">{s.id} {s.title}</Link>)}</HStack></VStack></Collapsible>
    </VStack></Card>
    </VStack>
    <P type="supporting" color="secondary">Steps 3 and 4 can run in parallel. The walkthrough is a reading order, not a fixed timetable. Confirm your cohort’s route before APS registration or payment.{reduced?' Reduced motion is enabled; use the manual step controls.':''}</P>
    {diagram&&<Collapsible trigger={<Text weight="semibold">Open the responsibility swimlane</Text>} defaultIsOpen={false}><VStack paddingBlock={4}>{diagram}</VStack></Collapsible>}
  </VStack>;
}
