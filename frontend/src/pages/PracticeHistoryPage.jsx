import React, { useState, useEffect } from "react";
import { History, CheckCircle2, XCircle, Download, Filter, Clock, TrendingUp } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",red:"#E11D48",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const HISTORY = [
  {id:1,sign:"HELLO",acc:94,passed:true,handCount:1,type:"dynamic",date:"2026-08-20",time:"09:42 AM",dur:18},
  {id:2,sign:"B",    acc:91,passed:true,handCount:1,type:"static", date:"2026-08-20",time:"09:40 AM",dur:12},
  {id:3,sign:"A",    acc:87,passed:true,handCount:1,type:"static", date:"2026-08-20",time:"09:38 AM",dur:10},
  {id:4,sign:"NAMASTE",acc:85,passed:true,handCount:2,type:"static",date:"2026-08-20",time:"09:35 AM",dur:22},
  {id:5,sign:"C",    acc:62,passed:false,handCount:1,type:"static", date:"2026-08-19",time:"08:15 PM",dur:15},
  {id:6,sign:"PLEASE",acc:79,passed:true,handCount:1,type:"dynamic",date:"2026-08-19",time:"08:10 PM",dur:30},
  {id:7,sign:"YES",  acc:82,passed:true,handCount:1,type:"dynamic",date:"2026-08-19",time:"08:05 PM",dur:14},
  {id:8,sign:"PEACE",acc:88,passed:true,handCount:2,type:"static", date:"2026-08-19",time:"07:58 PM",dur:20},
  {id:9,sign:"Z",    acc:55,passed:false,handCount:1,type:"dynamic",date:"2026-08-18",time:"10:00 AM",dur:40},
  {id:10,sign:"J",   acc:70,passed:true,handCount:1,type:"dynamic",date:"2026-08-18",time:"09:55 AM",dur:35},
  {id:11,sign:"FRIEND",acc:83,passed:true,handCount:2,type:"static",date:"2026-08-17",time:"07:30 PM",dur:18},
  {id:12,sign:"WAVE",acc:89,passed:true,handCount:1,type:"dynamic",date:"2026-08-17",time:"07:25 PM",dur:12},
];

const passed  = HISTORY.filter(h=>h.passed).length;
const avgAcc  = Math.round(HISTORY.reduce((a,h)=>a+h.acc,0)/HISTORY.length);
const twoHand = HISTORY.filter(h=>h.handCount===2).length;
const dynamic = HISTORY.filter(h=>h.type==="dynamic").length;

export default function PracticeHistoryPage() {
  const [filter,     setFilter]     = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [mounted,    setMounted]    = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),80); return()=>clearTimeout(t); },[]);

  const visible = HISTORY.filter(h=>{
    if(filter==="Passed"&&!h.passed)       return false;
    if(filter==="Failed"&&h.passed)        return false;
    if(filter==="2-Hand"&&h.handCount!==2) return false;
    if(filter==="Motion"&&h.type!=="dynamic") return false;
    if(dateFilter!=="All"&&h.date!==dateFilter) return false;
    return true;
  });
  const dates = [...new Set(HISTORY.map(h=>h.date))];

  const handleDownload = () => {
    const rows = ["Sign,Accuracy,Passed,Hands,Type,Date,Time,Duration(s)",
      ...HISTORY.map(h=>`${h.sign},${h.acc}%,${h.passed?"Yes":"No"},${h.handCount},${h.type},${h.date},${h.time},${h.dur}`)].join("\n");
    const blob = new Blob([rows],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="signlearn_history.csv"; a.click();
  };

  const STATS = [
    {v:`${passed}/${HISTORY.length}`,l:"Pass Rate"},
    {v:`${avgAcc}%`,l:"Avg Accuracy"},
    {v:twoHand,l:"2-Hand Signs"},
    {v:dynamic,l:"Motion Signs"},
  ];

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0",
      backgroundImage:"radial-gradient(#E2E8F0 1px,transparent 1px)",backgroundSize:"24px 24px"}}>
      <div style={{maxWidth:920,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <div className="anim-fade-in-down" style={{
          background:"linear-gradient(135deg,#7C3AED 0%,#6D28D9 60%,#0284C7 100%)",
          backgroundSize:"200% 200%",animation:"gradientShift 6s ease infinite",
          borderRadius:24,padding:"28px 32px",color:"white",
          boxShadow:"0 8px 32px rgba(124,58,237,0.28)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:150,height:150,borderRadius:"50%",
            background:"rgba(255,255,255,0.07)",animation:"float 5s ease-in-out infinite"}}/>
          <div style={{position:"absolute",bottom:-20,left:60,width:80,height:80,borderRadius:"50%",
            background:"rgba(255,255,255,0.05)",animation:"float 7s ease-in-out infinite 1.5s"}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,position:"relative"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div className="anim-float" style={{width:54,height:54,borderRadius:18,background:"rgba(255,255,255,0.2)",
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
                <History size={28} color="white"/>
              </div>
              <div>
                <h1 style={{fontSize:24,fontWeight:800,margin:0,letterSpacing:-0.5}}>Practice History</h1>
                <p style={{fontSize:13,opacity:0.85,marginTop:3,margin:0}}>{HISTORY.length} sessions recorded across all signs</p>
              </div>
            </div>
            <button className="btn-press" onClick={handleDownload}
              style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.35)",
                borderRadius:12,padding:"9px 16px",color:"white",cursor:"pointer",fontSize:12,
                fontWeight:700,display:"flex",alignItems:"center",gap:8,
                backdropFilter:"blur(8px)",transition:"all 0.2s"}}>
              <Download size={14}/> Export CSV
            </button>
          </div>
          {/* Stats row */}
          <div style={{display:"flex",gap:12,marginTop:20,flexWrap:"wrap"}}>
            {STATS.map((s,i)=>(
              <div key={i} className={`anim-fade-in-up stagger-${i+1}`}
                style={{background:"rgba(255,255,255,0.16)",border:"1px solid rgba(255,255,255,0.28)",
                  backdropFilter:"blur(8px)",borderRadius:14,padding:"10px 18px",textAlign:"center"}}>
                <p style={{fontSize:20,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.82)",marginTop:2}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mini trend chart */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 20px",
          boxShadow:"0 2px 12px rgba(15,23,42,0.05)"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:12,
            display:"flex",alignItems:"center",gap:6}}><TrendingUp size={13} color={T.primary}/>Recent Accuracy Trend</p>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:48}}>
            {HISTORY.slice(-10).map((h,i)=>(
              <div key={h.id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:"100%",borderRadius:"4px 4px 0 0",
                  height: mounted?`${(h.acc/100)*44}px`:"0px",
                  background:h.passed?`linear-gradient(to top,${T.emerald},#34D399)`:`linear-gradient(to top,${T.red},#FB7185)`,
                  transition:"height 0.8s cubic-bezier(0.34,1.56,0.64,1)",
                  transitionDelay:i*0.06+"s"}}/>
                <span style={{fontSize:8,color:T.muted,fontWeight:700}}>{h.sign.slice(0,3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
          <Filter size={14} color={T.muted}/>
          {["All","Passed","Failed","2-Hand","Motion"].map(f=>{
            const active=filter===f;
            return <button key={f} className="btn-press" onClick={()=>setFilter(f)}
              style={{padding:"7px 14px",borderRadius:10,fontSize:11,fontWeight:700,
                border:`1px solid ${active?T.violet:T.border}`,cursor:"pointer",
                background:active?T.violet:T.card,color:active?"#fff":T.muted,
                transition:"all 0.15s",
                boxShadow:active?"0 4px 12px rgba(124,58,237,0.25)":"none"}}>{f}</button>;
          })}
          <div style={{width:1,height:20,background:T.border,margin:"0 4px"}}/>
          <select value={dateFilter} onChange={e=>setDateFilter(e.target.value)}
            style={{padding:"7px 12px",border:`1px solid ${T.border}`,borderRadius:10,
              fontSize:11,fontWeight:700,color:T.text,background:T.card,outline:"none",
              cursor:"pointer",transition:"border-color 0.2s"}}>
            <option value="All">All Dates</option>
            {dates.map(d=><option key={d}>{d}</option>)}
          </select>
          <span style={{marginLeft:"auto",fontSize:11,color:T.muted,fontWeight:600}}>{visible.length} results</span>
        </div>

        {/* Table */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,
          boxShadow:"0 4px 20px rgba(15,23,42,0.06)",overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"40px 80px 100px 80px 100px 90px 1fr",
            gap:8,padding:"12px 20px",borderBottom:`1px solid ${T.border}`,background:"#F8FAFC"}}>
            {["","Sign","Accuracy","Hands","Type","Date","Time"].map((h,i)=>(
              <span key={i} style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.8}}>{h}</span>
            ))}
          </div>
          {visible.length===0?(
            <div style={{padding:"60px 40px",textAlign:"center"}}>
              <div className="anim-float" style={{fontSize:48,marginBottom:12}}>🔍</div>
              <p className="anim-fade-in" style={{fontSize:14,fontWeight:700,color:T.muted}}>No sessions match this filter</p>
              <p style={{fontSize:12,color:T.muted,marginTop:4}}>Try changing the filter or date</p>
            </div>
          ):visible.map((h,i)=>(
            <div key={h.id} className={mounted?"anim-fade-in-up":""}
              style={{display:"grid",gridTemplateColumns:"40px 80px 100px 80px 100px 90px 1fr",
                gap:8,padding:"13px 20px",alignItems:"center",
                background:i%2===0?T.card:T.soft,
                borderBottom:`1px solid ${T.border}`,
                borderLeft:`3px solid ${h.passed?T.emerald:T.red}`,
                transition:"background 0.15s",
                animationDelay:Math.min(i,5)*0.05+"s"}}>
              <div>{h.passed?<CheckCircle2 size={18} color={T.emerald}/>:<XCircle size={18} color={T.red}/>}</div>
              <span style={{fontSize:13,fontWeight:800,color:T.text}}>{h.sign}</span>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:800,color:h.acc>=75?T.emerald:h.acc>=60?T.amber:T.red}}>{h.acc}%</span>
                </div>
                <div style={{height:4,borderRadius:999,background:T.border}}>
                  <div style={{height:4,borderRadius:999,
                    width:mounted?`${h.acc}%`:"0%",
                    background:h.acc>=75?T.emerald:h.acc>=60?T.amber:T.red,
                    transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
                    transitionDelay:i*0.04+"s"}}/>
                </div>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:h.handCount===2?T.orange:T.muted}}>
                {h.handCount===2?"🙌 Both":"✋ One"}
              </span>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:999,fontWeight:700,
                background:h.type==="dynamic"?"#F5F3FF":"#ECFDF5",
                color:h.type==="dynamic"?T.violet:T.emerald}}>
                {h.type==="dynamic"?"⚡ Motion":"🖐 Static"}
              </span>
              <span style={{fontSize:11,color:T.muted}}>{h.date}</span>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <Clock size={11} color={T.muted}/>
                <span style={{fontSize:11,color:T.muted}}>{h.time} · {h.dur}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>
    </div>
  );
}
