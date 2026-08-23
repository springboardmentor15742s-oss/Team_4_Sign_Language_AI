import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Award, Target, CheckCircle2, Edit2, Camera, Globe, BookOpen } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const GOALS = [
  {label:"Master A–Z Alphabet",done:true,pct:100},
  {label:"7-Day Streak",done:true,pct:100},
  {label:"Complete Phrases Course",done:false,pct:38},
  {label:"90%+ Accuracy on HELLO",done:true,pct:94},
  {label:"Professional Vocabulary",done:false,pct:15},
];
const BADGES = [
  {emoji:"🔥",name:"7-Day Streak",desc:"Practiced 7 days in a row",earned:true},
  {emoji:"✋",name:"First Sign",desc:"Learned your first sign",earned:true},
  {emoji:"🎯",name:"90% Accuracy",desc:"Hit 90%+ on any sign",earned:true},
  {emoji:"📚",name:"Course Complete",desc:"Finished a full course",earned:false},
  {emoji:"🏆",name:"Top 10",desc:"Reached leaderboard top 10",earned:false},
  {emoji:"⚡",name:"Speed Demon",desc:"Complete quiz in under 60s",earned:false},
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(user?.fullName||"Ankur Biswal");
  const [bio,  setBio]  = useState("Passionate about sign language accessibility and AI-powered learning.");
  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),100); return()=>clearTimeout(t); },[]);

  const level = user?.learningLevel||"Intermediate";
  const role  = user?.role||"LEARNER";
  const STATS = [
    {v:"11",   l:"Signs Mastered",c:T.primary,bg:"#EFF6FF"},
    {v:"🔥 6", l:"Day Streak",    c:T.orange, bg:"#FFF7ED"},
    {v:"79%",  l:"Avg Accuracy",  c:T.emerald,bg:"#ECFDF5"},
    {v:"42",   l:"Sessions",      c:T.violet, bg:"#F5F3FF"},
  ];

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0",
      backgroundImage:"radial-gradient(#E2E8F0 1px,transparent 1px)",backgroundSize:"24px 24px"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Hero */}
        <div className="anim-fade-in-down" style={{background:"linear-gradient(135deg,#0284C7 0%,#0369A1 50%,#7C3AED 100%)",
          backgroundSize:"200% 200%",animation:"gradientShift 6s ease infinite",
          borderRadius:24,padding:"32px",color:"white",boxShadow:"0 8px 32px rgba(2,132,199,0.25)",
          position:"relative",overflow:"hidden"}}>
          {/* Orbs */}
          <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(124,58,237,0.15),transparent)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-30,left:40,width:120,height:120,borderRadius:"50%",
            background:"rgba(255,255,255,0.06)",animation:"float 7s ease-in-out infinite 1s"}}/>
          <div style={{display:"flex",alignItems:"center",gap:24,position:"relative",flexWrap:"wrap"}}>
            {/* Spinning ring avatar */}
            <div style={{position:"relative",flexShrink:0}}>
              <div style={{padding:3,borderRadius:"50%",
                background:"linear-gradient(135deg,#38BDF8,#7C3AED,#F97316)",
                animation:"spin 8s linear infinite",display:"inline-block"}}>
                <div style={{background:"rgba(2,84,163,0.8)",borderRadius:"50%",padding:2}}>
                  <img src={user?.avatarUrl||`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                    alt={name} className="anim-float"
                    style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",display:"block"}}/>
                </div>
              </div>
              <div style={{position:"absolute",bottom:4,right:4,width:26,height:26,borderRadius:"50%",
                background:"white",display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
                <Camera size={12} color={T.primary}/>
              </div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              {editing
                ?<input value={name} onChange={e=>setName(e.target.value)}
                    style={{fontSize:22,fontWeight:800,background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",
                      borderRadius:10,padding:"4px 14px",color:"white",outline:"none",width:"100%",marginBottom:6}}/>
                :<h1 style={{fontSize:24,fontWeight:800,margin:"0 0 4px"}}>{name}</h1>}
              <p style={{opacity:0.82,fontSize:13,margin:"0 0 10px"}}>{user?.email}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <span className="anim-pulse" style={{fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:999,
                  background:"rgba(255,255,255,0.22)",border:"1px solid rgba(255,255,255,0.35)"}}>{role}</span>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:999,
                  background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)"}}>⭐ {level}</span>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:999,
                  background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)"}}>ASL</span>
              </div>
            </div>
            <button className="btn-press" onClick={()=>setEditing(!editing)}
              style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.35)",
                borderRadius:14,padding:"9px 16px",color:"white",cursor:"pointer",fontSize:12,fontWeight:700,
                display:"flex",alignItems:"center",gap:6,flexShrink:0,
                boxShadow:"0 4px 12px rgba(0,0,0,0.1)",transition:"all 0.2s"}}>
              <Edit2 size={13}/> {editing?"Save Profile":"Edit Profile"}
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
          {STATS.map((s,i)=>(
            <div key={i} className={`card-hover anim-fade-in-up stagger-${i+1}`}
              style={{background:s.bg,border:`1px solid ${T.border}`,borderRadius:18,
                padding:"18px 20px",boxShadow:"0 2px 8px rgba(15,23,42,0.05)"}}>
              <p style={{fontSize:28,fontWeight:800,color:s.c,margin:0,lineHeight:1}}>{s.v}</p>
              <p style={{fontSize:11,fontWeight:700,color:T.muted,marginTop:5}}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Mid row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {/* About */}
          <div className="card-hover" style={{background:T.card,border:`1px solid ${T.border}`,
            borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20}}>
            <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
              <User size={14} color={T.primary}/>About Me
            </p>
            {editing
              ?<textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3}
                  style={{width:"100%",padding:"10px",border:`1px solid ${T.border}`,borderRadius:12,
                    fontSize:12,color:T.text,outline:"none",resize:"none",boxSizing:"border-box",
                    transition:"border-color 0.2s",fontFamily:"inherit"}}/>
              :<p style={{fontSize:12,color:T.muted,lineHeight:1.7,margin:0}}>{bio}</p>}
            <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:9}}>
              {[
                {icon:<Mail size={13}/>,v:user?.email},
                {icon:<Globe size={13}/>,v:"ASL (American Sign Language)"},
                {icon:<BookOpen size={13}/>,v:`${level} Level`}
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:T.muted}}>
                  <span style={{color:T.primary,flexShrink:0}}>{r.icon}</span>{r.v}
                </div>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="card-hover" style={{background:T.card,border:`1px solid ${T.border}`,
            borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20}}>
            <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
              <Target size={14} color={T.violet}/>Learning Goals
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {GOALS.map((g,i)=>(
                <div key={i} style={{padding:"9px 11px",borderRadius:12,
                  background:g.done?"#ECFDF5":"#F8FAFC",
                  border:`1px solid ${g.done?"#A7F3D0":T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:g.done?0:6}}>
                    {g.done
                      ?<CheckCircle2 size={14} color={T.emerald}/>
                      :<div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${T.border}`,flexShrink:0}}/>}
                    <span style={{fontSize:11,fontWeight:700,color:g.done?T.emerald:T.text,flex:1}}>{g.label}</span>
                    <span style={{fontSize:10,fontWeight:800,color:g.done?T.emerald:T.muted}}>{g.pct}%</span>
                  </div>
                  {!g.done&&<div style={{height:5,borderRadius:999,background:T.border,marginLeft:22}}>
                    <div style={{height:5,borderRadius:999,
                      width:mounted?`${g.pct}%`:"0%",
                      background:"linear-gradient(to right,#0284C7,#7C3AED)",
                      transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                      transitionDelay:i*0.15+"s"}}/>
                  </div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="card-hover" style={{background:T.card,border:`1px solid ${T.border}`,
          borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20}}>
          <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:16,display:"flex",alignItems:"center",gap:6}}>
            <Award size={14} color={T.amber}/>Badges & Achievements
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
            {BADGES.map((b,i)=>(
              <div key={i} className={`anim-bounce-in ${b.earned?"card-hover":""}`}
                style={{padding:"16px 12px",borderRadius:16,textAlign:"center",
                  background:b.earned?"linear-gradient(135deg,#FFFBEB,#FEF3C7)":"#F8FAFC",
                  border:`1px solid ${b.earned?"#FDE68A":T.border}`,
                  opacity:b.earned?1:0.5,
                  animationDelay:i*0.08+"s",
                  boxShadow:b.earned?"0 4px 12px rgba(217,119,6,0.12)":"none"}}>
                <p style={{fontSize:30,margin:"0 0 8px"}}>{b.emoji}</p>
                <p style={{fontSize:11,fontWeight:800,color:b.earned?T.amber:T.muted,margin:0}}>{b.name}</p>
                <p style={{fontSize:10,color:T.muted,marginTop:4,lineHeight:1.3}}>{b.desc}</p>
                {b.earned&&<span style={{display:"inline-block",marginTop:6,fontSize:9,fontWeight:700,
                  padding:"2px 8px",borderRadius:999,background:"#D97706",color:"white"}}>EARNED ✓</span>}
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
