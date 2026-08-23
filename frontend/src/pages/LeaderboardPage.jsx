import React, { useState, useEffect } from "react";
import { Trophy, Crown, Medal, TrendingUp, Star } from "lucide-react";

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
const MEDAL = {1:"🥇",2:"🥈",3:"🥉"};

const Avatar = ({initials, isMe, size=40}) => (
  <div style={{width:size,height:size,borderRadius:"50%",
    background:isMe?"linear-gradient(135deg,#0284C7,#7C3AED)":"#E2E8F0",
    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
    fontSize:size>44?16:13,fontWeight:800,color:isMe?"white":"#64748B",
    border:isMe?"2px solid #0284C7":"2px solid #E2E8F0",
    boxShadow:isMe?"0 0 0 3px rgba(2,132,199,0.2)":"none"}}>
    {initials}
  </div>
);

export default function LeaderboardPage() {
  const [tab, setTab] = useState("weekly");
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),80); return()=>clearTimeout(t); },[]);

  const data = tab==="weekly" ? WEEKLY : ALL;
  const me = data.find(e=>e.isMe);
  const top3 = data.slice(0,3);
  const maxScore = Math.max(...data.map(e=>e.score));

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0",
      backgroundImage:"radial-gradient(#E2E8F0 1px,transparent 1px)",backgroundSize:"24px 24px"}}>
      <div style={{maxWidth:780,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <div className="anim-fade-in-down" style={{background:"linear-gradient(135deg,#B45309 0%,#D97706 40%,#7C3AED 100%)",
          backgroundSize:"200% 200%",animation:"gradientShift 6s ease infinite",
          borderRadius:24,padding:"28px 32px",color:"white",boxShadow:"0 8px 32px rgba(217,119,6,0.30)",
          position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)",animation:"float 5s ease-in-out infinite"}}/>
          <div style={{position:"absolute",bottom:-20,left:60,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)",animation:"float 7s ease-in-out infinite 1s"}}/>
          <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
            <div className="anim-float" style={{width:54,height:54,borderRadius:18,background:"rgba(255,255,255,0.2)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
              <Trophy size={28} color="white"/>
            </div>
            <div>
              <h1 style={{fontSize:26,fontWeight:800,margin:0,letterSpacing:-0.5}}>Leaderboard</h1>
              <p style={{fontSize:13,opacity:0.85,marginTop:3,margin:0}}>Top learners by accuracy, mastered signs & streak</p>
            </div>
          </div>
          {me&&(
            <div style={{marginTop:20,display:"flex",gap:14,flexWrap:"wrap"}}>
              {[{l:"Your Rank",v:`#${me.rank}`},{l:"Your Score",v:me.score.toLocaleString()},{l:"Signs Mastered",v:me.mastered}].map((s,i)=>(
                <div key={i} className={`anim-fade-in-up stagger-${i+1}`}
                  style={{background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.28)",
                    backdropFilter:"blur(8px)",borderRadius:14,padding:"10px 18px",textAlign:"center"}}>
                  <p style={{fontSize:22,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.82)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tab */}
        <div style={{display:"flex",background:T.soft,borderRadius:14,padding:4,border:`1px solid ${T.border}`}}>
          {[["weekly","📅 Weekly"],["alltime","🏆 All Time"]].map(([k,l])=>{
            const active=tab===k;
            return <button key={k} onClick={()=>setTab(k)} className="btn-press"
              style={{flex:1,padding:"9px",borderRadius:11,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",
                background:active?T.card:"transparent",color:active?T.amber:T.muted,
                boxShadow:active?"0 4px 12px rgba(217,119,6,0.20)":"none",transition:"all 0.2s"}}>{l}</button>;
          })}
        </div>

        {/* Top 3 Podium */}
        <div className="anim-scale-in" style={{background:T.card,border:`1px solid ${T.border}`,
          borderRadius:20,boxShadow:"0 4px 20px rgba(15,23,42,0.08)",padding:"24px 20px"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",
            letterSpacing:1.5,textAlign:"center",marginBottom:20}}>🏆 Top Performers</p>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:16}}>
            {[top3[1],top3[0],top3[2]].filter(Boolean).map((p,i)=>{
              const pos=i===0?2:i===1?1:3;
              const heights=["88px","120px","70px"];
              const gradients=[
                "linear-gradient(135deg,#F1F5F9,#E2E8F0)",
                "linear-gradient(135deg,#FEF9C3,#FDE68A)",
                "linear-gradient(135deg,#FFF7ED,#FFEDD5)"
              ];
              const borders=["#CBD5E1","#FCD34D","#FED7AA"];
              const glows=["none","0 8px 32px rgba(251,191,36,0.35)","0 6px 20px rgba(249,115,22,0.25)"];
              const delays=["0.2s","0.1s","0.3s"];
              return (
                <div key={pos} className={`anim-bounce-in`}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flex:1,maxWidth:150,
                    animationDelay:delays[i]}}>
                  <div className={pos===1?"anim-float":""}>
                    <Avatar initials={p.initials} isMe={p.isMe} size={pos===1?56:44}/>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <p style={{fontSize:pos===1?13:11,fontWeight:800,color:T.text,margin:0}}>{p.name.split(" ")[0]}</p>
                    <p style={{fontSize:11,fontWeight:700,color:T.muted,margin:"2px 0 0"}}>{p.accuracy}%</p>
                  </div>
                  <div style={{width:"100%",height:heights[i],borderRadius:"14px 14px 0 0",
                    background:gradients[i],border:`1px solid ${borders[i]}`,borderBottom:"none",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",
                    paddingTop:10,boxShadow:glows[i],gap:4}}>
                    <span style={{fontSize:24}}>{MEDAL[pos]}</span>
                    <span style={{fontSize:13,fontWeight:800,color:T.text}}>#{pos}</span>
                    <span style={{fontSize:10,fontWeight:700,color:T.muted}}>{p.score.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Table */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,
          boxShadow:"0 4px 20px rgba(15,23,42,0.06)",overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,
            display:"grid",gridTemplateColumns:"52px 1fr 64px 70px 60px 80px",gap:8,
            background:"#F8FAFC"}}>
            {["Rank","Name","Signs","Acc","Streak","Score"].map(h=>(
              <span key={h} style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.8}}>{h}</span>
            ))}
          </div>
          {data.map((e,i)=>{
            const isTop3=e.rank<=3;
            return (
              <div key={e.rank} className={mounted?"anim-fade-in-up":""}
                style={{display:"grid",gridTemplateColumns:"52px 1fr 64px 70px 60px 80px",gap:8,
                  padding:"13px 20px",alignItems:"center",
                  background:e.isMe?"linear-gradient(90deg,#EFF6FF,#F5F3FF)":i%2===0?T.card:T.soft,
                  borderBottom:`1px solid ${T.border}`,
                  borderLeft:e.isMe?"3px solid #0284C7":isTop3?"3px solid #FCD34D":"none",
                  transition:"all 0.15s",animationDelay:i*0.04+"s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",
                  width:32,height:32,borderRadius:10,
                  background:isTop3?"transparent":"#F1F5F9"}}>
                  {isTop3
                    ?<span style={{fontSize:20}}>{MEDAL[e.rank]}</span>
                    :<span style={{fontSize:12,fontWeight:800,color:T.muted}}>{e.rank}</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Avatar initials={e.initials} isMe={e.isMe}/>
                  <div>
                    <p style={{fontSize:12,fontWeight:700,color:T.text,margin:0}}>{e.name}</p>
                    <div style={{display:"flex",gap:4,marginTop:2}}>
                      {e.isMe&&<span style={{fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:999,background:"#0284C7",color:"white"}}>YOU</span>}
                    </div>
                  </div>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:T.text}}>{e.mastered}</span>
                <div>
                  <div style={{height:5,borderRadius:999,background:"#E2E8F0",marginBottom:3}}>
                    <div style={{height:5,borderRadius:999,
                      width:mounted?`${(e.accuracy/100)*100}%`:"0%",
                      background:e.accuracy>=80?T.emerald:e.accuracy>=65?T.amber:"#F43F5E",
                      transition:"width 1s cubic-bezier(0.34,1.56,0.64,1)",
                      transitionDelay:i*0.05+"s"}}/>
                  </div>
                  <span style={{fontSize:11,fontWeight:800,color:e.accuracy>=80?T.emerald:e.accuracy>=65?T.amber:"#F43F5E"}}>{e.accuracy}%</span>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:T.muted}}>🔥 {e.streak}</span>
                <div>
                  <div style={{height:4,borderRadius:999,background:"#E2E8F0",marginBottom:3}}>
                    <div style={{height:4,borderRadius:999,
                      width:mounted?`${(e.score/maxScore)*100}%`:"0%",
                      background:"linear-gradient(to right,#0284C7,#7C3AED)",
                      transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                      transitionDelay:i*0.06+"s"}}/>
                  </div>
                  <span style={{fontSize:11,fontWeight:800,color:T.primary}}>{e.score.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>
    </div>
  );
}
