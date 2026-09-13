import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Award, Target, CheckCircle2, Edit2, Camera, Globe, BookOpen, GraduationCap } from "lucide-react";
import CertModal from "../components/CertModal";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

const GOALS = [
  {label:"Master A-Z Alphabet",done:true,pct:100},
  {label:"7-Day Streak",done:true,pct:100},
  {label:"Complete Phrases Course",done:false,pct:38},
  {label:"90%+ Accuracy on HELLO",done:true,pct:94},
  {label:"Professional Vocabulary",done:false,pct:15},
];

const E = {
  fire: String.fromCodePoint(0x1F525),  // Fire
  hand: String.fromCodePoint(0x270B),   // Hand
  dart: String.fromCodePoint(0x1F3AF),  // Target
  book: String.fromCodePoint(0x1F4DA),  // Books
  trophy: String.fromCodePoint(0x1F3C6),// Trophy
  bolt: String.fromCodePoint(0x26A1),   // Lightning
  grad: String.fromCodePoint(0x1F393),  // Graduation cap
  clip: String.fromCodePoint(0x1F4CB),  // Clipboard
};

const BADGES_BASE = [
  {emoji:E.fire,  name:"7-Day Streak",   desc:"Practiced 7 days in a row",   earned:true},
  {emoji:E.hand,  name:"First Sign",     desc:"Learned your first sign",     earned:true},
  {emoji:E.dart,  name:"90% Accuracy",   desc:"Hit 90%+ on any sign",        earned:true},
  {emoji:E.book,  name:"Course Complete",desc:"Finished a full course",       earned:false},
  {emoji:E.trophy,name:"Top 10",         desc:"Reached leaderboard top 10",  earned:false},
  {emoji:E.bolt,  name:"Speed Demon",    desc:"Complete quiz in under 60s",  earned:false},
];

export default function ProfilePage({ onNavigate }) {
  const { user } = useAuth();
  const [editing,  setEditing]  = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [tab,      setTab]      = useState(() => {
    try {
      const saved = localStorage.getItem("sl_profile_tab");
      if (saved) {
        localStorage.removeItem("sl_profile_tab");
        return saved;
      }
      if (typeof window !== "undefined" && window.location.hash === "#certificates") {
        return "certificates";
      }
    } catch {}
    return "overview";
  });
  const [name,     setName]     = useState(user?.fullName || "Ankur Biswal");
  const [bio,      setBio]      = useState("Passionate about sign language accessibility and AI-powered learning.");
  const [certs,    setCerts]    = useState(() => loadLS("sl_certificates", []));
  const [viewCert, setViewCert] = useState(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);
  useEffect(() => { if (tab === "certificates") setCerts(loadLS("sl_certificates", [])); }, [tab]);

  // Listen for subTab navigation events
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.subTab) setTab(e.detail.subTab);
    };
    window.addEventListener("app-subtab", handler);
    return () => window.removeEventListener("app-subtab", handler);
  }, []);

  const level   = user?.learningLevel || "Intermediate";
  const role    = user?.role || "LEARNER";
  const hasCert = certs.length > 0;
  const BADGES  = BADGES_BASE.map(b => b.name === "Course Complete" ? { ...b, earned: hasCert } : b);
  const STATS   = [
    {v:"11",        l:"Signs Mastered", c:T.primary, bg:"#EFF6FF"},
    {v:E.fire+" 6", l:"Day Streak",     c:T.orange,  bg:"#FFF7ED"},
    {v:"79%",       l:"Avg Accuracy",   c:T.emerald, bg:"#ECFDF5"},
    {v:"42",        l:"Sessions",       c:T.violet,  bg:"#F5F3FF"},
  ];

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0",
      backgroundImage:"radial-gradient(#E2E8F0 1px,transparent 1px)",backgroundSize:"24px 24px"}}>

      {viewCert && <CertModal cert={viewCert} userName={name} onClose={() => setViewCert(null)} />}

      <div style={{maxWidth:900,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* --- Hero --- */}
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
                  background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)"}}>&#x2B50; {level}</span>
                {certs.length > 0 && (
                  <span onClick={() => setTab("certificates")}
                    title="Click to view all certificates"
                    style={{fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:999,
                      background:"rgba(255,215,0,0.28)",border:"1px solid rgba(255,215,0,0.55)",
                      cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5,
                      boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}>
                    {E.grad} {certs.length} Certificate{certs.length>1?"s":""} &rarr;
                  </span>
                )}
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

        {/* --- Stats --- */}
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

        {/* --- Tab nav --- */}
        <div style={{display:"flex",gap:6,borderBottom:"1px solid "+T.border}}>
          {[
            {id:"overview",     label:"Overview"},
            {id:"certificates", label:"Certificates" + (certs.length > 0 ? " (" + certs.length + ")" : "")},
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

        {/* --- OVERVIEW --- */}
        {tab==="overview"&&<>
          {/* Certificate Showcase Alert on Overview */}
          {certs.length > 0 && (
            <div className="anim-fade-in-up" style={{
              background:"linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)",
              border:"1.5px solid #BFDBFE", borderRadius:20, padding:"18px 22px",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              boxShadow:"0 4px 16px rgba(2,132,199,0.08)", flexWrap:"wrap", gap:14
            }}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:46,height:46,borderRadius:14,
                  background:"linear-gradient(135deg,#0284C7,#7C3AED)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:24,boxShadow:"0 4px 12px rgba(2,132,199,0.3)"}}>
                  🏆
                </div>
                <div>
                  <p style={{fontSize:14,fontWeight:800,color:"#0F172A",margin:"0 0 3px"}}>
                    Certificate Earned: {certs[0]?.title}
                  </p>
                  <p style={{fontSize:12,color:"#64748B",margin:0}}>
                    You've successfully completed all lessons! Click to view and download your certificate.
                  </p>
                </div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button onClick={()=>setViewCert(certs[0])}
                  style={{padding:"10px 18px",borderRadius:12,border:"none",
                    background:"linear-gradient(135deg,#0284C7,#7C3AED)",
                    color:"white",fontSize:12,fontWeight:800,cursor:"pointer",
                    display:"flex",alignItems:"center",gap:7,
                    boxShadow:"0 4px 12px rgba(2,132,199,0.35)"}}>
                  <GraduationCap size={15}/> View &amp; Download
                </button>
                <button onClick={()=>setTab("certificates")}
                  style={{padding:"10px 14px",borderRadius:12,border:"1px solid #CBD5E1",
                    background:"white",color:"#0284C7",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  All Certificates ({certs.length}) &rarr;
                </button>
              </div>
            </div>
          )}

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
              <Award size={14} color={T.amber}/>Badges &amp; Achievements
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
                    padding:"2px 8px",borderRadius:999,background:"#D97706",color:"white"}}>EARNED &#x2713;</span>}
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* --- CERTIFICATES TAB --- */}
        {tab==="certificates"&&(
          certs.length===0
            ?<div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,
                padding:"52px 28px",textAlign:"center",boxShadow:"0 2px 12px rgba(15,23,42,0.06)"}}>
                <div style={{fontSize:60,marginBottom:16}}>{E.grad}</div>
                <p style={{fontSize:18,fontWeight:800,color:T.text,margin:"0 0 8px"}}>No Certificates Yet</p>
                <p style={{fontSize:13,color:T.muted,maxWidth:360,margin:"0 auto 24px",lineHeight:1.6}}>
                  Complete all lessons in any course to earn your official<br/>
                  <strong>SignLearn AI Certificate of Completion.</strong>
                </p>
                <button onClick={() => {
                  if (onNavigate) onNavigate("courses");
                  else window.dispatchEvent(new CustomEvent("app-navigate", { detail: { tab: "courses" } }));
                }} style={{display:"inline-flex",alignItems:"center",gap:8,
                  padding:"11px 26px",borderRadius:14,border:"none",cursor:"pointer",
                  background:"linear-gradient(135deg,#0284C7,#7C3AED)",
                  color:"white",fontSize:13,fontWeight:700,
                  boxShadow:"0 6px 18px rgba(2,132,199,0.35)"}}>
                  {E.book} Go to Courses
                </button>
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
                      <p style={{fontSize:11,color:T.muted,margin:0}}>Click "View &amp; Download" to inspect and save as PNG</p>
                    </div>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:999,
                    background:"#ECFDF5",color:T.emerald,border:"1px solid #A7F3D0"}}>{E.grad} Official</span>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(264px,1fr))",gap:16}}>
                  {certs.map((cert,i)=>(
                    <div key={cert.courseId} className="card-hover anim-fade-in-up"
                      style={{background:T.card,border:"1.5px solid "+(cert.color||"#0284C7")+"44",borderRadius:20,
                        overflow:"hidden",boxShadow:"0 6px 24px "+(cert.color||"#0284C7")+"18",
                        animationDelay:i*0.08+"s",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)"}}>
                      <div style={{background:"linear-gradient(135deg,"+(cert.color||"#0284C7")+",#7C3AED)",
                        padding:"22px 20px",position:"relative",overflow:"hidden"}}>
                        <div style={{position:"absolute",inset:0,
                          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.12) 1px,transparent 1px)",
                          backgroundSize:"14px 14px"}}/>
                        <div style={{fontSize:36,marginBottom:6,position:"relative"}}>{E.trophy}</div>
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
                            background:"linear-gradient(135deg,"+(cert.color||"#0284C7")+","+(cert.color||"#0284C7")+"88)",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:10,fontWeight:800,color:"white"}}>
                            {(cert.instructor||"Dr. Sarah Chen").split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div>
                            <p style={{fontSize:11,fontWeight:700,color:T.text,margin:0}}>{cert.instructor}</p>
                            <p style={{fontSize:9,color:T.muted,margin:0}}>Course Instructor</p>
                          </div>
                          <span style={{marginLeft:"auto",fontSize:9,fontWeight:700,padding:"3px 9px",
                            borderRadius:999,background:(cert.color||"#0284C7")+"18",color:cert.color||"#0284C7",
                            border:"1px solid "+(cert.color||"#0284C7")+"44"}}>{cert.level}</span>
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
                            background:"linear-gradient(135deg,"+(cert.color||"#0284C7")+",#7C3AED)",
                            color:"white",fontSize:12,fontWeight:800,cursor:"pointer",
                            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                            boxShadow:"0 4px 14px "+(cert.color||"#0284C7")+"44"}}>
                          <GraduationCap size={14}/> View &amp; Download
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
