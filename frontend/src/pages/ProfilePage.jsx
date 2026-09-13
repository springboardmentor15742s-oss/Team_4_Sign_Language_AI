import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Award, Target, CheckCircle2, Edit2, Camera, Globe, BookOpen, Download, X, GraduationCap } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

const GOALS = [
  {label:"Master Aâ€“Z Alphabet",done:true,pct:100},
  {label:"7-Day Streak",done:true,pct:100},
  {label:"Complete Phrases Course",done:false,pct:38},
  {label:"90%+ Accuracy on HELLO",done:true,pct:94},
  {label:"Professional Vocabulary",done:false,pct:15},
];
const BADGES_BASE = [
  {emoji:"ðŸ”¥",name:"7-Day Streak",desc:"Practiced 7 days in a row",earned:true},
  {emoji:"âœ‹",name:"First Sign",desc:"Learned your first sign",earned:true},
  {emoji:"ðŸŽ¯",name:"90% Accuracy",desc:"Hit 90%+ on any sign",earned:true},
  {emoji:"ðŸ“š",name:"Course Complete",desc:"Finished a full course",earned:false},
  {emoji:"ðŸ†",name:"Top 10",desc:"Reached leaderboard top 10",earned:false},
  {emoji:"âš¡",name:"Speed Demon",desc:"Complete quiz in under 60s",earned:false},
];

/* â”€â”€â”€ CERTIFICATE MODAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CertModal({ cert, userName, onClose }) {
  const canvasRef = useRef(null);

  const drawCert = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 900, H = 620;
    canvas.width = W; canvas.height = H;

    const rr = (x,y,w,h,r) => {
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
      ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
      ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
    };

    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0,0,W,H);

    // Double border
    ctx.strokeStyle = cert.color; ctx.lineWidth = 6;
    rr(14,14,W-28,H-28,16); ctx.stroke();
    ctx.strokeStyle = cert.color+"55"; ctx.lineWidth = 2;
    rr(22,22,W-44,H-44,12); ctx.stroke();

    // Header gradient band
    const hg = ctx.createLinearGradient(0,0,W,0);
    hg.addColorStop(0, cert.color); hg.addColorStop(1, "#7C3AED");
    ctx.fillStyle = hg; rr(14,14,W-28,142,16); ctx.fill();

    // Dot pattern on header
    for (let gx=30;gx<W-30;gx+=18) for (let gy=18;gy<155;gy+=18) {
      ctx.beginPath(); ctx.arc(gx,gy,1,0,Math.PI*2);
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fill();
    }

    // Trophy
    ctx.font = "54px serif"; ctx.textAlign = "center";
    ctx.fillText("\uD83C\uDFC6", W/2, 86);

    // Platform tag
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("SIGNLEARN AI  \u00B7  INFOSYS SPRINGBOARD 2026", W/2, 136);

    // Section heading
    ctx.fillStyle = cert.color; ctx.font = "bold 12px sans-serif";
    ctx.fillText("CERTIFICATE OF COMPLETION", W/2, 192);

    // Rule
    ctx.beginPath(); ctx.moveTo(W/2-130,202); ctx.lineTo(W/2+130,202);
    ctx.strokeStyle = cert.color+"88"; ctx.lineWidth = 1.5; ctx.stroke();

    // Certify text
    ctx.fillStyle = "#64748B"; ctx.font = "italic 15px Georgia,serif";
    ctx.fillText("This is to certify that", W/2, 244);

    // Learner name
    ctx.fillStyle = "#0F172A"; ctx.font = "bold 34px Georgia,serif";
    ctx.fillText(userName, W/2, 292);
    const nw = ctx.measureText(userName).width;
    ctx.beginPath(); ctx.moveTo(W/2-nw/2,302); ctx.lineTo(W/2+nw/2,302);
    ctx.strokeStyle = "#0F172A33"; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = "#64748B"; ctx.font = "italic 15px Georgia,serif";
    ctx.fillText("has successfully completed all lessons in", W/2, 330);

    // Course title
    ctx.fillStyle = cert.color; ctx.font = "bold 22px sans-serif";
    ctx.fillText(cert.title, W/2, 366);

    // Level pill
    const lw = 110;
    ctx.fillStyle = cert.color+"18"; rr(W/2-lw/2,380,lw,26,13); ctx.fill();
    ctx.strokeStyle = cert.color+"44"; ctx.lineWidth = 1;
    rr(W/2-lw/2,380,lw,26,13); ctx.stroke();
    ctx.fillStyle = cert.color; ctx.font = "bold 11px sans-serif";
    ctx.fillText(cert.level+" Level", W/2, 397);

    // Meta row
    const issued = new Date(cert.issuedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"});
    [cert.hrs+"h Content", cert.lessons+" Lessons", "Issued: "+issued].forEach((m,i) => {
      ctx.fillStyle = "#94A3B8"; ctx.font = "11px sans-serif";
      ctx.fillText(m, W/2-200+i*200, 430);
    });

    // Separator
    ctx.beginPath(); ctx.moveTo(60,456); ctx.lineTo(W-60,456);
    ctx.strokeStyle = "#E2E8F0"; ctx.lineWidth = 1; ctx.stroke();

    // Instructor (left)
    ctx.fillStyle = "#0F172A"; ctx.font = "italic bold 15px Georgia,serif"; ctx.textAlign = "left";
    ctx.fillText(cert.instructor, 90, 498);
    ctx.fillStyle = "#64748B"; ctx.font = "10px sans-serif";
    ctx.fillText("Course Instructor", 90, 514);

    // Official seal (centre)
    const sg = ctx.createRadialGradient(W/2,492,8,W/2,492,36);
    sg.addColorStop(0, cert.color); sg.addColorStop(1, "#7C3AED");
    ctx.beginPath(); ctx.arc(W/2,492,36,0,Math.PI*2);
    ctx.fillStyle = sg; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "white"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("OFFICIAL", W/2, 487); ctx.fillText("SEAL", W/2, 500);

    // Platform (right)
    ctx.fillStyle = "#0F172A"; ctx.font = "italic bold 15px Georgia,serif"; ctx.textAlign = "right";
    ctx.fillText("SignLearn AI Platform", W-90, 498);
    ctx.fillStyle = "#64748B"; ctx.font = "10px sans-serif";
    ctx.fillText("Powered by Infosys Springboard", W-90, 514);

    // Footer
    ctx.fillStyle = "#CBD5E1"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Issued digitally by SignLearn AI \u00B7 github.com/springboardmentor15742s-oss/Team_4_Sign_Language_AI", W/2, 566);
  }, [cert, userName]);

  useEffect(() => { drawCert(); }, [drawCert]);

  const download = () => {
    const link = document.createElement("a");
    link.download = cert.title.replace(/\s+/g,"_")+"_Certificate.png";
    link.href = canvasRef.current.toDataURL("image/png",1.0);
    link.click();
  };

  return (
    <div className="anim-fade-in" style={{position:"fixed",inset:0,zIndex:400,
      background:"rgba(10,15,28,0.88)",display:"flex",alignItems:"center",
      justifyContent:"center",padding:20,backdropFilter:"blur(12px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="anim-scale-in" style={{background:T.card,borderRadius:24,maxWidth:720,
        width:"100%",overflow:"hidden",boxShadow:"0 40px 80px rgba(0,0,0,0.55)"}}>
        <div style={{background:"linear-gradient(135deg,"+cert.color+",#7C3AED)",
          padding:"16px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <GraduationCap size={20} color="white"/>
            <p style={{fontSize:15,fontWeight:800,color:"white",margin:0}}>Certificate of Completion</p>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:10,
            background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.35)",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <X size={15} color="white"/>
          </button>
        </div>
        <div style={{padding:16,background:"#F1F5F9",overflowX:"auto"}}>
          <canvas ref={canvasRef} style={{borderRadius:12,boxShadow:"0 8px 28px rgba(0,0,0,0.18)",
            maxWidth:"100%",display:"block",margin:"0 auto"}}/>
        </div>
        <div style={{padding:"14px 20px",display:"flex",gap:10,borderTop:"1px solid "+T.border}}>
          <button onClick={onClose} style={{flex:1,padding:"10px",borderRadius:12,
            border:"1px solid "+T.border,background:T.soft,fontSize:12,fontWeight:700,
            color:T.muted,cursor:"pointer"}}>Close</button>
          <button onClick={download} style={{flex:2,padding:"10px",borderRadius:12,border:"none",
            background:"linear-gradient(135deg,"+cert.color+",#7C3AED)",
            fontSize:12,fontWeight:800,color:"white",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            boxShadow:"0 6px 18px "+cert.color+"55"}}>
            <Download size={14}/> Download Certificate (.PNG)
          </button>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ PROFILE PAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function ProfilePage() {
  const { user } = useAuth();
  const [editing,  setEditing]  = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [tab,      setTab]      = useState("overview");
  const [name,     setName]     = useState(user?.fullName||"Ankur Biswal");
  const [bio,      setBio]      = useState("Passionate about sign language accessibility and AI-powered learning.");
  const [certs,    setCerts]    = useState(()=>loadLS("sl_certificates",[]));
  const [viewCert, setViewCert] = useState(null);

  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),100); return()=>clearTimeout(t); },[]);
  useEffect(()=>{ if(tab==="certificates") setCerts(loadLS("sl_certificates",[])); },[tab]);

  const level   = user?.learningLevel||"Intermediate";
  const role    = user?.role||"LEARNER";
  const hasCert = certs.length > 0;
  const BADGES  = BADGES_BASE.map(b=>b.name==="Course Complete"?{...b,earned:hasCert}:b);
  const STATS   = [
    {v:"11",   l:"Signs Mastered",c:T.primary,bg:"#EFF6FF"},
    {v:"ðŸ”¥ 6", l:"Day Streak",    c:T.orange, bg:"#FFF7ED"},
    {v:"79%",  l:"Avg Accuracy",  c:T.emerald,bg:"#ECFDF5"},
    {v:"42",   l:"Sessions",      c:T.violet, bg:"#F5F3FF"},
  ];

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0",
      backgroundImage:"radial-gradient(#E2E8F0 1px,transparent 1px)",backgroundSize:"24px 24px"}}>

      {viewCert&&<CertModal cert={viewCert} userName={name} onClose={()=>setViewCert(null)}/>}

      <div style={{maxWidth:900,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* â”€â”€ Hero â”€â”€ */}
        <div className="anim-fade-in-down" style={{background:"linear-gradient(135deg,#0284C7 0%,#0369A1 50%,#7C3AED 100%)",
          backgroundSize:"200% 200%",animation:"gradientShift 6s ease infinite",
          borderRadius:24,padding:"32px",color:"white",boxShadow:"0 8px 32px rgba(2,132,199,0.25)",
          position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",
            background:"radial-gradient(circle,rgba(124,58,237,0.15),transparent)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-30,left:40,width:120,height:120,borderRadius:"50%",
            background:"rgba(255,255,255,0.06)",animation:"float 7s ease-in-out infinite 1s"}}/>
          <div style={{display:"flex",alignItems:"center",gap:24,position:"relative",flexWrap:"wrap"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <div style={{padding:3,borderRadius:"50%",
                background:"linear-gradient(135deg,#38BDF8,#7C3AED,#F97316)",
                animation:"spin 8s linear infinite",display:"inline-block"}}>
                <div style={{background:"rgba(2,84,163,0.8)",borderRadius:"50%",padding:2}}>
                  <img src={user?.avatarUrl||"https://api.dicebear.com/7.x/avataaars/svg?seed="+name}
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
                  background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)"}}>â­ {level}</span>
                {certs.length>0&&<span style={{fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:999,
                  background:"rgba(255,215,0,0.25)",border:"1px solid rgba(255,215,0,0.5)"}}>
                  ðŸŽ“ {certs.length} Certificate{certs.length>1?"s":""}
                </span>}
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

        {/* â”€â”€ Stats â”€â”€ */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
          {STATS.map((s,i)=>(
            <div key={i} className={"card-hover anim-fade-in-up stagger-"+(i+1)}
              style={{background:s.bg,border:"1px solid "+T.border,borderRadius:18,
                padding:"18px 20px",boxShadow:"0 2px 8px rgba(15,23,42,0.05)"}}>
              <p style={{fontSize:28,fontWeight:800,color:s.c,margin:0,lineHeight:1}}>{s.v}</p>
              <p style={{fontSize:11,fontWeight:700,color:T.muted,marginTop:5}}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* â”€â”€ Tab nav â”€â”€ */}
        <div style={{display:"flex",gap:6,borderBottom:"1px solid "+T.border}}>
          {[
            {id:"overview",     label:"ðŸ“‹ Overview"},
            {id:"certificates", label:"ðŸŽ“ Certificates"+(certs.length>0?" ("+certs.length+")":"")},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"10px 20px",fontSize:12,fontWeight:700,border:"none",
              borderRadius:"12px 12px 0 0",cursor:"pointer",
              background:tab===t.id?T.card:"transparent",
              color:tab===t.id?T.primary:T.muted,
              borderBottom:tab===t.id?"2px solid "+T.primary:"2px solid transparent",
              transition:"all 0.18s"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* â”€â”€ OVERVIEW â”€â”€ */}
        {tab==="overview"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="card-hover" style={{background:T.card,border:"1px solid "+T.border,
              borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20}}>
              <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
                <User size={14} color={T.primary}/>About Me
              </p>
              {editing
                ?<textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3}
                    style={{width:"100%",padding:"10px",border:"1px solid "+T.border,borderRadius:12,
                      fontSize:12,color:T.text,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                :<p style={{fontSize:12,color:T.muted,lineHeight:1.7,margin:0}}>{bio}</p>}
              <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:9}}>
                {[
                  {icon:<Mail size={13}/>,v:user?.email},
                  {icon:<Globe size={13}/>,v:"ASL (American Sign Language)"},
                  {icon:<BookOpen size={13}/>,v:level+" Level"},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:T.muted}}>
                    <span style={{color:T.primary,flexShrink:0}}>{r.icon}</span>{r.v}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-hover" style={{background:T.card,border:"1px solid "+T.border,
              borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20}}>
              <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
                <Target size={14} color={T.violet}/>Learning Goals
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {GOALS.map((g,i)=>(
                  <div key={i} style={{padding:"9px 11px",borderRadius:12,
                    background:g.done?"#ECFDF5":"#F8FAFC",
                    border:"1px solid "+(g.done?"#A7F3D0":T.border)}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:g.done?0:6}}>
                      {g.done?<CheckCircle2 size={14} color={T.emerald}/>
                        :<div style={{width:14,height:14,borderRadius:"50%",border:"2px solid "+T.border,flexShrink:0}}/>}
                      <span style={{fontSize:11,fontWeight:700,color:g.done?T.emerald:T.text,flex:1}}>{g.label}</span>
                      <span style={{fontSize:10,fontWeight:800,color:g.done?T.emerald:T.muted}}>{g.pct}%</span>
                    </div>
                    {!g.done&&<div style={{height:5,borderRadius:999,background:T.border,marginLeft:22}}>
                      <div style={{height:5,borderRadius:999,
                        width:mounted?g.pct+"%":"0%",
                        background:"linear-gradient(to right,#0284C7,#7C3AED)",
                        transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                        transitionDelay:i*0.15+"s"}}/>
                    </div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-hover" style={{background:T.card,border:"1px solid "+T.border,
            borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:20}}>
            <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:16,display:"flex",alignItems:"center",gap:6}}>
              <Award size={14} color={T.amber}/>Badges & Achievements
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
              {BADGES.map((b,i)=>(
                <div key={i} className={"anim-bounce-in "+(b.earned?"card-hover":"")}
                  style={{padding:"16px 12px",borderRadius:16,textAlign:"center",
                    background:b.earned?"linear-gradient(135deg,#FFFBEB,#FEF3C7)":"#F8FAFC",
                    border:"1px solid "+(b.earned?"#FDE68A":T.border),
                    opacity:b.earned?1:0.5,animationDelay:i*0.08+"s",
                    boxShadow:b.earned?"0 4px 12px rgba(217,119,6,0.12)":"none"}}>
                  <p style={{fontSize:30,margin:"0 0 8px"}}>{b.emoji}</p>
                  <p style={{fontSize:11,fontWeight:800,color:b.earned?T.amber:T.muted,margin:0}}>{b.name}</p>
                  <p style={{fontSize:10,color:T.muted,marginTop:4,lineHeight:1.3}}>{b.desc}</p>
                  {b.earned&&<span style={{display:"inline-block",marginTop:6,fontSize:9,fontWeight:700,
                    padding:"2px 8px",borderRadius:999,background:"#D97706",color:"white"}}>EARNED âœ“</span>}
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* â”€â”€ CERTIFICATES TAB â”€â”€ */}
        {tab==="certificates"&&(
          certs.length===0
            ?<div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,
                padding:"52px 28px",textAlign:"center",boxShadow:"0 2px 12px rgba(15,23,42,0.06)"}}>
                <div style={{fontSize:60,marginBottom:16}}>ðŸŽ“</div>
                <p style={{fontSize:18,fontWeight:800,color:T.text,margin:"0 0 8px"}}>No Certificates Yet</p>
                <p style={{fontSize:13,color:T.muted,maxWidth:360,margin:"0 auto 24px",lineHeight:1.6}}>
                  Complete all lessons in any course to earn your official<br/>
                  <strong>SignLearn AI Certificate of Completion.</strong>
                </p>
                <a href="/courses" style={{display:"inline-flex",alignItems:"center",gap:8,
                  padding:"11px 26px",borderRadius:14,
                  background:"linear-gradient(135deg,#0284C7,#7C3AED)",
                  color:"white",fontSize:13,fontWeight:700,textDecoration:"none",
                  boxShadow:"0 6px 18px rgba(2,132,199,0.35)"}}>
                  ðŸ“š Go to Courses
                </a>
              </div>
            :<>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"14px 18px",background:T.card,borderRadius:16,
                  border:"1px solid "+T.border,boxShadow:"0 2px 8px rgba(15,23,42,0.04)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:12,
                      background:"linear-gradient(135deg,#0284C7,#7C3AED)",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <GraduationCap size={18} color="white"/>
                    </div>
                    <div>
                      <p style={{fontSize:13,fontWeight:800,color:T.text,margin:0}}>
                        {certs.length} Certificate{certs.length>1?"s":""} Earned
                      </p>
                      <p style={{fontSize:11,color:T.muted,margin:0}}>Click a certificate to view & download</p>
                    </div>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:999,
                    background:"#ECFDF5",color:T.emerald,border:"1px solid #A7F3D0"}}>ðŸŽ“ Official</span>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(264px,1fr))",gap:16}}>
                  {certs.map((cert,i)=>(
                    <div key={cert.courseId} className="card-hover anim-fade-in-up"
                      style={{background:T.card,border:"1.5px solid "+cert.color+"44",borderRadius:20,
                        overflow:"hidden",boxShadow:"0 6px 24px "+cert.color+"18",
                        animationDelay:i*0.08+"s",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)"}}>
                      <div style={{background:"linear-gradient(135deg,"+cert.color+",#7C3AED)",
                        padding:"22px 20px",position:"relative",overflow:"hidden"}}>
                        <div style={{position:"absolute",inset:0,
                          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.12) 1px,transparent 1px)",
                          backgroundSize:"14px 14px"}}/>
                        <div style={{fontSize:36,marginBottom:6,position:"relative"}}>ðŸ†</div>
                        <p style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.75)",
                          textTransform:"uppercase",letterSpacing:2,margin:"0 0 4px",position:"relative"}}>
                          Certificate of Completion
                        </p>
                        <p style={{fontSize:14,fontWeight:800,color:"white",margin:0,lineHeight:1.3,position:"relative"}}>
                          {cert.title}
                        </p>
                      </div>
                      <div style={{padding:"16px 18px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                          <div style={{width:28,height:28,borderRadius:"50%",
                            background:"linear-gradient(135deg,"+cert.color+","+cert.color+"88)",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:10,fontWeight:800,color:"white"}}>
                            {cert.instructor.split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div>
                            <p style={{fontSize:11,fontWeight:700,color:T.text,margin:0}}>{cert.instructor}</p>
                            <p style={{fontSize:9,color:T.muted,margin:0}}>Course Instructor</p>
                          </div>
                          <span style={{marginLeft:"auto",fontSize:9,fontWeight:700,padding:"3px 9px",
                            borderRadius:999,background:cert.color+"18",color:cert.color,
                            border:"1px solid "+cert.color+"44"}}>{cert.level}</span>
                        </div>
                        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                          {[
                            "\u23F1 "+cert.hrs+"h",
                            "\uD83D\uDCF9 "+cert.lessons+" lessons",
                            "\uD83D\uDCC5 "+new Date(cert.issuedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
                          ].map((m,j)=>(
                            <span key={j} style={{fontSize:9,fontWeight:600,padding:"3px 8px",
                              borderRadius:8,background:T.soft,color:T.muted,border:"1px solid "+T.border}}>
                              {m}
                            </span>
                          ))}
                        </div>
                        <button onClick={()=>setViewCert(cert)}
                          style={{width:"100%",padding:"10px",borderRadius:13,border:"none",
                            background:"linear-gradient(135deg,"+cert.color+",#7C3AED)",
                            color:"white",fontSize:12,fontWeight:800,cursor:"pointer",
                            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                            boxShadow:"0 4px 14px "+cert.color+"44"}}>
                          <GraduationCap size={14}/> View & Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
        )}

      </div>
      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}

