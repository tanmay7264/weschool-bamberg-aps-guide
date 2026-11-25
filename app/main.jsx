import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import {Theme} from '@astryxdesign/core/theme';
import {themes, defaultThemeSlug} from '../astryx-themes.js';
import App from './App.jsx';

function GuideRoot(){
  const [mode,setMode]=useState(()=>{try{const saved=localStorage.getItem('aps-guide-appearance-v1');if(saved==='light'||saved==='dark')return saved;}catch{}return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';});
  const [compact,setCompact]=useState(()=>matchMedia('(max-width: 700px)').matches);
  useEffect(()=>{const media=matchMedia('(max-width: 700px)');const change=()=>setCompact(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  useEffect(()=>{document.documentElement.style.colorScheme=mode;try{localStorage.setItem('aps-guide-appearance-v1',mode);}catch{}},[mode]);
  return <Theme theme={themes[defaultThemeSlug]} mode={mode}><App mode={mode} compact={compact} onToggleTheme={()=>setMode(v=>v==='light'?'dark':'light')}/></Theme>;
}
createRoot(document.getElementById('root')).render(<GuideRoot/>);
