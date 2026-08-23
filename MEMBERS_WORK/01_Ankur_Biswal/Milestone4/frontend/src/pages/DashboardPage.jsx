import React, { useState } from "react";
import { TrendingUp, Flame, Target, BookOpen, Camera, Award, ChevronRight, Zap, Clock, CheckCircle2, BarChart2, History, Star } from "lucide-react";

const SIGNS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","HELLO","THANK_YOU"];
const seed = (n) => { let x=Math.sin(n+1)*10000; return x-Math.floor(x); };
const MASTERY = Object.fromEntries(SIGNS.map((s,i)=>[s, Math.round(seed(i*7+3)*75+20)]));
const WEEKLY  = [3,5,2,7,4,6,4];
const DAYS    = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const RECENT  = [
  {sign:"HELLO",acc:94,pass:true,ago:"2h ago"},
  {sign:"B",acc:78,pass:true,ago:"2h ago"},
  {sign:"A",acc:89,pass:true,ago:"3h ago"},
  {sign:"C",acc:62,pass:false,ago:"Yesterday"},
  {sign:"NAMASTE",acc:85,pass:true,ago:"Yesterday"},
];
const mastered = Object.values(MASTERY).filter(v=>v>=80).length;
const inProg   = Object.values(MASTERY).filter(v=>v>=40&&v<80).length;
const avgAcc   = Math.round(Object.values(MASTERY).reduce((a,b)=>a+b,0)/SIGNS.length);
const maxW     = Math.max(...WEEKLY);

// Design tokens — all inline to bypass dark mode
const C = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  primary: "#0284C7",
  orange: "#F97316",
  violet: "#7C3AED",
  emerald: "#059669",
  amber: "#D97706",
  text: "#0F172A",
  muted: "#64748B",
  soft: "#F1F5F9",
};

const Card = ({children, style={}}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,
    boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20,...style}}>
    {children}
  </div>
);

const StatCard = ({icon, label, value, sub, accent, bg}) => (
  <div style={{background:bg,border:`1px solid ${C.border}`,borderRadius:18,
    boxShadow:"0 2px 8px rgba(15,23,42,0.05)",padding:"18px 20px",display:"flex",alignItems:"flex-start",gap:14}}>
    <div style={{width:42,height:42,borderRadius:14,background:"white",
      display:"flex",alignItems:"center",justifyContent:"center",
      boxShadow:`0 2px 8px ${accent}22`,flexShrink:0}}>
      {icon}
    </div>
    <div>
      <p style={{fontSize:24,fontWeight:800,color:C.text,lineHeight:1}}>{value}</p>
      <p style={{fontSize:12,fontWeight:700,color:accent,marginTop:2}}>{label}</p>
      <p style={{fontSize:11,color:C.muted,marginTop:1}}>{sub}</p>
    </div>
  </div>
);

export default function DashboardPage({onStartPractice,onStartQuiz,onViewHistory}) {
  const [hoverSign, setHoverSign] = useState(null);
  return (
    <div style={{background:C.bg,minHeight:"100vh",padding:"32px 0"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",flexDirection:"column",gap:24}}>

        {/* ── HERO CARD ─────────────────────────────────────────── */}
        <div style={{background:"linear-gradient(135deg,#0284C7 0%,#0369A1 40%,#7C3AED 100%)",
          borderRadius:24,padding:"32px 36px",color:"white",
          boxShadow:"0 8px 32px rgba(2,132,199,0.25)",position:"relative",overflow:"hidden"}}>
          {/* Decorative circles */}
          <div style={{position:"absolute",top:-30,right:-30,width:140,height:140,borderRadius:"50%",
            background:"rgba(255,255,255,0.08)"}}/>
          <div style={{position:"absolute",bottom:-20,right:80,width:80,height:80,borderRadius:"50%",
            background:"rgba(255,255,255,0.05)"}}/>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:20,position:"relative"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:11,fontWeight:700,background:"rgba(255,255,255,0.2)",
                  padding:"3px 10px",borderRadius:999,letterSpacing:1}}>WELCOME BACK 👋</span>
              </div>
              <h1 style={{fontSize:30,fontWeight:800,margin:0,lineHeight:1.2}}>Your Learning Dashboard</h1>
              <p style={{fontSize:14,opacity:0.85,marginTop:8,marginBottom:20}}>
                Track progress · Practice signs · Climb the leaderboard
              </p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button onClick={onStartPractice} style={{display:"flex",alignItems:"center",gap:8,
                  background:"white",color:C.primary,border:"none",borderRadius:14,
                  padding:"10px 20px",fontWeight:700,fontSize:13,cursor:"pointer",
                  boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>
                  <Camera size={16}/> Start Practicing
                </button>
                <button onClick={onStartQuiz} style={{display:"flex",alignItems:"center",gap:8,
                  background:C.orange,color:"white",border:"none",borderRadius:14,
                  padding:"10px 20px",fontWeight:700,fontSize:13,cursor:"pointer",
                  boxShadow:"0 4px 12px rgba(249,115,22,0.35)"}}>
                  <Zap size={16}/> Speed Quiz
                </button>
                <button onClick={onViewHistory} style={{display:"flex",alignItems:"center",gap:8,
                  background:"rgba(255,255,255,0.15)",color:"white",border:"1px solid rgba(255,255,255,0.3)",
                  borderRadius:14,padding:"10px 20px",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  <History size={16}/> View History
                </button>
              </div>
            </div>
            <div style={{display:"flex",gap:12}}>
              {[{v:mastered,l:"Signs Mastered",ic:Star,c:"#FBBF24"},{v:"🔥 6",l:"Day Streak",ic:Flame,c:"#FB923C"}].map((s,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",
                  border:"1px solid rgba(255,255,255,0.25)",borderRadius:18,padding:"16px 20px",textAlign:"center",minWidth:90}}>
                  <p style={{fontSize:30,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                  <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.8)",marginTop:4}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ──────────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
          <StatCard icon={<TrendingUp size={20} color={C.primary}/>} label="Avg Accuracy" value={`${avgAcc}%`} sub="across all signs" accent={C.primary} bg="#F0F9FF"/>
          <StatCard icon={<CheckCircle2 size={20} color={C.emerald}/>} label="Signs Mastered" value={mastered} sub={`of ${SIGNS.length} total`} accent={C.emerald} bg="#ECFDF5"/>
          <StatCard icon={<Target size={20} color={C.violet}/>} label="In Progress" value={inProg} sub="almost there" accent={C.violet} bg="#F5F3FF"/>
          <StatCard icon={<Clock size={20} color={C.amber}/>} label="Practice Today" value="42m" sub="3 sessions" accent={C.amber} bg="#FFFBEB"/>
        </div>

        {/* ── MID ROW ─────────────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>

          {/* Weekly Chart */}
          <Card>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <p style={{fontWeight:800,fontSize:13,color:C.text,display:"flex",alignItems:"center",gap:6}}>
                <BarChart2 size={16} color={C.primary}/> Weekly Activity
              </p>
              <span style={{fontSize:11,color:C.muted}}>This week</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:96}}>
              {WEEKLY.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:10,fontWeight:700,color:C.muted}}>{v}</span>
                  <div style={{width:"100%",borderRadius:"6px 6px 0 0",
                    height:`${(v/maxW)*80}px`,
                    background:i===6?`linear-gradient(to top,${C.primary},#38BDF8)`:"#E0F2FE",
                    transition:"all 0.3s"}}/>
                  <span style={{fontSize:10,color:C.muted}}>{DAYS[i]}</span>
                </div>
              ))}
            </div>
            <p style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:10}}>
              Total: {WEEKLY.reduce((a,b)=>a+b)} sessions
            </p>
          </Card>

          {/* Recent Practice */}
          <Card>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <p style={{fontWeight:800,fontSize:13,color:C.text,display:"flex",alignItems:"center",gap:6}}>
                <Clock size={16} color="#7C3AED"/> Recent Practice
              </p>
              <button onClick={onViewHistory} style={{fontSize:11,color:C.primary,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {RECENT.map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",
                  borderRadius:12,background:r.pass?"#F0FDF4":"#FFF1F2"}}>
                  <div style={{width:34,height:34,borderRadius:10,
                    background:r.pass?"#DCFCE7":"#FFE4E6",display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:12,fontWeight:800,
                    color:r.pass?C.emerald:"#E11D48",flexShrink:0}}>{r.sign.slice(0,2)}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{width:"100%",height:6,borderRadius:999,background:r.pass?"#BBF7D0":"#FECDD3"}}>
                      <div style={{height:6,borderRadius:999,width:`${r.acc}%`,
                        background:r.pass?C.emerald:"#F43F5E"}}/>
                    </div>
                  </div>
                  <span style={{fontSize:12,fontWeight:800,color:C.text,width:32}}>{r.acc}%</span>
                  <span style={{fontSize:10,color:C.muted}}>{r.ago}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Streak & Goals */}
          <Card>
            <p style={{fontWeight:800,fontSize:13,color:C.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
              <Flame size={16} color={C.orange}/> Streak & Goals
            </p>
            <div style={{background:"linear-gradient(135deg,#FFF7ED,#FFFBEB)",border:"1px solid #FED7AA",
              borderRadius:16,padding:"16px",textAlign:"center",marginBottom:14}}>
              <p style={{fontSize:36,fontWeight:800,color:C.orange,margin:0}}>🔥 6</p>
              <p style={{fontSize:12,fontWeight:700,color:"#C2410C",marginTop:4}}>Day Practice Streak</p>
              <p style={{fontSize:11,color:C.muted,marginTop:2}}>Longest: 12 days</p>
            </div>
            {[
              {l:"Master A–Z Alphabet",p:86,done:false},
              {l:"7-Day Streak",p:100,done:true},
              {l:"90%+ on HELLO",p:94,done:true},
              {l:"Complete Phrases Course",p:33,done:false},
            ].map((g,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:16,height:16,borderRadius:"50%",flexShrink:0,
                  background:g.done?C.emerald:"#E2E8F0",display:"flex",alignItems:"center",
                  justifyContent:"center"}}>
                  {g.done&&<CheckCircle2 size={10} color="white"/>}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:3,lineHeight:1.2}}>{g.l}</p>
                  <div style={{height:5,borderRadius:999,background:"#E2E8F0"}}>
                    <div style={{height:5,borderRadius:999,width:`${g.p}%`,
                      background:g.done?C.emerald:C.primary,transition:"width 0.5s"}}/>
                  </div>
                </div>
                <span style={{fontSize:10,fontWeight:700,color:C.muted,width:28}}>{g.p}%</span>
              </div>
            ))}
          </Card>
        </div>

        {/* ── SIGN MASTERY MAP ───────────────────────────────────── */}
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <p style={{fontWeight:800,fontSize:13,color:C.text,display:"flex",alignItems:"center",gap:6}}>
              <TrendingUp size={16} color={C.primary}/> Sign Mastery Map
            </p>
            <div style={{display:"flex",gap:12,fontSize:11,fontWeight:700,color:C.muted}}>
              <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:"50%",background:C.emerald,display:"inline-block"}}/>Mastered ≥80%</span>
              <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:"50%",background:"#F59E0B",display:"inline-block"}}/>Progress 40-79%</span>
              <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:"50%",background:"#CBD5E1",display:"inline-block"}}/>Needs Work</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(68px,1fr))",gap:8}}>
            {SIGNS.map(sign=>{
              const v=MASTERY[sign];
              const isM=v>=80,isProg=v>=40;
              const bg=isM?"#ECFDF5":isProg?"#FFFBEB":"#F8FAFC";
              const border=isM?`1px solid #6EE7B7`:isProg?"1px solid #FCD34D":"1px solid #E2E8F0";
              const color=isM?C.emerald:isProg?"#B45309":C.muted;
              return (
                <div key={sign}
                  onMouseEnter={()=>setHoverSign(sign)}
                  onMouseLeave={()=>setHoverSign(null)}
                  style={{border,borderRadius:12,padding:"10px 6px",textAlign:"center",
                    background:hoverSign===sign?"white":bg,
                    boxShadow:hoverSign===sign?"0 4px 12px rgba(2,132,199,0.15)":"none",
                    transform:hoverSign===sign?"translateY(-2px)":"none",
                    transition:"all 0.2s",cursor:"default"}}>
                  <p style={{fontSize:13,fontWeight:800,color,lineHeight:1}}>{sign}</p>
                  <p style={{fontSize:10,marginTop:3,fontWeight:600,color}}>{v}%</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── QUICK ACTIONS ──────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {[
            {icon:<Camera size={24} color={C.primary}/>,title:"AI Practice Studio",desc:"Real-time two-hand gesture detection with live AI feedback",
              btn:"Start Session",bg:"#F0F9FF",btnBg:C.primary,action:onStartPractice},
            {icon:<Award size={24} color={C.orange}/>,title:"Speed Quiz",desc:"Test your sign recognition speed and accuracy",
              btn:"Take Quiz",bg:"#FFF7ED",btnBg:C.orange,action:onStartQuiz},
            {icon:<BookOpen size={24} color={C.violet}/>,title:"Browse Courses",desc:"Structured learning — from alphabet to professional signs",
              btn:"View Courses",bg:"#F5F3FF",btnBg:C.violet,action:null},
          ].map((a,i)=>(
            <div key={i} style={{background:a.bg,border:`1px solid ${C.border}`,borderRadius:18,
              padding:20,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{width:48,height:48,borderRadius:16,background:"white",
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 2px 8px rgba(15,23,42,0.08)"}}>{a.icon}</div>
              <div>
                <p style={{fontWeight:800,fontSize:14,color:C.text,margin:0}}>{a.title}</p>
                <p style={{fontSize:12,color:C.muted,marginTop:4,lineHeight:1.5}}>{a.desc}</p>
              </div>
              <button onClick={a.action} style={{display:"flex",alignItems:"center",
                justifyContent:"space-between",padding:"11px 16px",borderRadius:12,
                background:a.btnBg,color:"white",border:"none",fontWeight:700,
                fontSize:13,cursor:"pointer",marginTop:"auto",
                boxShadow:`0 4px 12px ${a.btnBg}44`}}>
                {a.btn} <ChevronRight size={16}/>
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
