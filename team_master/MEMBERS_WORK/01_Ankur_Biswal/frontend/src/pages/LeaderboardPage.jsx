import React, { useState } from "react";
import { Trophy, Crown, Medal, TrendingUp, Star, RefreshCw } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const WEEKLY = [
  {rank:1,name:"Ananya Iyer",   initials:"AI",mastered:26,accuracy:94.3,streak:30,score:9843,isMe:false},
  {rank:2,name:"Aditya Kumar",  initials:"AK",mastered:24,accuracy:91.7,streak:21,score:9210,isMe:false},
  {rank:3,name:"Rahul Mehta",   initials:"RM",mastered:17,accuracy:84.1,streak:12,score:7842,isMe:false},
  {rank:4,name:"Karan Gupta",   initials:"KG",mastered:15,accuracy:80.5,streak:9, score:6930,isMe:false},
  {rank:5,name:"Meera Nair",    initials:"MN",mastered:13,accuracy:77.8,streak:7, score:6210,isMe:false},
  {rank:6,name:"Priya Sharma",  initials:"PS",mastered:8, accuracy:72.4,streak:5, score:5180,isMe:false},
  {rank:7,name:"Ankur Biswal",  initials:"AB",mastered:11,accuracy:79.2,streak:6, score:5840,isMe:true},
  {rank:8,name:"Sneha Patel",   initials:"SP",mastered:4, accuracy:61.3,streak:2, score:3200,isMe:false},
  {rank:9,name:"Pragathi V",    initials:"PV",mastered:6, accuracy:68.9,streak:3, score:3980,isMe:false},
  {rank:10,name:"Vikram Singh", initials:"VS",mastered:2, accuracy:55.2,streak:1, score:1840,isMe:false},
];
const ALL = [...WEEKLY].sort((a,b)=>b.score-a.score).map((e,i)=>({...e,rank:i+1}));

const RANK_STYLE = {
  1: {bg:"linear-gradient(135deg,#FEF3C7,#FDE68A)", border:"#FCD34D", text:"#92400E", icon:<Crown size={18} color="#D97706"/>},
  2: {bg:"linear-gradient(135deg,#F1F5F9,#E2E8F0)", border:"#CBD5E1", text:"#475569", icon:<Medal size={16} color="#64748B"/>},
  3: {bg:"linear-gradient(135deg,#FFF7ED,#FFEDD5)", border:"#FED7AA", text:"#9A3412", icon:<Medal size={16} color="#F97316"/>},
};

const Avatar = ({initials, isMe}) => (
  <div style={{width:40,height:40,borderRadius:"50%",
    background:isMe?"linear-gradient(135deg,#0284C7,#7C3AED)":"#E2E8F0",
    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
    fontSize:13,fontWeight:800,color:isMe?"white":"#64748B",
    border:isMe?"2px solid #0284C7":"2px solid #E2E8F0"}}>
    {initials}
  </div>
);

export default function LeaderboardPage() {
  const [tab, setTab] = useState("weekly");
  const data = tab === "weekly" ? WEEKLY : ALL;
  const me = data.find(e=>e.isMe);
  const top3 = data.slice(0,3);

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0"}}>
      <div style={{maxWidth:760,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#D97706 0%,#B45309 60%,#7C3AED 100%)",
          borderRadius:24,padding:"28px 32px",color:"white",boxShadow:"0 8px 24px rgba(217,119,6,0.25)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
            <div style={{width:52,height:52,borderRadius:18,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Trophy size={28} color="white"/>
            </div>
            <div>
              <h1 style={{fontSize:24,fontWeight:800,margin:0}}>Leaderboard</h1>
              <p style={{fontSize:13,opacity:0.85,marginTop:3}}>Top learners by accuracy, mastered signs & streak</p>
            </div>
          </div>
          {me && (
            <div style={{marginTop:20,display:"flex",gap:16,flexWrap:"wrap"}}>
              {[{l:"Your Rank",v:`#${me.rank}`},{l:"Your Score",v:me.score.toLocaleString()},{l:"Signs Mastered",v:me.mastered}].map((s,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:14,padding:"10px 18px",textAlign:"center"}}>
                  <p style={{fontSize:20,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tab */}
        <div style={{display:"flex",background:T.soft,borderRadius:14,padding:4,border:`1px solid ${T.border}`}}>
          {[["weekly","Weekly"],["alltime","All Time"]].map(([k,l])=>{
            const active=tab===k;
            return <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px",borderRadius:11,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",background:active?T.card:"transparent",color:active?T.amber:T.muted,boxShadow:active?"0 2px 6px rgba(15,23,42,0.07)":"none",transition:"all 0.15s"}}>{l}</button>;
          })}
        </div>

        {/* Top 3 Podium */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20}}>
          <p style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,textAlign:"center",marginBottom:16}}>Top Performers</p>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:12}}>
            {[top3[1],top3[0],top3[2]].filter(Boolean).map((p,i)=>{
              const pos=i===0?2:i===1?1:3;
              const heights=["80px","110px","65px"];
              const rs=RANK_STYLE[pos];
              return (
                <div key={pos} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flex:1,maxWidth:140}}>
                  <div style={{width:48,height:48,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"white",background:"linear-gradient(135deg,#0284C7,#7C3AED)"}}>{p.initials}</div>
                  <p style={{fontSize:11,fontWeight:800,color:T.text,textAlign:"center",margin:0}}>{p.name.split(" ")[0]}</p>
                  <p style={{fontSize:11,fontWeight:700,color:T.muted,margin:0}}>{p.accuracy}%</p>
                  <div style={{width:"100%",height:heights[i],borderRadius:"12px 12px 0 0",background:rs.bg,border:`1px solid ${rs.border}`,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>{rs.icon}<span style={{fontSize:13,fontWeight:800,color:rs.text}}>#{pos}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full table */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,display:"grid",gridTemplateColumns:"44px 1fr 60px 64px 56px 72px",gap:8}}>
            {["#","Name","Signs","Acc","Streak","Score"].map(h=>(
              <span key={h} style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.5}}>{h}</span>
            ))}
          </div>
          {data.map((e,i)=>{
            const rs=RANK_STYLE[e.rank];
            return (
              <div key={e.rank} style={{display:"grid",gridTemplateColumns:"44px 1fr 60px 64px 56px 72px",gap:8,padding:"12px 20px",alignItems:"center",
                background:e.isMe?"#EFF6FF":i%2===0?T.card:T.soft,
                borderBottom:`1px solid ${T.border}`,transition:"all 0.1s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:9,
                  background:rs?rs.bg:"transparent",border:rs?`1px solid ${rs.border}`:"none"}}>
                  {rs?rs.icon:<span style={{fontSize:12,fontWeight:800,color:T.muted}}>{e.rank}</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Avatar initials={e.initials} isMe={e.isMe}/>
                  <div>
                    <p style={{fontSize:12,fontWeight:700,color:T.text,margin:0}}>{e.name}</p>
                    {e.isMe&&<span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:999,background:"#EFF6FF",color:T.primary}}>You</span>}
                  </div>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:T.text}}>{e.mastered}</span>
                <div>
                  <span style={{fontSize:12,fontWeight:800,color:e.accuracy>=80?T.emerald:e.accuracy>=65?T.amber:"#F43F5E"}}>{e.accuracy}%</span>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:T.muted}}>🔥 {e.streak}</span>
                <span style={{fontSize:12,fontWeight:800,color:T.primary}}>{e.score.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
