import React, { useState } from "react";
import { History, CheckCircle2, XCircle, Download, Filter, TrendingUp, Clock } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",red:"#E11D48",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const HISTORY = [
  {id:1,sign:"HELLO",acc:94,passed:true,handCount:1,type:"dynamic",date:"2026-08-20",time:"09:42 AM",dur:18},
  {id:2,sign:"B",acc:91,passed:true,handCount:1,type:"static",date:"2026-08-20",time:"09:40 AM",dur:12},
  {id:3,sign:"A",acc:87,passed:true,handCount:1,type:"static",date:"2026-08-20",time:"09:38 AM",dur:10},
  {id:4,sign:"NAMASTE",acc:85,passed:true,handCount:2,type:"static",date:"2026-08-20",time:"09:35 AM",dur:22},
  {id:5,sign:"C",acc:62,passed:false,handCount:1,type:"static",date:"2026-08-19",time:"08:15 PM",dur:15},
  {id:6,sign:"PLEASE",acc:79,passed:true,handCount:1,type:"dynamic",date:"2026-08-19",time:"08:10 PM",dur:30},
  {id:7,sign:"YES",acc:82,passed:true,handCount:1,type:"dynamic",date:"2026-08-19",time:"08:05 PM",dur:14},
  {id:8,sign:"PEACE",acc:88,passed:true,handCount:2,type:"static",date:"2026-08-19",time:"07:58 PM",dur:20},
  {id:9,sign:"Z",acc:55,passed:false,handCount:1,type:"dynamic",date:"2026-08-18",time:"10:00 AM",dur:40},
  {id:10,sign:"J",acc:70,passed:true,handCount:1,type:"dynamic",date:"2026-08-18",time:"09:55 AM",dur:35},
  {id:11,sign:"FRIEND",acc:83,passed:true,handCount:2,type:"static",date:"2026-08-17",time:"07:30 PM",dur:18},
  {id:12,sign:"WAVE",acc:89,passed:true,handCount:1,type:"dynamic",date:"2026-08-17",time:"07:25 PM",dur:12},
];

const passed  = HISTORY.filter(h=>h.passed).length;
const avgAcc  = Math.round(HISTORY.reduce((a,h)=>a+h.acc,0)/HISTORY.length);
const twoHand = HISTORY.filter(h=>h.handCount===2).length;
const dynamic = HISTORY.filter(h=>h.type==="dynamic").length;

export default function PracticeHistoryPage() {
  const [filter, setFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const visible = HISTORY.filter(h=>{
    if(filter==="Passed"&&!h.passed) return false;
    if(filter==="Failed"&&h.passed) return false;
    if(filter==="2-Hand"&&h.handCount!==2) return false;
    if(filter==="Motion"&&h.type!=="dynamic") return false;
    if(dateFilter!=="All"&&h.date!==dateFilter) return false;
    return true;
  });

  const dates = [...new Set(HISTORY.map(h=>h.date))];

  const handleDownload = () => {
    const rows = ["Sign,Accuracy,Passed,Hands,Type,Date,Time,Duration(s)",
      ...HISTORY.map(h=>`${h.sign},${h.acc}%,${h.passed?"Yes":"No"},${h.handCount},${h.type},${h.date},${h.time},${h.dur}`)].join("\n");
    const blob = new Blob([rows], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="signlearn_history.csv"; a.click();
  };

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#7C3AED 0%,#6D28D9 60%,#0284C7 100%)",
          borderRadius:24,padding:"28px 32px",color:"white",boxShadow:"0 8px 24px rgba(124,58,237,0.25)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,position:"relative"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:18,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><History size={28} color="white"/></div>
              <div>
                <h1 style={{fontSize:22,fontWeight:800,margin:0}}>Practice History</h1>
                <p style={{fontSize:13,opacity:0.85,marginTop:3}}>{HISTORY.length} sessions recorded</p>
              </div>
            </div>
            <button onClick={handleDownload} style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:12,padding:"9px 16px",color:"white",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
              <Download size={14}/> Export CSV
            </button>
          </div>
          {/* Stats */}
          <div style={{display:"flex",gap:14,marginTop:20,flexWrap:"wrap"}}>
            {[{v:`${passed}/${HISTORY.length}`,l:"Pass Rate"},{v:`${avgAcc}%`,l:"Avg Accuracy"},{v:twoHand,l:"2-Hand Signs"},{v:dynamic,l:"Motion Signs"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:14,padding:"10px 18px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
          <Filter size={14} color={T.muted}/>
          {["All","Passed","Failed","2-Hand","Motion"].map(f=>{
            const active=filter===f;
            return <button key={f} onClick={()=>setFilter(f)}
              style={{padding:"6px 14px",borderRadius:10,fontSize:11,fontWeight:700,border:`1px solid ${active?T.primary:T.border}`,cursor:"pointer",background:active?T.primary:T.card,color:active?"#fff":T.muted,transition:"all 0.15s"}}>{f}</button>;
          })}
          <div style={{width:1,height:20,background:T.border,margin:"0 4px"}}/>
          <select value={dateFilter} onChange={e=>setDateFilter(e.target.value)}
            style={{padding:"6px 12px",border:`1px solid ${T.border}`,borderRadius:10,fontSize:11,fontWeight:700,color:T.text,background:T.card,outline:"none",cursor:"pointer"}}>
            <option value="All">All Dates</option>
            {dates.map(d=><option key={d}>{d}</option>)}
          </select>
          <span style={{marginLeft:"auto",fontSize:11,color:T.muted,fontWeight:600}}>{visible.length} results</span>
        </div>

        {/* Table */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",overflow:"hidden"}}>
          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"40px 80px 70px 80px 80px 80px 1fr",gap:8,padding:"12px 18px",borderBottom:`1px solid ${T.border}`,background:T.soft}}>
            {["","Sign","Acc","Hands","Type","Date","Time"].map((h,i)=>(
              <span key={i} style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.5}}>{h}</span>
            ))}
          </div>
          {visible.length===0?(
            <div style={{padding:"40px",textAlign:"center",color:T.muted}}>
              <p style={{fontSize:14,fontWeight:700}}>No sessions match this filter</p>
            </div>
          ):visible.map((h,i)=>(
            <div key={h.id} style={{display:"grid",gridTemplateColumns:"40px 80px 70px 80px 80px 80px 1fr",gap:8,padding:"12px 18px",alignItems:"center",
              background:i%2===0?T.card:T.soft,borderBottom:`1px solid ${T.border}`,transition:"background 0.1s"}}>
              {h.passed?<CheckCircle2 size={18} color={T.emerald}/>:<XCircle size={18} color={T.red}/>}
              <span style={{fontSize:13,fontWeight:800,color:T.text}}>{h.sign}</span>
              <div>
                <span style={{fontSize:12,fontWeight:800,color:h.acc>=75?T.emerald:h.acc>=60?T.amber:T.red}}>{h.acc}%</span>
                <div style={{width:"100%",height:4,borderRadius:999,background:T.border,marginTop:3}}>
                  <div style={{height:4,borderRadius:999,width:`${h.acc}%`,background:h.acc>=75?T.emerald:h.acc>=60?T.amber:T.red}}/>
                </div>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:h.handCount===2?T.orange:T.muted}}>
                {h.handCount===2?"🙌 Both":"✋ One"}
              </span>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:999,fontWeight:700,
                background:h.type==="dynamic"?"#F5F3FF":"#ECFDF5",
                color:h.type==="dynamic"?T.violet:T.emerald}}>{h.type==="dynamic"?"⚡ Motion":"🖐 Static"}</span>
              <span style={{fontSize:11,color:T.muted}}>{h.date}</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Clock size={11} color={T.muted}/>
                <span style={{fontSize:11,color:T.muted}}>{h.time} · {h.dur}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
