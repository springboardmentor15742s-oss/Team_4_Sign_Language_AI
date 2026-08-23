import React, { useState, useEffect } from "react";
import { Shield, Users, BookOpen, TrendingUp, Star, BarChart2, MessageSquare } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const STUDENTS = [
  {name:"Ananya Iyer",  avg:94,mastered:26,streak:30,status:"Active",  last:"2h ago"},
  {name:"Aditya Kumar", avg:91,mastered:24,streak:21,status:"Active",  last:"5h ago"},
  {name:"Rahul Mehta",  avg:84,mastered:17,streak:12,status:"Active",  last:"1d ago"},
  {name:"Karan Gupta",  avg:80,mastered:15,streak:9, status:"Active",  last:"2d ago"},
  {name:"Meera Nair",   avg:77,mastered:13,streak:7, status:"At Risk", last:"3d ago"},
  {name:"Priya Sharma", avg:72,mastered:8, streak:5, status:"At Risk", last:"4d ago"},
];
const COURSE_STATS = [
  {name:"ASL Alphabet Basics",        enrolled:24,avgProg:68,rating:4.8,color:"#0284C7"},
  {name:"Common Phrases",             enrolled:18,avgProg:45,rating:4.7,color:"#F97316"},
  {name:"Numbers & Colors",           enrolled:12,avgProg:31,rating:4.9,color:"#059669"},
  {name:"Intermediate Conversations", enrolled:8, avgProg:22,rating:4.6,color:"#7C3AED"},
];

export default function InstructorDashboardPage() {
  const [tab,     setTab]     = useState("overview");
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),80); return()=>clearTimeout(t); },[]);

  const totalStudents  = STUDENTS.length;
  const activeStudents = STUDENTS.filter(s=>s.status==="Active").length;
  const atRisk         = STUDENTS.filter(s=>s.status==="At Risk").length;
  const avgAcc         = Math.round(STUDENTS.reduce((a,s)=>a+s.avg,0)/STUDENTS.length);

  const OVERVIEW_STATS = [
    {icon:<Users size={20} color="#1D4ED8"/>,   v:totalStudents,  l:"Learners",     s:"Enrolled in your courses",    bg:"#EFF6FF"},
    {icon:<TrendingUp size={20} color={T.emerald}/>,v:`${avgAcc}%`,l:"Class Average",s:"Accuracy across all learners",bg:"#ECFDF5"},
    {icon:<BookOpen size={20} color={T.violet}/>,v:COURSE_STATS.length,l:"Active Courses",s:"Currently being taught",bg:"#F5F3FF"},
    {icon:<Star size={20} color={T.amber}/>,    v:"4.75",          l:"Course Rating", s:"Average across all courses",  bg:"#FFFBEB"},
  ];

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0",
      backgroundImage:"radial-gradient(#E2E8F0 1px,transparent 1px)",backgroundSize:"24px 24px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <div className="anim-fade-in-down" style={{
          background:"linear-gradient(135deg,#1D4ED8 0%,#1E40AF 50%,#7C3AED 100%)",
          backgroundSize:"200% 200%",animation:"gradientShift 6s ease infinite",
          borderRadius:24,padding:"28px 32px",color:"white",
          boxShadow:"0 8px 32px rgba(29,78,216,0.28)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:150,height:150,borderRadius:"50%",
            background:"rgba(255,255,255,0.07)",animation:"float 5s ease-in-out infinite"}}/>
          <div style={{position:"absolute",bottom:-20,left:80,width:80,height:80,borderRadius:"50%",
            background:"rgba(255,255,255,0.05)",animation:"float 7s ease-in-out infinite 2s"}}/>
          <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
            <div className="anim-float" style={{width:56,height:56,borderRadius:18,
              background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 16px rgba(0,0,0,0.12)"}}>
              <Shield size={30} color="white"/>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <h1 style={{fontSize:24,fontWeight:800,margin:0,letterSpacing:-0.5}}>Instructor Dashboard</h1>
                <span className="anim-pulse" style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,
                  background:"rgba(255,255,255,0.22)",border:"1px solid rgba(255,255,255,0.35)"}}>
                  {totalStudents} Students
                </span>
              </div>
              <p style={{fontSize:13,opacity:0.85,marginTop:4,margin:0}}>Monitor learner progress · Manage courses · Drive outcomes</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,marginTop:20,flexWrap:"wrap"}}>
            {[{v:totalStudents,l:"Total Students"},{v:activeStudents,l:"Active Today"},{v:atRisk,l:"At Risk"},{v:`${avgAcc}%`,l:"Class Accuracy"}].map((s,i)=>(
              <div key={i} className={`anim-fade-in-up stagger-${i+1}`}
                style={{background:"rgba(255,255,255,0.16)",border:"1px solid rgba(255,255,255,0.28)",
                  backdropFilter:"blur(8px)",borderRadius:14,padding:"10px 20px",textAlign:"center"}}>
                <p style={{fontSize:22,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.82)",marginTop:2}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",background:T.soft,borderRadius:14,padding:4,
          border:`1px solid ${T.border}`,width:"fit-content"}}>
          {[["overview","📊 Overview"],["students","👥 Students"],["courses","📚 My Courses"]].map(([k,l])=>{
            const active=tab===k;
            return <button key={k} onClick={()=>setTab(k)} className="btn-press"
              style={{padding:"9px 18px",borderRadius:11,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",
                background:active?T.card:"transparent",
                color:active?"#1D4ED8":T.muted,
                boxShadow:active?"0 4px 12px rgba(29,78,216,0.18)":"none",
                transition:"all 0.2s"}}>{l}</button>;
          })}
        </div>

        {/* TAB CONTENT with fade-in */}
        <div key={tab} className="anim-fade-in">

          {/* Overview */}
          {tab==="overview"&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
                {OVERVIEW_STATS.map((s,i)=>(
                  <div key={i} className={`card-hover anim-fade-in-up stagger-${i+1}`}
                    style={{background:s.bg,border:`1px solid ${T.border}`,borderRadius:18,
                      padding:"18px",boxShadow:"0 2px 8px rgba(15,23,42,0.05)"}}>
                    <div style={{width:38,height:38,borderRadius:12,background:"white",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      marginBottom:12,boxShadow:"0 2px 8px rgba(15,23,42,0.07)"}}>
                      {s.icon}
                    </div>
                    <p style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>{s.v}</p>
                    <p style={{fontSize:11,fontWeight:700,color:T.muted,marginTop:3}}>{s.l}</p>
                    <p style={{fontSize:10,color:T.muted,marginTop:2}}>{s.s}</p>
                  </div>
                ))}
              </div>

              {/* Course enrollment */}
              <div className="card-hover" style={{background:T.card,border:`1px solid ${T.border}`,
                borderRadius:20,boxShadow:"0 4px 20px rgba(15,23,42,0.06)",padding:22}}>
                <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:18,
                  display:"flex",alignItems:"center",gap:6}}>
                  <BarChart2 size={14} color={T.primary}/>Course Enrollment Overview
                </p>
                {COURSE_STATS.map((c,i)=>(
                  <div key={i} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:10,height:10,borderRadius:3,background:c.color,flexShrink:0}}/>
                        <span style={{fontSize:12,fontWeight:700,color:T.text}}>{c.name}</span>
                      </div>
                      <span style={{fontSize:11,color:T.muted}}>{c.enrolled} students · ⭐ {c.rating}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{flex:1,height:9,borderRadius:999,background:T.border}}>
                        <div style={{height:9,borderRadius:999,
                          width:mounted?`${c.avgProg}%`:"0%",background:c.color,
                          transition:"width 1s cubic-bezier(0.34,1.56,0.64,1)",
                          transitionDelay:i*0.12+"s"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:800,color:T.muted,width:34}}>{c.avgProg}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {tab==="students"&&(
            <div className="card-hover" style={{background:T.card,border:`1px solid ${T.border}`,
              borderRadius:20,boxShadow:"0 4px 20px rgba(15,23,42,0.06)",padding:22}}>
              <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:16,
                display:"flex",alignItems:"center",gap:6}}>
                <Users size={14} color={T.primary}/>All Learners
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {STUDENTS.map((s,i)=>(
                  <div key={i} className={`anim-slide-left`}
                    style={{display:"flex",alignItems:"center",gap:13,padding:"13px 15px",
                      borderRadius:14,
                      background:s.status==="At Risk"?"#FFF1F2":T.soft,
                      border:`1px solid ${s.status==="At Risk"?"#FECDD3":T.border}`,
                      borderLeft:`4px solid ${s.status==="At Risk"?"#E11D48":"#0284C7"}`,
                      animation:s.status==="At Risk"?"anim-slide-left, pulseLeft 3s ease-in-out infinite":"none",
                      animationDelay:i*0.06+"s",transition:"all 0.2s"}}>
                    <div style={{width:40,height:40,borderRadius:"50%",
                      background:s.status==="Active"?"linear-gradient(135deg,#0284C7,#7C3AED)":"linear-gradient(135deg,#F97316,#E11D48)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:12,fontWeight:800,color:"white",flexShrink:0,
                      boxShadow:s.status==="Active"?"0 4px 10px rgba(2,132,199,0.25)":"0 4px 10px rgba(225,29,72,0.25)"}}>
                      {s.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <p style={{fontSize:13,fontWeight:700,color:T.text,margin:0}}>{s.name}</p>
                        <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:999,
                          background:s.status==="Active"?"#ECFDF5":"#FFF1F2",
                          color:s.status==="Active"?T.emerald:"#E11D48",
                          border:`1px solid ${s.status==="Active"?"#A7F3D0":"#FECDD3"}`}}>{s.status}</span>
                      </div>
                      <p style={{fontSize:11,color:T.muted,marginTop:2}}>Last active: {s.last} · {s.mastered} signs mastered</p>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
                      <div style={{textAlign:"center"}}>
                        <p style={{fontSize:15,fontWeight:800,color:s.avg>=80?T.emerald:T.amber,margin:0}}>{s.avg}%</p>
                        <p style={{fontSize:9,color:T.muted,marginTop:1}}>Accuracy</p>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <p style={{fontSize:14,fontWeight:700,color:T.orange,margin:0}}>🔥{s.streak}</p>
                        <p style={{fontSize:9,color:T.muted,marginTop:1}}>Streak</p>
                      </div>
                      {s.status==="At Risk"&&(
                        <button className="btn-press"
                          style={{padding:"6px 12px",borderRadius:10,background:T.orange,color:"white",
                            border:"none",fontSize:10,fontWeight:700,cursor:"pointer",
                            display:"flex",alignItems:"center",gap:5,
                            boxShadow:"0 4px 10px rgba(249,115,22,0.30)"}}>
                          <MessageSquare size={10}/>Nudge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {tab==="courses"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
              {COURSE_STATS.map((c,i)=>(
                <div key={i} className={`card-hover anim-fade-in-up`}
                  style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,
                    boxShadow:"0 4px 16px rgba(15,23,42,0.07)",overflow:"hidden",
                    animationDelay:i*0.09+"s"}}>
                  <div style={{background:`linear-gradient(135deg,${c.color},${c.color}cc)`,
                    padding:"20px 18px",height:80,position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:-15,right:-15,width:70,height:70,
                      borderRadius:"50%",background:"rgba(255,255,255,0.12)"}}/>
                    <p style={{fontSize:14,fontWeight:800,color:"white",margin:0,position:"relative"}}>{c.name}</p>
                    <p style={{fontSize:11,color:"rgba(255,255,255,0.82)",marginTop:3,position:"relative"}}>{c.enrolled} enrolled</p>
                  </div>
                  <div style={{padding:16}}>
                    {[{l:"Enrolled",v:`${c.enrolled} students`},{l:"Avg Progress",v:`${c.avgProg}%`},{l:"Rating",v:`⭐ ${c.rating}`}].map((s,j)=>(
                      <div key={j} style={{display:"flex",justifyContent:"space-between",
                        padding:"7px 0",borderBottom:j<2?`1px solid ${T.border}`:"none"}}>
                        <span style={{fontSize:11,color:T.muted}}>{s.l}</span>
                        <span style={{fontSize:11,fontWeight:700,color:T.text}}>{s.v}</span>
                      </div>
                    ))}
                    <div style={{marginTop:14,height:7,borderRadius:999,background:T.border}}>
                      <div style={{height:7,borderRadius:999,
                        width:mounted?`${c.avgProg}%`:"0%",background:c.color,
                        transition:"width 1s cubic-bezier(0.34,1.56,0.64,1)",
                        transitionDelay:i*0.1+"s"}}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulseLeft{0%,100%{border-left-color:#FCA5A5}50%{border-left-color:#E11D48}}
      `}</style>
    </div>
  );
}
