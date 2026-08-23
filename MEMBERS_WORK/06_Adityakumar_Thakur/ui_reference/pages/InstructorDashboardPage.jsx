import React, { useState } from "react";
import { Shield, Users, BookOpen, TrendingUp, Star, BarChart2, MessageSquare, CheckCircle2 } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const Card = ({children,style={}})=><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20,...style}}>{children}</div>;

const STUDENTS = [
  {name:"Ananya Iyer",   avg:94,mastered:26,streak:30,status:"Active",last:"2h ago"},
  {name:"Aditya Kumar",  avg:91,mastered:24,streak:21,status:"Active",last:"5h ago"},
  {name:"Rahul Mehta",   avg:84,mastered:17,streak:12,status:"Active",last:"1d ago"},
  {name:"Karan Gupta",   avg:80,mastered:15,streak:9, status:"Active",last:"2d ago"},
  {name:"Meera Nair",    avg:77,mastered:13,streak:7, status:"At Risk",last:"3d ago"},
  {name:"Priya Sharma",  avg:72,mastered:8, streak:5, status:"At Risk",last:"4d ago"},
];

const COURSE_STATS = [
  {name:"ASL Alphabet Basics",enrolled:24,avgProg:68,rating:4.8,color:"#0284C7"},
  {name:"Common Phrases",     enrolled:18,avgProg:45,rating:4.7,color:"#F97316"},
  {name:"Numbers & Colors",   enrolled:12,avgProg:31,rating:4.9,color:"#059669"},
  {name:"Intermediate Conversations",enrolled:8,avgProg:22,rating:4.6,color:"#7C3AED"},
];

export default function InstructorDashboardPage() {
  const [tab, setTab] = useState("overview");

  const totalStudents = STUDENTS.length;
  const activeStudents = STUDENTS.filter(s=>s.status==="Active").length;
  const atRisk = STUDENTS.filter(s=>s.status==="At Risk").length;
  const avgAcc = Math.round(STUDENTS.reduce((a,s)=>a+s.avg,0)/STUDENTS.length);

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#1D4ED8 0%,#1E40AF 50%,#7C3AED 100%)",
          borderRadius:24,padding:"28px 32px",color:"white",boxShadow:"0 8px 24px rgba(29,78,216,0.25)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
            <div style={{width:52,height:52,borderRadius:18,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={28} color="white"/></div>
            <div>
              <h1 style={{fontSize:22,fontWeight:800,margin:0}}>Instructor Dashboard</h1>
              <p style={{fontSize:13,opacity:0.85,marginTop:3}}>Monitor learner progress · Manage courses · Drive outcomes</p>
            </div>
          </div>
          <div style={{display:"flex",gap:14,marginTop:20,flexWrap:"wrap"}}>
            {[{v:totalStudents,l:"Total Students"},{v:activeStudents,l:"Active Today"},{v:atRisk,l:"At Risk"},{v:`${avgAcc}%`,l:"Class Accuracy"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:14,padding:"10px 18px",textAlign:"center"}}>
                <p style={{fontSize:20,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",background:T.soft,borderRadius:14,padding:4,border:`1px solid ${T.border}`,width:"fit-content"}}>
          {[["overview","Overview"],["students","Students"],["courses","My Courses"]].map(([k,l])=>{
            const active=tab===k;
            return <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 18px",borderRadius:11,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",background:active?T.card:"transparent",color:active?"#1D4ED8":T.muted,boxShadow:active?"0 2px 6px rgba(15,23,42,0.07)":"none",transition:"all 0.15s"}}>{l}</button>;
          })}
        </div>

        {/* Overview */}
        {tab==="overview"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
              {[{icon:<Users size={20} color="#1D4ED8"/>,v:totalStudents,l:"Learners",s:"Enrolled in your courses",bg:"#EFF6FF"},{icon:<TrendingUp size={20} color={T.emerald}/>,v:`${avgAcc}%`,l:"Class Average",s:"Accuracy across all learners",bg:"#ECFDF5"},{icon:<BookOpen size={20} color={T.violet}/>,v:COURSE_STATS.length,l:"Active Courses",s:"Currently being taught",bg:"#F5F3FF"},{icon:<Star size={20} color={T.amber}/>,v:"4.75",l:"Course Rating",s:"Average across all courses",bg:"#FFFBEB"}].map((s,i)=>(
                <div key={i} style={{background:s.bg,border:`1px solid ${T.border}`,borderRadius:18,padding:"16px 18px",boxShadow:"0 2px 8px rgba(15,23,42,0.04)"}}>
                  <div style={{width:36,height:36,borderRadius:12,background:"white",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,boxShadow:"0 2px 6px rgba(15,23,42,0.06)"}}>{s.icon}</div>
                  <p style={{fontSize:22,fontWeight:800,color:T.text,margin:0}}>{s.v}</p>
                  <p style={{fontSize:11,fontWeight:700,color:T.muted,marginTop:2}}>{s.l}</p>
                  <p style={{fontSize:10,color:T.muted,marginTop:1}}>{s.s}</p>
                </div>
              ))}
            </div>
            <Card>
              <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><BarChart2 size={14} color={T.primary}/>Course Enrollment Overview</p>
              {COURSE_STATS.map((c,i)=>(
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:700,color:T.text}}>{c.name}</span>
                    <span style={{fontSize:11,color:T.muted}}>{c.enrolled} students · ⭐ {c.rating}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1,height:8,borderRadius:999,background:T.border}}>
                      <div style={{height:8,borderRadius:999,width:`${c.avgProg}%`,background:c.color,transition:"width 0.5s"}}/>
                    </div>
                    <span style={{fontSize:11,fontWeight:800,color:T.muted,width:32}}>{c.avgProg}%</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Students */}
        {tab==="students"&&(
          <Card>
            <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><Users size={14} color={T.primary}/>All Learners</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {STUDENTS.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:14,background:s.status==="At Risk"?"#FFF1F2":T.soft,border:`1px solid ${s.status==="At Risk"?"#FECDD3":T.border}`}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#0284C7,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"white",flexShrink:0}}>
                    {s.name.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:700,color:T.text,margin:0}}>{s.name}</p>
                    <p style={{fontSize:11,color:T.muted,marginTop:1}}>Last active: {s.last} · {s.mastered} signs mastered</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                    <div style={{textAlign:"center"}}>
                      <p style={{fontSize:14,fontWeight:800,color:s.avg>=80?T.emerald:T.amber,margin:0}}>{s.avg}%</p>
                      <p style={{fontSize:9,color:T.muted}}>Accuracy</p>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <p style={{fontSize:13,fontWeight:700,color:T.orange,margin:0}}>🔥{s.streak}</p>
                      <p style={{fontSize:9,color:T.muted}}>Streak</p>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:999,
                      background:s.status==="Active"?"#ECFDF5":"#FFF1F2",
                      color:s.status==="Active"?T.emerald:"#E11D48",
                      border:`1px solid ${s.status==="Active"?"#A7F3D0":"#FECDD3"}`}}>{s.status}</span>
                    {s.status==="At Risk"&&<button style={{padding:"5px 12px",borderRadius:9,background:T.orange,color:"white",border:"none",fontSize:10,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><MessageSquare size={10}/>Nudge</button>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Courses */}
        {tab==="courses"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {COURSE_STATS.map((c,i)=>(
              <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,boxShadow:"0 2px 10px rgba(15,23,42,0.05)",overflow:"hidden"}}>
                <div style={{background:c.color,padding:"16px",height:70,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-10,right:-10,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
                  <p style={{fontSize:14,fontWeight:800,color:"white",margin:0,position:"relative"}}>{c.name}</p>
                </div>
                <div style={{padding:14}}>
                  {[{l:"Enrolled",v:`${c.enrolled} students`},{l:"Avg Progress",v:`${c.avgProg}%`},{l:"Rating",v:`⭐ ${c.rating}`}].map((s,j)=>(
                    <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:j<2?`1px solid ${T.border}`:"none"}}>
                      <span style={{fontSize:11,color:T.muted}}>{s.l}</span>
                      <span style={{fontSize:11,fontWeight:700,color:T.text}}>{s.v}</span>
                    </div>
                  ))}
                  <div style={{marginTop:12,height:6,borderRadius:999,background:T.border}}>
                    <div style={{height:6,borderRadius:999,width:`${c.avgProg}%`,background:c.color}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
