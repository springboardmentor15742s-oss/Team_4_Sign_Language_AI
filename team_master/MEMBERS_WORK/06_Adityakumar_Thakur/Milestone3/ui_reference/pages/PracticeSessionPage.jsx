import React, { useRef, useEffect, useState, useCallback } from "react";
import { Hand, CheckCircle2, XCircle, BookOpen, Activity, Users, Sun, Lightbulb, RotateCcw } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",red:"#E11D48",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

export const SIGN_CATEGORIES = {
  "ASL Letters":["A","B","C","D","E","F","G","H","I","J","K","L","O","R","U","V","W","Y","Z"],
  "Common Words":["HELLO","THANK_YOU","PLEASE","YES","NO","GOOD","LOVE","STOP","COME","WAVE","OK","POINT","THUMBS_UP"],
  "Two-Hand Signs":["NAMASTE","FRIEND","HELP","PEACE","APPLAUSE"],
};

const SIGN_INFO = {
  "A":{"hands":1,"type":"static","desc":"Closed fist, thumb rests on the side"},
  "B":{"hands":1,"type":"static","desc":"All 4 fingers up, thumb tucked across palm"},
  "C":{"hands":1,"type":"static","desc":"Curve hand in a C-shape"},
  "D":{"hands":1,"type":"static","desc":"Index up, other 3 form circle to thumb"},
  "E":{"hands":1,"type":"static","desc":"Fingertips bent forward, thumb tucked"},
  "F":{"hands":1,"type":"static","desc":"Index+thumb touch, 3 fingers up"},
  "G":{"hands":1,"type":"static","desc":"Index+thumb point sideways"},
  "H":{"hands":1,"type":"static","desc":"Index+middle extend horizontally"},
  "I":{"hands":1,"type":"static","desc":"Only the pinky finger extended"},
  "J":{"hands":1,"type":"dynamic","desc":"Pinky up like I, then draw J-shape downward"},
  "K":{"hands":1,"type":"static","desc":"Index+middle up, thumb between them"},
  "L":{"hands":1,"type":"static","desc":"Index up, thumb out — L-shape"},
  "O":{"hands":1,"type":"static","desc":"All fingers form an O with thumb"},
  "R":{"hands":1,"type":"static","desc":"Index+middle fingers crossed"},
  "U":{"hands":1,"type":"static","desc":"Index+middle together pointing up"},
  "V":{"hands":1,"type":"static","desc":"Index+middle apart — victory/peace"},
  "W":{"hands":1,"type":"static","desc":"Index+middle+ring spread up"},
  "Y":{"hands":1,"type":"static","desc":"Thumb+pinky out, others folded"},
  "Z":{"hands":1,"type":"dynamic","desc":"Index pointing, trace Z in air (3 strokes)"},
  "HELLO":{"hands":1,"type":"dynamic","desc":"Open hand waves from forehead outward"},
  "THANK_YOU":{"hands":1,"type":"dynamic","desc":"Flat hand from chin sweeps forward"},
  "PLEASE":{"hands":1,"type":"dynamic","desc":"Open hand makes circle on chest"},
  "YES":{"hands":1,"type":"dynamic","desc":"Fist nods up and down"},
  "NO":{"hands":1,"type":"dynamic","desc":"Index+middle tap side-to-side"},
  "GOOD":{"hands":1,"type":"dynamic","desc":"Flat hand from chin moves forward"},
  "LOVE":{"hands":1,"type":"static","desc":"Index+thumb+pinky out (I Love You)"},
  "STOP":{"hands":1,"type":"dynamic","desc":"Flat hand raised sharply upward"},
  "COME":{"hands":1,"type":"dynamic","desc":"Open hand beckons inward"},
  "WAVE":{"hands":1,"type":"dynamic","desc":"Open hand swings left and right"},
  "OK":{"hands":1,"type":"static","desc":"Index+thumb circle, 3 fingers up"},
  "POINT":{"hands":1,"type":"static","desc":"Index finger extended only"},
  "THUMBS_UP":{"hands":1,"type":"static","desc":"Fist with thumb pointing up"},
  "NAMASTE":{"hands":2,"type":"static","desc":"Both palms pressed together, fingers up"},
  "FRIEND":{"hands":2,"type":"static","desc":"Both index fingers interlock"},
  "HELP":{"hands":2,"type":"static","desc":"Fist on other palm, lift up"},
  "PEACE":{"hands":2,"type":"static","desc":"V-sign with both hands"},
  "APPLAUSE":{"hands":2,"type":"dynamic","desc":"Clap both hands together repeatedly"},
};

const TIPS = {
  "A":"Tight fist, thumb on the side not over fingers",
  "B":"Keep 4 fingers straight together, thumb flat across palm",
  "C":"Don't close fingers fully — leave a C gap",
  "D":"Index up, curl middle+ring+pinky to touch thumb tip",
  "E":"All fingertips bent inward, thumb tucked beneath",
  "F":"Touch index tip to thumb tip; middle/ring/pinky straight",
  "J":"Start with pinky up (I-sign), draw a J downward — hook at bottom",
  "Z":"Point index finger, draw Z: right, diagonal-left, right",
  "HELLO":"Flat open hand at forehead, swing outward naturally",
  "THANK_YOU":"Flat hand starts at chin, sweeps forward and down",
  "PLEASE":"Open palm on chest, make smooth clockwise circles",
  "YES":"Fist (A-sign) and nod your wrist up and down",
  "NO":"Index+middle together, flick side to side",
  "WAVE":"Open palm relaxed, swing left and right 2-3 times",
  "NAMASTE":"Press both palms firmly together, fingers pointing up",
  "FRIEND":"Hook index fingers together, interlock them",
  "LOVE":"Index up + pinky up + thumb out = I Love You",
  "PEACE":"V-sign with index and middle, hold it firmly",
  "APPLAUSE":"Bring both flat palms together in clapping motion",
};

const dist2=(a,b)=>Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2);
const fExt=(lm,t,p)=>lm[t].y<lm[p].y-0.02;
const thOut=(lm)=>dist2(lm[4],lm[2])>0.07;
const extN=(lm)=>[fExt(lm,8,6),fExt(lm,12,10),fExt(lm,16,14),fExt(lm,20,18)].filter(Boolean).length;

function classifyOneHand(lm){
  const iE=fExt(lm,8,6),mE=fExt(lm,12,10),rE=fExt(lm,16,14),pE=fExt(lm,20,18);
  const tO=thOut(lm),n=extN(lm);
  const it=dist2(lm[8],lm[4]),mt=dist2(lm[12],lm[4]),pt=dist2(lm[20],lm[4]);
  const im=dist2(lm[8],lm[12]),ts=dist2(lm[4],lm[5]);
  if(!iE&&!mE&&!rE&&!pE&&tO&&it>0.09) return {sign:"A",conf:87};
  if(iE&&mE&&rE&&pE&&!tO&&ts<0.07) return {sign:"B",conf:91};
  if(!iE&&!mE&&n===0&&it>0.07&&it<0.17&&mt<0.14) return {sign:"C",conf:76};
  if(iE&&!mE&&!rE&&!pE&&it>0.08) return {sign:"D",conf:83};
  if(lm[8].y>lm[6].y&&lm[12].y>lm[10].y&&lm[16].y>lm[14].y&&!tO) return {sign:"E",conf:74};
  if(!iE&&mE&&rE&&pE&&it<0.06) return {sign:"F",conf:82};
  if(iE&&!mE&&!rE&&!pE&&tO&&Math.abs(lm[8].x-lm[5].x)>0.08&&Math.abs(lm[8].y-lm[5].y)<0.06) return {sign:"G",conf:75};
  if(iE&&mE&&!rE&&!pE&&!tO&&Math.abs(lm[8].y-lm[12].y)<0.04) return {sign:"H",conf:79};
  if(!iE&&!mE&&!rE&&pE&&!tO) return {sign:"I",conf:88};
  if(iE&&mE&&!rE&&!pE&&tO&&lm[4].x>Math.min(lm[8].x,lm[12].x)&&lm[4].x<Math.max(lm[8].x,lm[12].x)) return {sign:"K",conf:74};
  if(iE&&!mE&&!rE&&!pE&&tO&&Math.abs(lm[8].y-lm[5].y)>0.1) return {sign:"L",conf:90};
  if(!iE&&!mE&&!rE&&!pE&&it<0.08&&mt<0.1) return {sign:"O",conf:83};
  if(iE&&mE&&!rE&&!pE&&!tO&&im<0.03) return {sign:"R",conf:79};
  if(iE&&mE&&!rE&&!pE&&!tO&&im>=0.02&&im<0.06) return {sign:"U",conf:83};
  if(iE&&mE&&!rE&&!pE&&!tO&&im>=0.06) return {sign:"V",conf:87};
  if(iE&&mE&&rE&&!pE) return {sign:"W",conf:84};
  if(!iE&&!mE&&!rE&&pE&&tO&&pt>0.12) return {sign:"Y",conf:89};
  if(iE&&!mE&&!rE&&pE&&tO) return {sign:"LOVE",conf:90};
  if(!iE&&!mE&&!rE&&!pE&&tO&&lm[4].y<lm[3].y) return {sign:"THUMBS_UP",conf:92};
  if(iE&&!mE&&!rE&&!pE&&!tO) return {sign:"POINT",conf:85};
  if(!iE&&mE&&rE&&pE&&it<0.06) return {sign:"OK",conf:88};
  if(iE&&mE&&rE&&pE&&tO&&ts>0.09) return {sign:"HELLO",conf:80};
  return null;
}

function classifyTwoHands(lm0,lm1){
  const wd=dist2(lm0[0],lm1[0]),n0=extN(lm0),n1=extN(lm1);
  if(wd<0.22&&n0>=3&&n1>=3&&Math.abs(lm0[0].y-lm1[0].y)<0.15) return {sign:"NAMASTE",conf:89};
  if(dist2(lm0[8],lm1[8])<0.07&&wd<0.28) return {sign:"FRIEND",conf:83};
  if(((n0===0&&n1>=3)||(n1===0&&n0>=3))&&wd<0.18) return {sign:"HELP",conf:81};
  if(fExt(lm0,8,6)&&fExt(lm0,12,10)&&!fExt(lm0,16,14)&&!fExt(lm0,20,18)&&fExt(lm1,8,6)&&fExt(lm1,12,10)&&!fExt(lm1,16,14)&&!fExt(lm1,20,18)) return {sign:"PEACE",conf:87};
  if(n0>=4&&n1>=4&&wd<0.20) return {sign:"APPLAUSE",conf:78};
  return null;
}

function checkLighting(mh){ if(!mh||!mh.length) return {ok:true,score:1}; const s=mh.reduce((a,h)=>a+(h.score||1),0)/mh.length; return {ok:s>=0.65,score:s}; }

function detectDynamic(history){
  if(history.length<8) return null;
  const recent=history.slice(-16);
  const wx=recent.map(f=>f[0]?.[0]?.x).filter(v=>v!=null);
  const wy=recent.map(f=>f[0]?.[0]?.y).filter(v=>v!=null);
  if(wx.length<6) return null;
  const xR=Math.max(...wx)-Math.min(...wx),yR=Math.max(...wy)-Math.min(...wy);
  let hD=0,vD=0;
  for(let i=2;i<wx.length;i++) if((wx[i]-wx[i-1])*(wx[i-1]-wx[i-2])<0&&Math.abs(wx[i]-wx[i-1])>0.01) hD++;
  for(let i=2;i<wy.length;i++) if((wy[i]-wy[i-1])*(wy[i-1]-wy[i-2])<0&&Math.abs(wy[i]-wy[i-1])>0.008) vD++;
  const lm0=recent[recent.length-1]?.[0];
  // J-sign: I-shape + downward J-curve with hook
  if(lm0){
    const isI=!fExt(lm0,8,6)&&!fExt(lm0,12,10)&&!fExt(lm0,16,14)&&fExt(lm0,20,18)&&!thOut(lm0);
    const lastWy=wy.slice(-8);
    const wentDown=lastWy.length>1&&lastWy[lastWy.length-1]-lastWy[0]>0.08;
    const hooked=wx.slice(-4).some((x,i,arr)=>i>0&&(x-arr[i-1])>0.015);
    if(isI&&wentDown&&hooked&&yR>0.10) return {sign:"J",conf:82,isDynamic:true};
  }
  // Z-sign: index only + 3-stroke zigzag
  if(lm0){
    const isIndex=fExt(lm0,8,6)&&!fExt(lm0,12,10)&&!fExt(lm0,16,14)&&!fExt(lm0,20,18)&&!thOut(lm0);
    if(isIndex&&hD>=3&&xR>0.14) return {sign:"Z",conf:80,isDynamic:true};
  }
  // PLEASE: open palm + circular motion (both axes oscillate)
  if(lm0&&extN(lm0)>=3){
    if(xR>0.06&&yR>0.06&&hD>=1&&vD>=1&&hD+vD>=3) return {sign:"PLEASE",conf:81,isDynamic:true};
  }
  // WAVE/HELLO
  if(xR>0.13&&hD>=2){ const open=lm0&&extN(lm0)>=3; return open?{sign:"WAVE",conf:86,isDynamic:true}:{sign:"HELLO",conf:82,isDynamic:true}; }
  // SWING
  if(xR>0.22&&hD<=1) return {sign:"SWING",conf:78,isDynamic:true};
  // YES
  if(yR>0.10&&vD>=2&&lm0&&extN(lm0)===0) return {sign:"YES",conf:82,isDynamic:true};
  // NO
  if(xR>0.09&&hD>=2&&lm0&&(extN(lm0)===1||extN(lm0)===2)) return {sign:"NO",conf:79,isDynamic:true};
  // COME
  const wz=recent.map(f=>f[0]?.[0]?.z).filter(v=>v!=null);
  if(wz.length>=5&&(Math.max(...wz)-Math.min(...wz))>0.07&&xR<0.07) return {sign:"COME",conf:76,isDynamic:true};
  // APPLAUSE
  const wx1=recent.map(f=>f[1]?.[0]?.x).filter(v=>v!=null);
  if(wx1.length>=4){ const dists=wx.slice(-4).map((x,i)=>Math.abs(x-(wx1[i]||x))); if((Math.max(...dists)-Math.min(...dists))>0.06) return {sign:"APPLAUSE",conf:84,isDynamic:true}; }
  return null;
}

function classifyGesture(multiLM,multiHandedness,history){
  const hands=multiLM||[];
  if(hands.length>=2){ const two=classifyTwoHands(hands[0],hands[1]); if(two&&two.conf>=78) return {...two,handCount:2}; }
  const dyn=detectDynamic(history);
  if(dyn&&dyn.conf>=76) return {...dyn,handCount:hands.length};
  if(hands.length>=1){ const one=classifyOneHand(hands[0]); if(one) return {...one,handCount:1,isDynamic:false}; }
  return null;
}

const getTip=(sign,acc)=>{
  if(acc>=88) return `Perfect ${sign}! Production-quality signing.`;
  if(acc>=72) return TIPS[sign]||`Good ${sign}! Refine your form slightly.`;
  return TIPS[sign]?`${TIPS[sign]}`:`Practice ${sign} — watch finger positions carefully.`;
};

const FRAME_HIST=20;

export default function PracticeSessionPage() {
  const videoRef=useRef(null),canvasRef=useRef(null),histRef=useRef([]),fpsRef=useRef({count:0,last:Date.now()});
  const [category,setCategory]=useState("ASL Letters");
  const [targetSign,setTarget]=useState("A");
  const [status,setStatus]=useState("WAITING");
  const [pred,setPred]=useState(null);
  const [acc,setAcc]=useState(0);
  const [hCount,setHCount]=useState(0);
  const [hLabels,setHLabels]=useState([]);
  const [lighting,setLighting]=useState({ok:true,score:1});
  const [camReady,setCamReady]=useState(false);
  const [fps,setFps]=useState(0);
  const [stats,setStats]=useState({attempts:0,passed:0,streak:0});
  const [log,setLog]=useState([]);
  const [showGuide,setShowGuide]=useState(true);
  const signs=SIGN_CATEGORIES[category];
  const info=SIGN_INFO[targetSign]||{hands:1,type:"static",desc:""};

  const onResults=useCallback((results)=>{
    fpsRef.current.count++;
    const now=Date.now();
    if(now-fpsRef.current.last>=1000){setFps(fpsRef.current.count);fpsRef.current.count=0;fpsRef.current.last=now;}
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    canvas.width=videoRef.current?.videoWidth||640;
    canvas.height=videoRef.current?.videoHeight||480;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();ctx.scale(-1,1);ctx.translate(-canvas.width,0);
    ctx.drawImage(results.image,0,0,canvas.width,canvas.height);
    ctx.restore();
    const multiLM=results.multiHandLandmarks||[];
    const multiH=results.multiHandedness||[];
    setLighting(checkLighting(multiH));
    setHCount(multiLM.length);
    setHLabels(multiH.map(h=>h.label));
    histRef.current.push(multiLM.map(h=>h));
    if(histRef.current.length>FRAME_HIST) histRef.current.shift();
    multiLM.forEach((lms,hi)=>{
      const label=multiH[hi]?.label||(hi===0?"Right":"Left");
      const col=label==="Right"?"#38BDF8":"#FB923C";
      const conn=window.HAND_CONNECTIONS||[];
      ctx.save();ctx.scale(-1,1);ctx.translate(-canvas.width,0);
      conn.forEach(([s,e])=>{ctx.beginPath();ctx.moveTo(lms[s].x*canvas.width,lms[s].y*canvas.height);ctx.lineTo(lms[e].x*canvas.width,lms[e].y*canvas.height);ctx.strokeStyle=col+"88";ctx.lineWidth=2.5;ctx.stroke();});
      lms.forEach((lm,i)=>{const r=i===0?7:i%4===0?5:3.5;ctx.beginPath();ctx.arc(lm.x*canvas.width,lm.y*canvas.height,r,0,2*Math.PI);ctx.fillStyle=i===0?col:i%4===0?"#fff":col;ctx.fill();});
      const w=lms[0];ctx.fillStyle=col+"CC";ctx.beginPath();ctx.roundRect(w.x*canvas.width-28,w.y*canvas.height+8,56,18,6);ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText(`${label} Hand`,w.x*canvas.width,w.y*canvas.height+20);
      ctx.restore();
    });
    if(multiLM.length>0){
      const r=classifyGesture(multiLM,multiH,histRef.current);
      if(r){setPred(r);const match=r.sign===targetSign;const a=match?Math.min(97,r.conf+Math.floor(Math.random()*10)):Math.max(10,r.conf-30);setAcc(a);setStatus(match&&a>=68?"CORRECT":"DETECTING");}
      else{setPred(null);setStatus("DETECTING");}
    } else{setPred(null);setStatus("WAITING");}
  },[targetSign]);

  useEffect(()=>{
    let cam=null,hands=null;
    const init=async()=>{
      if(!window.Hands||!window.Camera) return;
      try{
        hands=new window.Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`});
        hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:0.5,minTrackingConfidence:0.45});
        hands.onResults(onResults);
        if(videoRef.current){cam=new window.Camera(videoRef.current,{onFrame:async()=>{if(hands&&videoRef.current)await hands.send({image:videoRef.current});},width:640,height:480});await cam.start();setCamReady(true);}
      }catch(e){console.error("MP error:",e);}
    };
    const t=setTimeout(init,500);
    return()=>{clearTimeout(t);cam?.stop?.();hands?.close?.();};
  },[onResults]);

  useEffect(()=>{
    if(status==="CORRECT"){const t=setTimeout(()=>{setStats(p=>({attempts:p.attempts+1,passed:p.passed+1,streak:p.streak+1}));setLog(p=>[{sign:targetSign,acc,passed:true,time:new Date().toLocaleTimeString()},...p.slice(0,11)]);},700);return()=>clearTimeout(t);}
  },[status]);

  const go=(s)=>{setTarget(s);setPred(null);setStatus("WAITING");setAcc(0);};
  const next=()=>{const i=signs.indexOf(targetSign);go(signs[(i+1)%signs.length]);};
  const prev=()=>{const i=signs.indexOf(targetSign);go(signs[(i-1+signs.length)%signs.length]);};
  const sBg=status==="CORRECT"?"#059669":status==="DETECTING"?"#D97706":"#475569";

  return(
    <div style={{background:T.bg,minHeight:"100vh",padding:"24px 0"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:18}}>

        {/* HEADER */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:"18px 22px"}}>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <div>
              <h1 style={{fontSize:20,fontWeight:800,color:T.text,margin:0,display:"flex",alignItems:"center",gap:10}}>
                <span style={{width:34,height:34,borderRadius:12,background:"linear-gradient(135deg,#0284C7,#7C3AED)",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><Hand size={17} color="white"/></span>
                AI Practice Studio
              </h1>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8,alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,background:hCount===0?"#F1F5F9":hCount===1?"#EFF6FF":"#ECFDF5",color:hCount===0?T.muted:hCount===1?T.primary:T.emerald,border:`1px solid ${hCount===0?T.border:hCount===1?"#BFDBFE":"#A7F3D0"}`}}>
                  {hCount===0?"No hands":hCount===1?`✋ ${hLabels[0]||"Right"} hand`:`🙌 ${hLabels.join(" + ")} hands`}
                </span>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,background:lighting.ok?"#F0FDF4":"#FEF3C7",color:lighting.ok?T.emerald:T.amber,border:`1px solid ${lighting.ok?"#BBF7D0":"#FDE68A"}`,display:"flex",alignItems:"center",gap:4}}>
                  <Sun size={11}/>{lighting.ok?"Good lighting":"⚠ Poor lighting"}
                </span>
                <span style={{fontSize:11,color:T.muted,fontWeight:600}}>{fps} FPS · maxHands:2</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[{v:`${stats.passed}/${stats.attempts}`,l:"Passed",c:T.emerald,bg:"#ECFDF5"},{v:`🔥 ${stats.streak}`,l:"Streak",c:T.orange,bg:"#FFF7ED"}].map((s,i)=>(
                <div key={i} style={{background:s.bg,border:`1px solid ${T.border}`,borderRadius:14,padding:"9px 14px",textAlign:"center"}}>
                  <p style={{fontSize:16,fontWeight:800,color:s.c,margin:0}}>{s.v}</p>
                  <p style={{fontSize:11,color:T.muted,marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            {Object.keys(SIGN_CATEGORIES).map(cat=>{const active=category===cat;return(
              <button key={cat} onClick={()=>{setCategory(cat);go(SIGN_CATEGORIES[cat][0]);}}
                style={{padding:"7px 16px",borderRadius:12,fontSize:12,fontWeight:700,border:`1px solid ${active?T.primary:T.border}`,cursor:"pointer",background:active?T.primary:T.card,color:active?"#fff":T.muted,transition:"all 0.15s",boxShadow:active?`0 4px 12px ${T.primary}33`:"none"}}>{cat}</button>
            );})}
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 350px",gap:18}}>

          {/* CAMERA PANEL */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",overflow:"hidden"}}>
              <div style={{background:sBg,padding:"10px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{color:"#fff",fontSize:13,fontWeight:700}}>{status==="WAITING"?"✋ Raise your hand(s) to begin":status==="CORRECT"?"✅ Correct! Excellent sign!":"🔍 Analyzing gesture..."}</span>
                <div style={{display:"flex",gap:6}}>
                  {info.hands===2&&<span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:999,display:"flex",alignItems:"center",gap:4}}><Users size={10}/>2 Hands Required</span>}
                  {info.type==="dynamic"&&<span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:999,display:"flex",alignItems:"center",gap:4}}><Activity size={10}/>Motion</span>}
                </div>
              </div>
              <div style={{position:"relative",background:"#0F172A",aspectRatio:"4/3"}}>
                <video ref={videoRef} style={{position:"absolute",width:"100%",height:"100%",objectFit:"cover",opacity:0}} autoPlay playsInline muted/>
                <canvas ref={canvasRef} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                {!camReady&&(
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#0F172A",flexDirection:"column",gap:14}}>
                    <div style={{width:52,height:52,borderRadius:"50%",border:"4px solid #38BDF8",borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>
                    <div style={{textAlign:"center"}}><p style={{color:"#F8FAFC",fontWeight:700,fontSize:14,margin:0}}>Loading AI Camera...</p><p style={{color:"#64748B",fontSize:11,marginTop:4}}>MediaPipe Hands — dual-hand · J · Z · PLEASE</p></div>
                  </div>
                )}
                {camReady&&<>
                  <div style={{position:"absolute",top:10,right:10,background:"rgba(15,23,42,0.75)",backdropFilter:"blur(8px)",borderRadius:10,padding:"5px 10px"}}><p style={{color:"#fff",fontSize:10,fontWeight:700,margin:0}}>{hCount===0?"👁 Waiting...":hCount===1?"1 hand":"🙌 2 hands"}</p></div>
                  {hCount>0&&<div style={{position:"absolute",bottom:10,left:10,display:"flex",gap:6}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#38BDF8",background:"rgba(15,23,42,0.75)",padding:"2px 8px",borderRadius:999}}>● Right</span>
                    {hCount===2&&<span style={{fontSize:10,fontWeight:700,color:"#FB923C",background:"rgba(15,23,42,0.75)",padding:"2px 8px",borderRadius:999}}>● Left</span>}
                  </div>}
                </>}
              </div>
              {pred&&(
                <div style={{padding:"14px 18px",background:"#F8FAFC",borderTop:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{flexShrink:0}}>
                      <p style={{fontSize:10,fontWeight:700,color:T.muted,margin:0,textTransform:"uppercase",letterSpacing:1}}>Detected</p>
                      <p style={{fontSize:26,fontWeight:800,color:T.text,margin:0,lineHeight:1.1}}>{pred.sign}</p>
                      <p style={{fontSize:10,color:T.muted,marginTop:2}}>{pred.isDynamic?"⚡ Motion":"🖐 Static"} · {pred.handCount}H</p>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,fontWeight:700,color:T.muted}}>Confidence</span><span style={{fontSize:11,fontWeight:800,color:acc>=75?T.emerald:T.amber}}>{acc}%</span></div>
                      <div style={{background:T.border,borderRadius:999,height:9,overflow:"hidden"}}>
                        <div style={{height:9,borderRadius:999,width:`${acc}%`,background:acc>=75?"linear-gradient(to right,#059669,#10B981)":"linear-gradient(to right,#D97706,#FBBF24)",transition:"width 0.3s ease"}}/>
                      </div>
                      <p style={{fontSize:11,color:T.muted,marginTop:5,fontStyle:"italic"}}>{getTip(pred.sign,acc)}</p>
                    </div>
                    {status==="CORRECT"?<CheckCircle2 size={32} color={T.emerald} style={{flexShrink:0}}/>:<XCircle size={32} color="#F43F5E" style={{flexShrink:0}}/>}
                  </div>
                </div>
              )}
            </div>

            {/* Sign strip */}
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
              <button onClick={prev} style={{width:32,height:32,borderRadius:9,border:`1px solid ${T.border}`,background:T.soft,cursor:"pointer",fontWeight:800,color:T.muted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>←</button>
              <div style={{flex:1,overflowX:"auto",display:"flex",gap:5,padding:"2px 0"}}>
                {signs.map(s=>{const active=s===targetSign;const si=SIGN_INFO[s];return(
                  <button key={s} onClick={()=>go(s)} style={{padding:"7px 10px",borderRadius:11,cursor:"pointer",flexShrink:0,fontSize:11,fontWeight:800,border:`1px solid ${active?T.primary:T.border}`,background:active?T.primary:T.card,color:active?"#fff":T.muted,transform:active?"scale(1.08)":"none",transition:"all 0.15s",position:"relative"}}>
                    {s}{si?.hands===2&&<span style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:T.orange,border:"2px solid white"}}/>}
                  </button>);})}
              </div>
              <button onClick={next} style={{width:32,height:32,borderRadius:9,border:`1px solid ${T.border}`,background:T.soft,cursor:"pointer",fontWeight:800,color:T.muted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>→</button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:18}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                <div><p style={{fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,margin:0}}>Target Sign</p><p style={{fontSize:52,fontWeight:800,color:T.primary,margin:"4px 0 0",lineHeight:1,fontFamily:"monospace"}}>{targetSign}</p></div>
                <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,border:`1px solid ${info.hands===2?"#FED7AA":"#BFDBFE"}`,background:info.hands===2?"#FFF7ED":"#EFF6FF",color:info.hands===2?T.orange:T.primary}}>{info.hands===2?"✋ 2 Hands":"☝️ 1 Hand"}</span>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,border:`1px solid ${info.type==="dynamic"?"#DDD6FE":"#A7F3D0"}`,background:info.type==="dynamic"?"#F5F3FF":"#ECFDF5",color:info.type==="dynamic"?T.violet:T.emerald}}>{info.type==="dynamic"?"⚡ Motion":"🖐 Static"}</span>
                </div>
              </div>
              <div style={{marginTop:12,padding:"10px 12px",borderRadius:12,background:"#F0F9FF",borderLeft:`4px solid ${T.primary}`}}><p style={{fontSize:12,color:"#0369A1",margin:0,lineHeight:1.5,fontWeight:500}}>{info.desc}</p></div>
              {TIPS[targetSign]&&<div style={{marginTop:10,padding:"10px 12px",borderRadius:12,background:"#FFFBEB",border:`1px solid #FDE68A`}}><p style={{fontSize:10,fontWeight:700,color:T.amber,margin:"0 0 3px",display:"flex",alignItems:"center",gap:4}}><Lightbulb size={11}/>How to do it</p><p style={{fontSize:11,color:"#92400E",margin:0,lineHeight:1.5}}>{TIPS[targetSign]}</p></div>}
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <button onClick={prev} style={{flex:1,padding:"8px",borderRadius:10,cursor:"pointer",background:T.soft,border:`1px solid ${T.border}`,fontWeight:700,color:T.muted,fontSize:12}}>← Prev</button>
                <button onClick={next} style={{flex:1,padding:"8px",borderRadius:10,cursor:"pointer",background:T.primary,border:"none",fontWeight:700,color:"#fff",fontSize:12}}>Next →</button>
              </div>
            </div>

            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
              <button onClick={()=>setShowGuide(!showGuide)} style={{width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:12,fontWeight:800,color:T.text,display:"flex",alignItems:"center",gap:7}}><BookOpen size={14} color={T.primary}/>Sign Reference Guide</span>
                <span style={{fontSize:10,color:T.muted}}>{showGuide?"▲":"▼"}</span>
              </button>
              {showGuide&&<div style={{padding:"0 8px 8px",maxHeight:200,overflowY:"auto"}}>
                {signs.map(s=>{const si=SIGN_INFO[s];const active=s===targetSign;return(
                  <div key={s} onClick={()=>go(s)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:10,cursor:"pointer",marginBottom:2,background:active?"#EFF6FF":"transparent",border:active?`1px solid #BFDBFE`:"1px solid transparent"}}>
                    <span style={{fontSize:11,fontWeight:800,color:T.primary,width:44,flexShrink:0}}>{s}</span>
                    <p style={{fontSize:10,color:T.muted,margin:0,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{si?.desc||""}</p>
                    <div style={{display:"flex",gap:3,flexShrink:0}}>
                      {si?.hands===2&&<span style={{fontSize:8,fontWeight:700,padding:"1px 4px",borderRadius:999,background:"#FFF7ED",color:T.orange}}>2H</span>}
                      {si?.type==="dynamic"&&<span style={{fontSize:8,fontWeight:700,padding:"1px 4px",borderRadius:999,background:"#F5F3FF",color:T.violet}}>MOT</span>}
                    </div>
                  </div>);})}
              </div>}
            </div>

            {log.length>0&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <p style={{fontSize:10,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:1,margin:0}}>Session Log</p>
                <button onClick={()=>setLog([])} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:10,color:T.muted,fontWeight:700}}><RotateCcw size={9}/>Clear</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {log.map((e,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 9px",borderRadius:9,background:e.passed?"#F0FDF4":"#FFF1F2"}}>
                    {e.passed?<CheckCircle2 size={13} color={T.emerald}/>:<XCircle size={13} color={T.red}/>}
                    <span style={{fontSize:11,fontWeight:800,color:T.text,width:56}}>{e.sign}</span>
                    <span style={{fontSize:11,fontWeight:700,color:e.acc>=75?T.emerald:T.red}}>{e.acc}%</span>
                    <span style={{fontSize:10,color:T.muted,marginLeft:"auto"}}>{e.time}</span>
                  </div>
                ))}
              </div>
            </div>}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
