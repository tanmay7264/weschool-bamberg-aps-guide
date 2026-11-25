import React,{useState} from 'react';
import {Dialog,DialogHeader} from '@astryxdesign/core/Dialog';
import {VStack,HStack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {CubeIcon,SparklesIcon,ClipboardDocumentCheckIcon,ArrowDownTrayIcon,SunIcon,AcademicCapIcon} from '@heroicons/react/24/outline';

const lessons=[
  {title:'Welcome to your exchange guide',icon:AcademicCapIcon,view:'overview',text:'Start by confirming your cohort’s APS route with WeSchool and Bamberg. The guide helps you prepare; your institutions confirm eligibility, procedure and the result.',hint:'Your preparation ticks are personal reminders, not APS approval.'},
  {title:'Explore the animated flowchart',icon:CubeIcon,view:'flowchart',text:'Select any raised tile to see who is responsible and what you need to do. Play walkthrough moves through the twelve steps. Use Flat view, zoom, or Step list whenever that is clearer.',hint:'The exemption exit, parallel university tasks and additional-records loop are shown explicitly.'},
  {title:'Find your next action',icon:SparklesIcon,view:'overview',target:'next-action-title',text:'Choose your confirmed route and the task you are working on. The next-action helper combines your choices with saved checklist ticks to suggest the right guidance.',hint:'If the route is unconfirmed, the helper keeps institutional confirmation first.'},
  {title:'Keep your documents organized',icon:ClipboardDocumentCheckIcon,view:'documents',text:'Use the thirteen document checks and the twelve preparation steps as you gather and review records. Your ticks stay in this browser after a reload.',hint:'Use the same device to continue. Reset checklist progress clears ticks; it does not change an APS application.'},
  {title:'Save a copy for later',icon:ArrowDownTrayIcon,view:'downloads',text:'Download the detailed PDF SOP, editable Word document, or one-page flowchart. Recheck the official sources before using the guide with a new cohort.',hint:'The downloaded PDFs include the credit: Created by Tanmay Narnaware.'},
  {title:'Make the guide comfortable',icon:SunIcon,view:'flowchart',text:'Use the sun or moon in the top bar to switch light and dark appearance. The navbar, sidebar and flowchart change together, and your choice is saved in this browser.',hint:'Reduced-motion preferences are respected. You can also pause map motion and replay this quick tour anytime.'},
];

export default function QuickTour({isOpen,onOpenChange,navigate}) {
  const [index,setIndex]=useState(0);
  const lesson=lessons[index];
  function close(){onOpenChange(false);setIndex(0);}
  function show(){navigate(lesson.view);close();if(lesson.target)requestAnimationFrame(()=>document.getElementById(lesson.target)?.scrollIntoView({block:'start',behavior:'auto'}));}
  return <Dialog isOpen={isOpen} onOpenChange={open=>open?onOpenChange(true):close()} width="min(36rem, calc(100vw - 2rem))" maxHeight="85dvh" padding={6} purpose="info">
    <VStack gap={5}><DialogHeader title="A quick tour of the guide" subtitle="Six short stops. Explore at your own pace." onOpenChange={open=>{if(!open)close();}}/>
      <ProgressBar label="Quick tour progress" value={index+1} max={lessons.length} hasValueLabel formatValueLabel={(v,m)=>`${v} of ${m}`}/>
      <VStack gap={4} aria-live="polite" aria-atomic="true"><HStack gap={3} vAlign="center"><Icon icon={lesson.icon} color="accent" size="lg"/><Text type="label" color="accent">STOP {index+1} OF {lessons.length}</Text></HStack><Heading level={3}>{lesson.title}</Heading><Text as="p" display="block">{lesson.text}</Text><Card variant="muted" padding={4}><Text as="p" display="block" color="secondary">{lesson.hint}</Text></Card></VStack>
      <HStack gap={2} wrap="wrap" hAlign="between"><Button label="Show me this feature" variant="ghost" onClick={show}/><HStack gap={2}><Button label="Back in tour" isDisabled={index===0} onClick={()=>setIndex(n=>n-1)}/><Button label={index===lessons.length-1?'Finish tour':'Next in tour'} variant="primary" onClick={()=>index===lessons.length-1?close():setIndex(n=>n+1)}/></HStack></HStack>
    </VStack>
  </Dialog>;
}
