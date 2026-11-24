import React,{useState} from 'react';
import {VStack,HStack} from '@astryxdesign/core/Stack';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {Selector} from '@astryxdesign/core/Selector';
import {RadioList,RadioListItem} from '@astryxdesign/core/RadioList';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Link} from '@astryxdesign/core/Link';
import {ArrowRightIcon,CheckCircleIcon,SparklesIcon,LightBulbIcon} from '@heroicons/react/24/outline';
import data from './content.json';
import {suggestNext,taskOptions,practiceQuestions} from './suggestions.js';
import journeyImage from './media/bamberg-journey.webp';
import documentImage from './media/document-preparation.webp';
import teamImage from './media/university-teamwork.webp';

const P=({children,...props})=><Text as="p" display="block" {...props}>{children}</Text>;
const phases=[
  {title:'Confirm & coordinate',short:'Confirm',steps:[1,2,3,4],image:teamImage,alt:'Illustration of exchange students planning with a university coordinator',tip:'Keep one reliable contact at each institution and use this cohort’s written instructions.'},
  {title:'Prepare & register',short:'Prepare',steps:[5,6,7,8,9],image:documentImage,alt:'Illustration of carefully organized blank documents and a checklist',tip:'A second pass through names, dates and qualification details can prevent avoidable corrections.'},
  {title:'Submit & follow through',short:'Follow through',steps:[10,11,12],image:journeyImage,alt:'Illustration of Indian exchange students in a Bavarian riverside town',tip:'Keep payment, delivery and result evidence together so the coordinator can resolve follow-ups.'},
];

export function HeroIntro({checks,openStep,navigate}) {
  const done=data.stages.filter(s=>checks['step-'+s.n]===true).length;
  return <Grid columns={{minWidth:300,max:2}} gap={6} className="hero-grid">
    <VStack gap={4} className="hero-copy">
      <Text type="label" color="accent" className="eyebrow">WESCHOOL → BAMBERG</Text>
      <Heading level={1} type="display-3" id="page-title">Your exchange.<br/>One clear next step.</Heading>
      <P type="large" color="secondary">A little preparation today. A new chapter in Germany tomorrow. Explore your APS journey, find your next action, and keep everything in order.</P>
      <HStack gap={3} wrap="wrap"><Button variant="primary" label={done?'Continue my journey':'Explore my journey'} onClick={()=>openStep(data.stages.find(s=>!checks['step-'+s.n])?.n||12)} endContent={<Icon icon={ArrowRightIcon}/>} /><Button label="Save the SOP" onClick={()=>navigate('downloads')} /></HStack>
      <HStack gap={4} wrap="wrap"><Text type="supporting" color="secondary">12 guided steps</Text><Text type="supporting" color="secondary">13 document checks</Text><Text type="supporting" color="secondary">Made for future cohorts</Text></HStack>
    </VStack>
    <VStack as="figure" gap={2} className="illustration-figure hero-art"><img src={journeyImage} alt="Paper-cut illustration of Indian students exploring a Bamberg-inspired riverside town" width="1280" height="853" fetchPriority="high"/><Text as="figcaption" type="supporting" color="secondary">Your next chapter, illustrated. Artwork is illustrative, not a campus photograph.</Text></VStack>
  </Grid>;
}

export function NextActionHelper({checks,routeChoice,onRouteChange,navigate,openStep}) {
  const [task,setTask]=useState('resume');
  const suggestion=suggestNext(routeChoice,task,checks);
  return <Card variant="blue" padding={6}><VStack gap={5} as="section" aria-labelledby="next-action-title">
    <HStack gap={3} vAlign="center"><Icon icon={SparklesIcon} color="accent" size="lg"/><VStack gap={1}><Heading level={2} id="next-action-title">What should I do next?</Heading><P color="secondary">Tell us where you are. Get a useful next action.</P></VStack></HStack>
    <Grid columns={{minWidth:240,max:2}} gap={4}>
      <Selector label="My cohort’s APS route" value={routeChoice} onChange={onRouteChange} presentation="adaptive" options={[{value:'unknown',label:'Not confirmed yet'},{value:'process-a',label:'Process A confirmed in writing'},{value:'exempt',label:'Exemption confirmed in writing'}]}/>
      <Selector label="What I am working on" value={task} onChange={setTask} presentation="adaptive" options={taskOptions}/>
    </Grid>
    <VStack gap={3} className="suggestion-result" role="status" aria-live="polite" aria-atomic="true"><Text type="label" color="accent">SUGGESTED NEXT ACTION</Text><Heading level={3}>{suggestion.title}</Heading><P>{suggestion.text}</P><HStack><Button variant="primary" label={suggestion.label} onClick={()=>suggestion.view?navigate(suggestion.view):openStep(suggestion.step)} endContent={<Icon icon={ArrowRightIcon}/>}/></HStack></VStack>
    <Collapsible trigger={<Text weight="semibold">Confirm your route first · why it matters</Text>} defaultIsOpen={false}><VStack gap={4} paddingBlock={4}>{data.gate.map(t=><P key={t}>{t}</P>)}<HStack gap={4} wrap="wrap">{data.sources.filter(s=>['S1','S8'].includes(s.id)).map(s=><Link key={s.id} href={s.url} isExternalLink>{s.id} {s.title}</Link>)}</HStack></VStack></Collapsible>
    <P type="supporting" color="secondary">Suggestions follow your choices and saved ticks. Your institutions confirm the route; checklist completion does not confirm APS approval.</P>
  </VStack></Card>;
}

export function JourneyExplorer({checks,openStep,diagram}) {
  const [phaseIndex,setPhaseIndex]=useState(0),[selected,setSelected]=useState(1);
  const phase=phases[phaseIndex],stage=data.stages[selected-1];
  function choosePhase(index){setPhaseIndex(index);setSelected(phases[index].steps.find(n=>checks['step-'+n]!==true)||phases[index].steps[0]);}
  return <VStack gap={5} as="section" aria-labelledby="explorer-title">
    <VStack gap={2}><Text type="label" color="accent" className="eyebrow">THE BIG PICTURE</Text><Heading level={2} id="explorer-title">Explore the journey</Heading><P color="secondary">Choose a chapter, then tap a step. See who helps and what comes next.</P></VStack>
    <Grid columns={{minWidth:220,max:3}} gap={3}>{phases.map((p,i)=>{const done=p.steps.filter(n=>checks['step-'+n]===true).length;return <Button key={p.title} label={`${i+1}. ${p.title}`} variant={i===phaseIndex?'primary':'secondary'} aria-pressed={i===phaseIndex} onClick={()=>choosePhase(i)} endContent={done===p.steps.length?<Icon icon={CheckCircleIcon}/>:undefined}/>;})}</Grid>
    <Card padding={0}><Grid columns={{minWidth:280,max:2}} gap={0}>
      <VStack gap={3} padding={5}><VStack as="figure" gap={2} className="illustration-figure"><img src={phase.image} alt={phase.alt} width="1280" height={phaseIndex===0?'720':'853'} loading="lazy"/><Text as="figcaption" type="supporting" color="secondary">Illustrative artwork · Chapter {phaseIndex+1} of 3</Text></VStack><ProgressBar label={`${phase.short} chapter preparation`} value={phase.steps.filter(n=>checks['step-'+n]===true).length} max={phase.steps.length} hasValueLabel formatValueLabel={(v,m)=>`${v} of ${m} steps`}/></VStack>
      <VStack gap={4} padding={6} className="explorer-detail"><HStack gap={2} wrap="wrap" aria-label="Explore chapter steps">{phase.steps.map(n=><Button key={n} label={`Step ${String(n).padStart(2,'0')}`} size="sm" variant={n===selected?'primary':'secondary'} aria-pressed={n===selected} onClick={()=>setSelected(n)} icon={checks['step-'+n]===true?<Icon icon={CheckCircleIcon}/>:undefined}/>)}</HStack>
        <VStack key={selected} gap={3} className="step-preview" aria-live="polite"><Text type="label" color="accent">{String(selected).padStart(2,'0')} / 12 · {stage.owner}</Text><Heading level={3}>{stage.title}</Heading><P>{stage.purpose}</P><P type="supporting" color="secondary"><Text weight="semibold">Ready when: </Text>{stage.complete}</P></VStack>
        <HStack><Button label={`Open full step ${selected}`} variant="primary" onClick={()=>openStep(selected)} endContent={<Icon icon={ArrowRightIcon}/>} /></HStack>
      </VStack>
    </Grid></Card>
    <Collapsible trigger={<Text weight="semibold">See the complete responsibility flowchart</Text>} defaultIsOpen={false}><VStack paddingBlock={4}>{diagram}</VStack></Collapsible>
  </VStack>;
}

export function ReadinessCheck({openStep}) {
  const [answers,setAnswers]=useState({});
  const answered=Object.keys(answers).length,correct=practiceQuestions.filter((q,i)=>answers[i]===q.answer).length;
  return <VStack gap={5} as="section" aria-labelledby="practice-title">
    <HStack gap={3} vAlign="center"><Icon icon={LightBulbIcon} color="accent" size="lg"/><VStack gap={2}><Heading level={2} id="practice-title">A quick confidence check</Heading><P color="secondary">Three common situations. Try an answer and discover the reason.</P></VStack></HStack>
    <VStack gap={4}>{practiceQuestions.map((q,i)=><Card key={q.question} padding={5}><VStack gap={4}><Text type="label" color="accent">SCENARIO {i+1} / 3</Text><Heading level={3}>{q.question}</Heading><RadioList label={`Scenario ${i+1} answers`} isLabelHidden value={answers[i]===undefined?'':String(answers[i])} onChange={v=>setAnswers(a=>({...a,[i]:Number(v)}))}>{q.options.map((option,j)=><RadioListItem key={option} value={String(j)} label={<P>{option}</P>}/>)}</RadioList>{answers[i]!==undefined&&<VStack gap={3} className="practice-feedback" role="status"><P weight="semibold" color={answers[i]===q.answer?'success':'secondary'}>{answers[i]===q.answer?'You’ve got it.':'A useful one to revisit.'}</P><P>{q.explanation}</P><HStack><Button label={`Read the guidance for scenario ${i+1}`} size="sm" variant="ghost" onClick={()=>openStep(q.step)}/></HStack></VStack>}</VStack></Card>)}</VStack>
    {answered>0&&<HStack gap={4} hAlign="between" wrap="wrap" aria-live="polite"><P weight="semibold">{correct} of 3 correct · {answered} of 3 explored{correct===3?' · Ready to apply what you’ve learned.':''}</P><Button label="Try the questions again" size="sm" variant="ghost" onClick={()=>setAnswers({})}/></HStack>}
    <P type="supporting" color="secondary">Practice only. These answers do not assess your eligibility or APS application.</P>
  </VStack>;
}

export function StepHint({step}) {
  const phase=phases.find(p=>p.steps.includes(step));
  return <Card variant="blue" padding={5}><HStack gap={3} vAlign="start"><Icon icon={LightBulbIcon} color="accent"/><VStack gap={2}><Text weight="semibold">A useful habit</Text><P>{phase.tip}</P></VStack></HStack></Card>;
}

export function DocumentVisual(){return <Grid columns={{minWidth:260,max:2}} gap={5}><VStack as="figure" gap={2} className="illustration-figure"><img src={documentImage} alt="Illustration of folders, blank papers, a magnifying glass and a preparation checklist" width="1280" height="853" loading="lazy"/><Text as="figcaption" type="supporting" color="secondary">Illustration · Keep your preparation clear and organized.</Text></VStack><VStack gap={4} className="hero-copy"><Heading level={2}>Build your packet with confidence</Heading><P>Work through one record at a time. Match names and dates, keep your own copies, and flag missing records to your coordinator early.</P><P type="supporting" color="secondary">Suggested folder names: Identity · Academic records · APS form · Payment and dispatch · University correspondence.</P></VStack></Grid>;}
