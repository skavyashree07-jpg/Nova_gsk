import { useEffect, useRef } from 'react';
import { useCallback } from 'react';
export default function Waveform({ active }) {
  const raf=useRef(0), streamRef=useRef(null), audioRef=useRef(null), bars=useRef([]);
  const setBar=useCallback((el,i)=>{bars.current[i]=el;},[]);
  useEffect(()=>{let disposed=false; const stop=()=>{cancelAnimationFrame(raf.current);streamRef.current?.getTracks().forEach(t=>t.stop());audioRef.current?.close?.();streamRef.current=null;audioRef.current=null;};
    if(!active||!navigator.mediaDevices?.getUserMedia)return stop;
    navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{if(disposed){stream.getTracks().forEach(t=>t.stop());return;}streamRef.current=stream;const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;const ctx=new AudioCtx(), analyser=ctx.createAnalyser();analyser.fftSize=64;ctx.createMediaStreamSource(stream).connect(analyser);audioRef.current=ctx;const data=new Uint8Array(analyser.frequencyBinCount);const tick=()=>{analyser.getByteFrequencyData(data);for(let i=0;i<25;i++){const v=data[Math.floor(i*data.length/25)]||0;if(bars.current[i])bars.current[i].style.height=`${Math.max(5,4+v*.13)}px`;}raf.current=requestAnimationFrame(tick);};tick();}).catch(()=>{});
    return()=>{disposed=true;stop();};
  },[active]);
  return <div className={`waveform ${active?'active':''}`} aria-hidden="true">{Array.from({length:25},(_,i)=><i ref={el=>setBar(el,i)} key={i} />)}</div>;
}
