import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {DialogHeader} from '@astryxdesign/core/Dialog';
import {VStack,HStack} from '@astryxdesign/core/Stack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {lessons} from './tour-model.js';

export default function QuickTour({onClose,navigate}) {
  const [index,setIndex]=useState(0),[geometry,setGeometry]=useState(null);
  const dialog=useRef(null),panel=useRef(null),heading=useRef(null),navigateRef=useRef(navigate);
  navigateRef.current=navigate;
  const lesson=lessons[index];
  useEffect(()=>{const previous=document.activeElement;dialog.current.showModal();return()=>{dialog.current?.close();if(previous?.isConnected)previous.focus();};},[]);
  useLayoutEffect(()=>{
    navigateRef.current(lesson.view,1);
    setGeometry(null);
    let frame;
    function measure(){
      const target=document.querySelector(lesson.target);
      if(!target||!panel.current)return;
      const r=target.getBoundingClientRect(),p=panel.current.getBoundingClientRect(),w=innerWidth,h=innerHeight;
      const gap=16,inset=12,panelX=Math.max(inset,Math.min(r.left,w-p.width-inset));
      let maxHeight=Math.min(panel.current.scrollHeight+2,h-inset*2),panelY=r.bottom+gap;
      if(panelY+maxHeight>h-inset){
        if(r.top-gap-maxHeight>=inset)panelY=r.top-gap-maxHeight;
        else if(r.top>h/2){maxHeight=Math.max(100,r.top-gap-inset);panelY=inset;}
        else{panelY=r.top+Math.min(r.height,120)+gap;maxHeight=Math.max(100,h-inset-panelY);}
      }
      panelY=Math.max(inset,Math.min(panelY,h-inset-maxHeight));
      const left=Math.max(inset,r.left-6),top=Math.max(inset,r.top-6,panelY<r.top?panelY+maxHeight+gap:inset);
      const bottom=Math.min(h-inset,r.bottom+6,panelY>r.top?panelY-gap:h-inset);
      setGeometry({left,top,width:Math.max(0,Math.min(w-inset,r.right+6)-left),height:Math.max(0,bottom-top),panelX,panelY,maxHeight});
    }
    frame=requestAnimationFrame(()=>{
      document.querySelector(lesson.target)?.scrollIntoView({block:'start',inline:'nearest',behavior:'instant'});
      panel.current?.scrollTo({top:0,behavior:'instant'});
      measure();heading.current?.focus({preventScroll:true});
    });
    const observer=new ResizeObserver(measure);if(panel.current)observer.observe(panel.current);
    window.addEventListener('resize',measure);window.addEventListener('scroll',measure,true);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure,true);};
  },[lesson]);
  return <dialog ref={dialog} className="tour-overlay" aria-labelledby="tour-heading" onCancel={e=>{e.preventDefault();onClose();}}>
    <svg className="tour-spotlight" width="100%" height="100%" aria-hidden="true">
      <defs><mask id="tour-hole"><rect width="100%" height="100%" fill="white"/>{geometry&&<rect x={geometry.left} y={geometry.top} width={geometry.width} height={geometry.height} rx="12" fill="black"/>}</mask></defs>
      <rect width="100%" height="100%" className="tour-shade" mask="url(#tour-hole)"/>
      {geometry&&<><rect x={geometry.left} y={geometry.top} width={geometry.width} height={geometry.height} rx="12" className="tour-outline"/><path className="tour-pointer" d={`M ${geometry.left+Math.min(geometry.width/2,40)} ${geometry.panelY>geometry.top?geometry.top+geometry.height:geometry.top} L ${geometry.panelX+40} ${geometry.panelY>geometry.top?geometry.panelY:geometry.panelY+(panel.current?.offsetHeight||0)}`}/></>}
    </svg>
    <VStack ref={panel} className="tour-panel" padding={5} gap={4} style={geometry?{left:geometry.panelX,top:geometry.panelY,maxHeight:geometry.maxHeight}:undefined}>
        <VStack gap={4}>
          <DialogHeader title="Your guide, explained" subtitle={`Stop ${index+1} of ${lessons.length} · Follow the highlighted feature`} onOpenChange={open=>{if(!open)onClose();}}/>
          <ProgressBar label="Quick tour progress" value={index+1} max={lessons.length}/>
          <VStack gap={3} aria-live="polite" aria-atomic="true"><Heading level={3} id="tour-heading" tabIndex={-1} ref={heading}>{lesson.title}</Heading><Text as="p" display="block">{lesson.text}</Text><Text as="p" display="block" type="supporting" color="secondary">{lesson.hint}</Text></VStack>
          <HStack gap={2} wrap="wrap" hAlign="between"><Button label="Skip tour" variant="ghost" size="sm" onClick={onClose}/><HStack gap={2}><Button label="Back in tour" size="sm" isDisabled={index===0} onClick={()=>setIndex(n=>n-1)}/><Button label={index===lessons.length-1?'Finish tour':'Next in tour'} size="sm" variant="primary" onClick={()=>index===lessons.length-1?onClose():setIndex(n=>n+1)}/></HStack></HStack>
          <Button label="Close tour and try this section" variant="ghost" size="sm" onClick={onClose}/>
        </VStack>
    </VStack>
  </dialog>;
}
