import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Flame, Target, BookOpen, Camera, Award, ChevronRight, Zap, Clock, CheckCircle2, BarChart2, History, Star, Sparkles, Brain, Activity } from "lucide-react";

const SIGNS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","HELLO","THANK_YOU"];
const seed  = (n) => { let x=Math.sin(n+1)*10000; return x-Math.floor(x); };
const MASTERY = Object.fromEntries(SIGNS.map((s,i)=>[s, Math.round(seed(i*7+3)*75+20)]));
const WEEKLY  = [3,5,2,7,4,6,4];
const DAYS    = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const RECENT  = [
  {sign:"HELLO",  acc:94, pass:true,  ago:"2h ago"},
  {sign:"B",      acc:78, pass:true,  ago:"2h ago"},
  {sign:"A",      acc:89, pass:true,  ago:"3h ago"},
  {sign:"C",      acc:62, pass:false, ago:"Yesterday"},
  {sign:"NAMASTE",acc:85, pass:true,  ago:"Yesterday"},
];
const mastered = Object.values(MASTERY).filter(v=>v>=80).length;
const inProg   = Object.values(MASTERY).filter(v=>v>=40&&v<80).length;
const avgAcc   = Math.round(Object.values(MASTERY).reduce((a,b)=>a+b,0)/SIGNS.length);
const maxW     = Math.max(...WEEKLY);

const C = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

/* Animated counting number */
function CountUp({ target, duration=1200, suffix="" }) {
  const [val, setVal] = useState(0);
  useEffect(()=>{
    let start=null;
    const step = (ts) => {
      if(!start) start=ts;
      const prog = Math.min((ts-start)/duration,1);
      const ease = 1-Math.pow(1-prog,3);
      setVal(Math.round(ease*target));
      if(prog<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[target,duration]);
  return <>{val}{suffix}</>;
}

/* Floating particle */
const Particle = ({x,y,size,delay,color}) => (
  <div style={{
    position:"absolute", left:`${x}%`, top:`${y}%`,
    width:size, height:size, borderRadius:"50%",
    background:color, opacity:0.6,
    animation:`particle ${3+delay}s ease-in-out infinite`,
    animationDelay:`${delay}s`,
    "--dx":`${(Math.random()-0.5)*30}px`,
    pointerEvents:"none",
  }}/>
);

const PARTICLES = Array.from({length:18},(_,i)=>({
  x:Math.random()*100, y:20+Math.random()*80,
  size:Math.random()*6+2,
  delay:Math.random()*4,
  color:["rgba(255,255,255,0.4)","rgba(255,255,255,0.3)","rgba(251,191,36,0.5)"][i%3],
}));

export default function DashboardPage({ onStartPractice, onStartQuiz, onViewHistory }) {
  const [hoverSign, setHoverSign] = useState(null);
  const [mounted,   setMounted]   = useState(false);
  const [hoverCard, setHoverCard] = useState(null);

  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),80); return()=>clearTimeout(t); },[]);

  const STAT_CARDS = [
    {icon:<TrendingUp size={21} color={C.primary}/>, label:"Avg Accuracy",    value:avgAcc,     suffix:"%", sub:"across all signs",    accent:C.primary, bg:"linear-gradient(135deg,#EFF6FF,#DBEAFE)", shadow:"rgba(2,132,199,0.15)"},
    {icon:<CheckCircle2 size={21} color={C.emerald}/>, label:"Signs Mastered",value:mastered,   suffix:"",  sub:`of ${SIGNS.length} total`, accent:C.emerald, bg:"linear-gradient(135deg,#ECFDF5,#D1FAE5)", shadow:"rgba(5,150,105,0.15)"},
    {icon:<Target size={21} color={C.violet}/>, label:"In Progress",         value:inProg,      suffix:"",  sub:"almost there",          accent:C.violet,  bg:"linear-gradient(135deg,#F5F3FF,#EDE9FE)", shadow:"rgba(124,58,237,0.15)"},
    {icon:<Activity size={21} color={C.amber}/>, label:"Practice Today",     value:42,          suffix:"m", sub:"3 sessions today",       accent:C.amber,   bg:"linear-gradient(135deg,#FFFBEB,#FEF3C7)", shadow:"rgba(217,119,6,0.15)"},
  ];

  return (
    <div style={{background:C.bg, minHeight:"100vh", padding:"32px 0",
      backgroundImage:"radial-gradient(#CBD5E1 1px,transparent 1px)", backgroundSize:"28px 28px"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 24px",display:"flex",flexDirection:"column",gap:24}}>

        {/* ── HERO CARD ──────────────────────────────────────── */}
        <div className={`anim-fade-in-down`} style={{
          background:"linear-gradient(135deg,#0284C7 0%,#0369A1 35%,#7C3AED 75%,#6D28D9 100%)",
          backgroundSize:"200% 200%", animation:"gradientShift 8s ease infinite",
          borderRadius:28, padding:"36px 40px", color:"white",
          boxShadow:"0 16px 48px rgba(2,132,199,0.30), 0 4px 16px rgba(124,58,237,0.2)",
          position:"relative", overflow:"hidden",
        }}>
          {/* Floating particles */}
          {PARTICLES.map((p,i)=><Particle key={i} {...p}/>)}

          {/* Decorative orbs */}
          <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.07)",animation:"float 5s ease-in-out infinite"}}/>
          <div style={{position:"absolute",bottom:-30,right:120,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.05)",animation:"float 7s ease-in-out infinite 1.5s"}}/>
          <div style={{position:"absolute",top:20,left:"40%",width:60,height:60,borderRadius:"50%",background:"rgba(251,191,36,0.12)",animation:"float 4s ease-in-out infinite 0.5s"}}/>

          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:24,position:"relative"}}>
            <div style={{flex:1,minWidth:280}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div className="anim-pulse" style={{width:8,height:8,borderRadius:"50%",background:"#4ADE80"}}/>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:1.5,opacity:0.9}}>WELCOME BACK 👋</span>
              </div>
              <h1 style={{fontSize:32,fontWeight:800,margin:"0 0 8px",lineHeight:1.15,letterSpacing:-0.5}}>
                Your Learning Dashboard
              </h1>
              <p style={{fontSize:14,opacity:0.82,marginBottom:22,lineHeight:1.6}}>
                Track progress · Practice signs · Climb the leaderboard
              </p>

              {/* Scrolling sign ticker */}
              <div style={{overflow:"hidden",marginBottom:22,height:28,
                background:"rgba(255,255,255,0.1)",borderRadius:8,border:"1px solid rgba(255,255,255,0.2)"}}>
                <div className="ticker" style={{display:"flex",gap:24,paddingTop:6,paddingLeft:12}}>
                  {[...SIGNS,...SIGNS].map((s,i)=>(
                    <span key={i} style={{fontSize:11,fontWeight:700,opacity:0.7,whiteSpace:"nowrap"}}>
                      {s} ✋
                    </span>
                  ))}
                </div>
              </div>

              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button onClick={onStartPractice} className="btn-press ripple-btn" style={{
                  display:"flex",alignItems:"center",gap:8,background:"white",color:C.primary,
                  border:"none",borderRadius:14,padding:"11px 22px",fontWeight:800,fontSize:13,
                  cursor:"pointer",boxShadow:"0 6px 20px rgba(0,0,0,0.2)"}}>
                  <Camera size={16}/> Start Practicing
                </button>
                <button onClick={onStartQuiz} className="btn-press ripple-btn" style={{
                  display:"flex",alignItems:"center",gap:8,background:C.orange,color:"white",
                  border:"none",borderRadius:14,padding:"11px 22px",fontWeight:800,fontSize:13,
                  cursor:"pointer",boxShadow:"0 6px 20px rgba(249,115,22,0.4)"}}>
                  <Zap size={16}/> Speed Quiz
                </button>
                <button onClick={onViewHistory} className="btn-press" style={{
                  display:"flex",alignItems:"center",gap:8,
                  background:"rgba(255,255,255,0.15)",color:"white",
                  border:"1px solid rgba(255,255,255,0.35)",borderRadius:14,
                  padding:"11px 22px",fontWeight:700,fontSize:13,cursor:"pointer",
                  backdropFilter:"blur(8px)"}}>
                  <History size={16}/> History
                </button>
              </div>
            </div>

            {/* Hero stat pills */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {v:mastered, suf:"", l:"Signs Mastered", ic:"✨", dur:800},
                {v:6,        suf:"", l:"Day Streak 🔥",  ic:"🔥", dur:600},
                {v:avgAcc,   suf:"%",l:"Avg Accuracy",   ic:"🎯", dur:1000},
              ].map((s,i)=>(
                <div key={i} className={`anim-fade-in-right stagger-${i+2}`}
                  style={{background:"rgba(255,255,255,0.16)",backdropFilter:"blur(12px)",
                    border:"1px solid rgba(255,255,255,0.28)",borderRadius:20,
                    padding:"16px 24px",textAlign:"center",minWidth:130,
                    boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
                  <p style={{fontSize:32,fontWeight:800,color:"white",margin:0,lineHeight:1}}>
                    {mounted ? <CountUp target={s.v} duration={s.dur} suffix={s.suf}/> : "0"+s.suf}
                  </p>
                  <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.82)",marginTop:6}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ──────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16}}>
          {STAT_CARDS.map((sc,i)=>(
            <div key={i} className={mounted?"anim-fade-in-up":""} style={{animationDelay:i*0.08+"s"}}>
              <div className="card-hover"
                onMouseEnter={()=>setHoverCard(i)} onMouseLeave={()=>setHoverCard(null)}
                style={{background:sc.bg,border:`1px solid ${C.border}`,borderRadius:20,
                  boxShadow: hoverCard===i ? `0 16px 40px ${sc.shadow}` : `0 4px 16px ${sc.shadow}`,
                  padding:"20px 22px",display:"flex",alignItems:"flex-start",gap:16,
                  transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)"}}>
                <div style={{width:46,height:46,borderRadius:15,background:"rgba(255,255,255,0.9)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:`0 4px 12px ${sc.shadow}`,flexShrink:0,
                  transition:"transform 0.2s",
                  transform:hoverCard===i?"scale(1.1) rotate(5deg)":"scale(1) rotate(0)"}}>
                  {sc.icon}
                </div>
                <div>
                  <p style={{fontSize:26,fontWeight:800,color:C.text,lineHeight:1,margin:0}}>
                    {mounted ? <CountUp target={sc.value} suffix={sc.suffix} duration={900+i*100}/> : "0"+sc.suffix}
                  </p>
                  <p style={{fontSize:12,fontWeight:700,color:sc.accent,marginTop:3}}>{sc.label}</p>
                  <p style={{fontSize:11,color:C.muted,marginTop:2}}>{sc.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MID ROW ─────────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>

          {/* Weekly Chart */}
          <div className="card-hover" style={{background:C.card,border:`1px solid ${C.border}`,
            borderRadius:20,boxShadow:"0 4px 20px rgba(15,23,42,0.06)",padding:22}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
              <p style={{fontWeight:800,fontSize:13,color:C.text,display:"flex",alignItems:"center",gap:6,margin:0}}>
                <BarChart2 size={16} color={C.primary}/>Weekly Activity
              </p>
              <span style={{fontSize:11,background:"#EFF6FF",color:C.primary,
                padding:"2px 10px",borderRadius:999,fontWeight:700}}>This week</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100,position:"relative"}}>
              {/* Grid lines */}
              {[0,1,2].map(l=>(
                <div key={l} style={{position:"absolute",left:0,right:0,
                  top:`${l*33}%`,borderTop:"1px dashed #F1F5F9"}}/>
              ))}
              {WEEKLY.map((v,i)=>{
                const isToday = i===6;
                return (
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative",zIndex:1}}>
                    <span style={{fontSize:10,fontWeight:800,color:isToday?C.primary:C.muted}}>{v}</span>
                    <div style={{width:"100%",borderRadius:"6px 6px 0 0",
                      height:mounted?`${(v/maxW)*84}px`:"0px",
                      background:isToday?`linear-gradient(to top,${C.primary},#38BDF8)`:"linear-gradient(to top,#CBD5E1,#E2E8F0)",
                      boxShadow:isToday?`0 4px 12px ${C.primary}44`:"none",
                      transition:"height 0.9s cubic-bezier(0.34,1.56,0.64,1)",
                      transitionDelay:i*0.08+"s"}}/>
                    <span style={{fontSize:9,color:isToday?C.primary:C.muted,fontWeight:isToday?700:500}}>{DAYS[i]}</span>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:12,padding:"8px 12px",background:"#EFF6FF",borderRadius:10,
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:C.muted,fontWeight:600}}>Total sessions</span>
              <span style={{fontSize:13,fontWeight:800,color:C.primary}}>
                {mounted?<CountUp target={WEEKLY.reduce((a,b)=>a+b,0)} duration={800}/>:0}
              </span>
            </div>
          </div>

          {/* Recent Practice */}
          <div className="card-hover" style={{background:C.card,border:`1px solid ${C.border}`,
            borderRadius:20,boxShadow:"0 4px 20px rgba(15,23,42,0.06)",padding:22}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <p style={{fontWeight:800,fontSize:13,color:C.text,display:"flex",alignItems:"center",gap:6,margin:0}}>
                <Clock size={16} color={C.violet}/>Recent Practice
              </p>
              <button onClick={onViewHistory} style={{fontSize:11,color:C.primary,fontWeight:700,
                background:"none",border:"none",cursor:"pointer"}}>View all →</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {RECENT.map((r,i)=>(
                <div key={i} className={`anim-slide-right stagger-${i+1}`}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",
                    borderRadius:13,
                    background:r.pass?"linear-gradient(90deg,#F0FDF4,#F8FAFC)":"linear-gradient(90deg,#FFF1F2,#F8FAFC)",
                    borderLeft:`3px solid ${r.pass?C.emerald:"#E11D48"}`}}>
                  <div style={{width:34,height:34,borderRadius:10,
                    background:r.pass?"linear-gradient(135deg,#059669,#34D399)":"linear-gradient(135deg,#E11D48,#FB7185)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,fontWeight:800,color:"white",flexShrink:0,
                    boxShadow:r.pass?"0 3px 8px rgba(5,150,105,0.3)":"0 3px 8px rgba(225,29,72,0.3)"}}>
                    {r.sign.slice(0,2)}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{width:"100%",height:5,borderRadius:999,background:r.pass?"#D1FAE5":"#FFE4E6",marginBottom:3}}>
                      <div style={{height:5,borderRadius:999,width:mounted?`${r.acc}%`:"0%",
                        background:r.pass?C.emerald:"#E11D48",
                        transition:"width 0.9s cubic-bezier(0.34,1.56,0.64,1)",transitionDelay:i*0.1+"s"}}/>
                    </div>
                    <span style={{fontSize:10,color:C.muted}}>{r.sign}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontSize:13,fontWeight:800,color:r.pass?C.emerald:"#E11D48",display:"block"}}>{r.acc}%</span>
                    <span style={{fontSize:9,color:C.muted}}>{r.ago}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak & Goals */}
          <div className="card-hover" style={{background:C.card,border:`1px solid ${C.border}`,
            borderRadius:20,boxShadow:"0 4px 20px rgba(15,23,42,0.06)",padding:22}}>
            <p style={{fontWeight:800,fontSize:13,color:C.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
              <Flame size={16} color={C.orange}/>Streak & Goals
            </p>
            {/* Streak display with ring */}
            <div style={{background:"linear-gradient(135deg,#FFF7ED,#FFFBEB)",
              border:"1px solid #FED7AA",borderRadius:18,padding:"18px",
              textAlign:"center",marginBottom:14,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-15,right:-15,width:80,height:80,
                borderRadius:"50%",background:"rgba(249,115,22,0.08)",animation:"float 3s ease-in-out infinite"}}/>
              <p className="anim-heartbeat" style={{fontSize:40,fontWeight:800,color:C.orange,margin:0,lineHeight:1}}>
                🔥 {mounted?<CountUp target={6} duration={500}/>:0}
              </p>
              <p style={{fontSize:13,fontWeight:700,color:"#C2410C",marginTop:6}}>Day Practice Streak</p>
              <p style={{fontSize:11,color:C.muted,marginTop:2}}>Longest: 12 days</p>
              <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:10}}>
                {["M","T","W","T","F","S","S"].map((d,i)=>(
                  <div key={i} style={{width:22,height:22,borderRadius:"50%",
                    background:i<6?"#F97316":"#E2E8F0",display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:9,fontWeight:700,color:i<6?"white":"#94A3B8",
                    boxShadow:i<6?"0 2px 6px rgba(249,115,22,0.35)":"none"}}>
                    {d}
                  </div>
                ))}
              </div>
            </div>
            {[
              {l:"Master A–Z Alphabet",p:86,done:false},
              {l:"7-Day Streak",p:100,done:true},
              {l:"90%+ on HELLO",p:94,done:true},
              {l:"Complete Phrases Course",p:33,done:false},
            ].map((g,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
                <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,
                  background:g.done?"linear-gradient(135deg,#059669,#34D399)":"#E2E8F0",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:g.done?"0 2px 6px rgba(5,150,105,0.35)":"none"}}>
                  {g.done&&<CheckCircle2 size={10} color="white"/>}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:11,fontWeight:700,color:C.text,margin:"0 0 3px",lineHeight:1.2}}>{g.l}</p>
                  <div style={{height:5,borderRadius:999,background:"#E2E8F0"}}>
                    <div style={{height:5,borderRadius:999,
                      width:mounted?`${g.p}%`:"0%",
                      background:g.done?"linear-gradient(to right,#059669,#34D399)":"linear-gradient(to right,#0284C7,#7C3AED)",
                      transition:"width 1.1s cubic-bezier(0.34,1.56,0.64,1)",transitionDelay:i*0.15+"s"}}/>
                  </div>
                </div>
                <span style={{fontSize:10,fontWeight:800,color:g.done?C.emerald:C.muted,width:28}}>{g.p}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SIGN MASTERY MAP ─────────────────────────────────── */}
        <div className="card-hover" style={{background:C.card,border:`1px solid ${C.border}`,
          borderRadius:22,boxShadow:"0 4px 20px rgba(15,23,42,0.06)",padding:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
            <p style={{fontWeight:800,fontSize:14,color:C.text,display:"flex",alignItems:"center",gap:7,margin:0}}>
              <Brain size={17} color={C.primary}/>Sign Mastery Map
              <span style={{fontSize:11,background:"#EFF6FF",color:C.primary,padding:"2px 10px",borderRadius:999,fontWeight:700}}>
                {mastered}/{SIGNS.length} mastered
              </span>
            </p>
            <div style={{display:"flex",gap:16,fontSize:11,fontWeight:700}}>
              {[{c:C.emerald,l:"Mastered ≥80%"},{c:"#F59E0B",l:"Progress 40-79%"},{c:"#CBD5E1",l:"Needs Work"}].map(({c,l})=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:5,color:C.muted}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))",gap:8}}>
            {SIGNS.map((sign,idx)=>{
              const v=MASTERY[sign], isM=v>=80, isProg=v>=40;
              const col=isM?C.emerald:isProg?"#B45309":C.muted;
              const bg=isM?"linear-gradient(135deg,#ECFDF5,#D1FAE5)":isProg?"linear-gradient(135deg,#FFFBEB,#FEF3C7)":"#F8FAFC";
              const bd=isM?"#6EE7B7":isProg?"#FCD34D":"#E2E8F0";
              const hov=hoverSign===sign;
              return (
                <div key={sign} className={`anim-fade-in-up`}
                  onMouseEnter={()=>setHoverSign(sign)}
                  onMouseLeave={()=>setHoverSign(null)}
                  style={{border:`1.5px solid ${hov?col:bd}`,borderRadius:14,padding:"11px 6px",textAlign:"center",
                    background:hov?"white":bg,
                    boxShadow:hov?`0 8px 24px ${isM?"rgba(5,150,105,0.2)":"rgba(2,132,199,0.15)"}`:
                      isM?"0 2px 6px rgba(5,150,105,0.10)":"none",
                    transform:hov?"translateY(-5px) scale(1.06)":"translateY(0) scale(1)",
                    transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)",cursor:"default",
                    animationDelay:idx*0.02+"s"}}>
                  <p style={{fontSize:12,fontWeight:800,color:hov?col:col,lineHeight:1,margin:0}}>{sign}</p>
                  <div style={{height:3,borderRadius:999,background:"#E2E8F0",margin:"5px 4px 2px"}}>
                    <div style={{height:3,borderRadius:999,width:mounted?`${v}%`:"0%",
                      background:isM?C.emerald:isProg?"#D97706":"#94A3B8",
                      transition:"width 1s ease",transitionDelay:idx*0.02+"s"}}/>
                  </div>
                  <p style={{fontSize:9,fontWeight:700,color:col,margin:0}}>{v}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── QUICK ACTIONS ────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
          {[
            {icon:<Camera size={26} color={C.primary}/>,title:"AI Practice Studio",
              desc:"Real-time two-hand gesture detection with live AI feedback and sign correction",
              btn:"Start Session",grad:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",
              btnGrad:"linear-gradient(135deg,#0284C7,#0369A1)",action:onStartPractice,
              accent:C.primary,badge:"LIVE AI"},
            {icon:<Zap size={26} color={C.orange}/>,title:"Speed Quiz",
              desc:"Test your sign recognition speed under 20-second timed pressure per question",
              btn:"Take Quiz",grad:"linear-gradient(135deg,#FFF7ED,#FFEDD5)",
              btnGrad:"linear-gradient(135deg,#F97316,#EA580C)",action:onStartQuiz,
              accent:C.orange,badge:"10 QS"},
            {icon:<BookOpen size={26} color={C.violet}/>,title:"Browse Courses",
              desc:"Structured learning paths from ASL alphabet to professional workplace signs",
              btn:"View Courses",grad:"linear-gradient(135deg,#F5F3FF,#EDE9FE)",
              btnGrad:"linear-gradient(135deg,#7C3AED,#6D28D9)",action:null,
              accent:C.violet,badge:"6 COURSES"},
          ].map((a,i)=>(
            <div key={i} className={`card-hover ${mounted?"anim-fade-in-up":""}`}
              style={{background:a.grad,border:`1px solid ${C.border}`,borderRadius:22,
                padding:24,display:"flex",flexDirection:"column",gap:14,
                animationDelay:i*0.1+"s",position:"relative",overflow:"hidden"}}>
              {/* Background decoration */}
              <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,
                borderRadius:"50%",background:"rgba(255,255,255,0.5)"}}/>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"relative"}}>
                <div style={{width:52,height:52,borderRadius:18,background:"white",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:`0 4px 16px rgba(15,23,42,0.10)`}}>
                  {a.icon}
                </div>
                <span style={{fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:999,
                  background:a.accent,color:"white",letterSpacing:0.8}}>{a.badge}</span>
              </div>
              <div style={{position:"relative"}}>
                <p style={{fontWeight:800,fontSize:15,color:C.text,margin:"0 0 6px"}}>{a.title}</p>
                <p style={{fontSize:12,color:C.muted,lineHeight:1.6,margin:0}}>{a.desc}</p>
              </div>
              <button onClick={a.action} className="btn-press ripple-btn"
                style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"12px 18px",borderRadius:14,background:a.btnGrad,color:"white",
                  border:"none",fontWeight:800,fontSize:13,cursor:"pointer",
                  boxShadow:`0 6px 20px ${a.accent}44`,marginTop:"auto"}}>
                {a.btn} <ChevronRight size={16}/>
              </button>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.12)}28%{transform:scale(1)}42%{transform:scale(1.07)}}
        @keyframes particle{0%{transform:translateY(0) scale(1);opacity:0.6}100%{transform:translateY(-110px) translateX(var(--dx,15px)) scale(0);opacity:0}}
        @keyframes glassShimmer{0%{left:-100%}100%{left:200%}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.3)}}
      `}</style>
    </div>
  );
}
