import React, { useState, useEffect } from "react";
import { BookOpen, Play, ChevronDown, ChevronUp, Clock, CheckCircle2, X, ExternalLink, Lock, Sparkles, Users, Star } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const COURSES = [
  {id:"c1",title:"ASL Alphabet Basics",desc:"Learn all 26 letters with real-time AI feedback.",level:"Beginner",cat:"Alphabet",hrs:3,lessons:8,instructor:"Dr. Sarah Chen",color:"#0284C7",rating:4.8,students:1240,
    items:[
      {t:"Introduction to ASL",d:"History, culture & basics",min:12,vid:"tkMg8g8vVUo",done:true},
      {t:"Letters A–E",d:"Fist, flat, curve, D, bent fingers",min:15,vid:"v1desDduz5M",done:true},
      {t:"Letters F–J",d:"F circle, G side, H horiz, I pinky, J-curve",min:14,vid:"0FcwzMq4iWg",done:true},
      {t:"Letters K–O",d:"K thumb between, L-shape, M-N-O",min:13,vid:"aNLRwrEHVCQ",done:false},
      {t:"Letters P–T",d:"P-Q-R-S-T hand positions",min:14,vid:"tkMg8g8vVUo",done:false},
      {t:"Letters U–Z",d:"U-V-W-X-Y-Z with motion",min:12,vid:"v1desDduz5M",done:false},
      {t:"Alphabet Practice",d:"Spell real words with AI",min:20,vid:"0FcwzMq4iWg",done:false},
      {t:"Alphabet Assessment",d:"Test all 26 letters",min:10,vid:"",done:false},
    ]},
  {id:"c2",title:"Common Everyday Phrases",desc:"Master 50 essential phrases: greetings, please, thank you and more.",level:"Beginner",cat:"Phrases",hrs:4,lessons:6,instructor:"Prof. James Wilson",color:"#F97316",rating:4.7,students:980,
    items:[
      {t:"Greetings & Farewells",d:"Hello, goodbye, good morning",min:18,vid:"0FcwzMq4iWg",done:true},
      {t:"Please & Thank You",d:"Polite ASL expressions",min:15,vid:"tkMg8g8vVUo",done:true},
      {t:"Yes, No & Maybe",d:"Affirmations and negations",min:12,vid:"v1desDduz5M",done:false},
      {t:"Pronouns",d:"I, you, we, they in ASL",min:16,vid:"aNLRwrEHVCQ",done:false},
      {t:"Questions",d:"Who, what, where, when, why",min:20,vid:"0FcwzMq4iWg",done:false},
      {t:"Phrases Quiz",d:"Assessment",min:10,vid:"",done:false},
    ]},
  {id:"c3",title:"Numbers, Colors & Time",desc:"Numbers 1-100, all colors, days, months, telling time.",level:"Beginner",cat:"Core Vocab",hrs:5,lessons:7,instructor:"Dr. Sarah Chen",color:"#059669",rating:4.9,students:756,
    items:[
      {t:"Numbers 1-10",d:"Counting basics",min:14,vid:"v1desDduz5M",done:true},
      {t:"Numbers 11-100",d:"Teens, tens, hundreds",min:18,vid:"0FcwzMq4iWg",done:false},
      {t:"Colors",d:"All major colors in ASL",min:15,vid:"tkMg8g8vVUo",done:false},
      {t:"Days of Week",d:"Monday through Sunday",min:12,vid:"v1desDduz5M",done:false},
      {t:"Months",d:"January through December",min:14,vid:"aNLRwrEHVCQ",done:false},
      {t:"Telling Time",d:"Hours, minutes, expressions",min:16,vid:"0FcwzMq4iWg",done:false},
      {t:"Numbers Quiz",d:"Comprehensive test",min:10,vid:"",done:false},
    ]},
  {id:"c4",title:"Intermediate Conversations",desc:"Real conversations: family, work, weather, emotions and daily life.",level:"Intermediate",cat:"Conversation",hrs:8,lessons:7,instructor:"Prof. James Wilson",color:"#7C3AED",rating:4.6,students:420,
    items:[
      {t:"Family Members",d:"Mother, father, siblings",min:18,vid:"tkMg8g8vVUo",done:false},
      {t:"Emotions & Feelings",d:"Happy, sad, angry, excited",min:16,vid:"v1desDduz5M",done:false},
      {t:"Food & Eating",d:"Foods, restaurant, ordering",min:20,vid:"0FcwzMq4iWg",done:false},
      {t:"Jobs & Occupations",d:"Doctor, teacher, engineer",min:18,vid:"aNLRwrEHVCQ",done:false},
      {t:"Weather & Seasons",d:"Conditions and seasons",min:15,vid:"tkMg8g8vVUo",done:false},
      {t:"Daily Routines",d:"Morning activities",min:22,vid:"v1desDduz5M",done:false},
      {t:"Conversation Practice",d:"Role-play daily scenarios",min:25,vid:"",done:false},
    ]},
  {id:"c5",title:"Medical & Emergency Signs",desc:"Critical signs for healthcare, emergencies and medical vocabulary.",level:"Intermediate",cat:"Specialized",hrs:6,lessons:6,instructor:"Dr. Emily Rodriguez",color:"#DC2626",rating:4.8,students:312,
    items:[
      {t:"Body Parts",d:"Head, arms, legs, organs",min:20,vid:"0FcwzMq4iWg",done:false},
      {t:"Pain & Symptoms",d:"Describing discomfort",min:18,vid:"tkMg8g8vVUo",done:false},
      {t:"Emergency Signs",d:"Help, call 911, danger, fire",min:15,vid:"v1desDduz5M",done:false},
      {t:"Hospital Vocabulary",d:"Doctor, nurse, medicine",min:20,vid:"aNLRwrEHVCQ",done:false},
      {t:"Mental Health",d:"Anxiety, depression, therapy",min:18,vid:"0FcwzMq4iWg",done:false},
      {t:"Medical Assessment",d:"Final test",min:12,vid:"",done:false},
    ]},
  {id:"c6",title:"Professional & Workplace",desc:"Workplace communication: meetings, presentations and technology.",level:"Advanced",cat:"Professional",hrs:10,lessons:7,instructor:"Prof. David Kim",color:"#0F172A",rating:4.7,students:198,
    items:[
      {t:"Office Vocabulary",d:"Email, meeting, deadline",min:22,vid:"v1desDduz5M",done:false},
      {t:"Meeting Language",d:"Agenda, vote, discuss",min:20,vid:"0FcwzMq4iWg",done:false},
      {t:"Technology Terms",d:"Software, internet, app",min:18,vid:"tkMg8g8vVUo",done:false},
      {t:"Finance & Banking",d:"Money, budget, salary",min:20,vid:"v1desDduz5M",done:false},
      {t:"Presentations",d:"Delivered in ASL",min:25,vid:"aNLRwrEHVCQ",done:false},
      {t:"Legal & Formal",d:"Contract, rights, formal",min:22,vid:"0FcwzMq4iWg",done:false},
      {t:"Professional Exam",d:"Comprehensive assessment",min:20,vid:"",done:false},
    ]},
];
const LEVEL_COLOR = {
  Beginner:    {bg:"#ECFDF5",color:"#065F46",border:"#A7F3D0"},
  Intermediate:{bg:"#FEF3C7",color:"#92400E",border:"#FDE68A"},
  Advanced:    {bg:"#FFF1F2",color:"#9F1239",border:"#FECDD3"},
};

/* SVG circular progress ring */
function ProgressRing({ pct, color, size=48 }) {
  const r=18, c=2*Math.PI*r;
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#E2E8F0" strokeWidth="4"/>
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={c}
          strokeDashoffset={c*(1-pct/100)}
          style={{transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)"}}/>
      </svg>
      <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:10,fontWeight:800,color}}>{pct}%</span>
    </div>
  );
}

function VideoModal({ lesson, course, onClose }) {
  const hasVideo = !!lesson.vid;
  return (
    <div className="anim-fade-in" style={{position:"fixed",inset:0,
      background:"rgba(10,15,28,0.82)",zIndex:200,display:"flex",alignItems:"center",
      justifyContent:"center",padding:"20px",backdropFilter:"blur(8px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="anim-scale-in" style={{background:T.card,borderRadius:26,width:"100%",maxWidth:820,
        boxShadow:"0 40px 80px rgba(0,0,0,0.5)",overflow:"hidden",position:"relative"}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${course.color},${course.color}cc)`,
          padding:"18px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.75)",margin:"0 0 3px",textTransform:"uppercase",letterSpacing:1.5}}>
              {course.title}
            </p>
            <p style={{fontSize:17,fontWeight:800,color:"white",margin:0}}>{lesson.t}</p>
          </div>
          <button onClick={onClose} className="btn-press" style={{width:36,height:36,borderRadius:11,
            background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <X size={16} color="white"/>
          </button>
        </div>
        {/* Video */}
        {hasVideo ? (
          <div style={{position:"relative",paddingBottom:"56.25%",height:0,background:"#000"}}>
            <iframe style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
              src={`https://www.youtube.com/embed/${lesson.vid}?autoplay=1&rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen title={lesson.t}/>
          </div>
        ) : (
          <div style={{height:300,display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",background:"linear-gradient(135deg,#0F172A,#1E293B)",gap:16}}>
            <div className="anim-float" style={{width:64,height:64,borderRadius:22,
              background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <BookOpen size={32} color="white"/>
            </div>
            <p style={{color:"white",fontWeight:700,fontSize:14,margin:0}}>Assessment — No video required</p>
            <p style={{color:"#94A3B8",fontSize:12,margin:0}}>Go to AI Practice tab to take the interactive assessment</p>
          </div>
        )}
        {/* Footer */}
        <div style={{padding:"14px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",
          borderTop:`1px solid ${T.border}`,background:"#FAFAFA"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Clock size={14} color={T.muted}/>
            <span style={{fontSize:12,color:T.muted,fontWeight:600}}>{lesson.min} minutes</span>
          </div>
          <a href={hasVideo?`https://youtube.com/watch?v=${lesson.vid}`:"#"} target="_blank" rel="noreferrer"
            style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,
              color:T.primary,textDecoration:"none",padding:"6px 14px",borderRadius:10,
              background:"#EFF6FF",border:"1px solid #BFDBFE"}}>
            <ExternalLink size={12}/> Open in YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [filter,   setFilter]   = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [enrolled, setEnrolled] = useState(new Set(["c1"]));
  const [modal,    setModal]    = useState(null);
  const [progress, setProgress] = useState({"c1":{"0":true,"1":true,"2":true}});
  const [mounted,  setMounted]  = useState(false);
  const [hovered,  setHovered]  = useState(null);
  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),80); return()=>clearTimeout(t); },[]);

  const visible = filter==="All" ? COURSES : COURSES.filter(c=>c.level===filter);
  const getCourseProgress = (id,total) => Math.round((Object.keys(progress[id]||{}).length/total)*100);
  const markDone = (id,idx) => setProgress(p=>({...p,[id]:{...(p[id]||{}),[idx]:true}}));
  const openLesson = (course,lesson,idx) => {
    if(!enrolled.has(course.id)) setEnrolled(p=>{const n=new Set(p);n.add(course.id);return n;});
    markDone(course.id,idx);
    setModal({lesson,course});
  };

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0",
      backgroundImage:"radial-gradient(#CBD5E1 1px,transparent 1px)",backgroundSize:"28px 28px"}}>
      {modal&&<VideoModal lesson={modal.lesson} course={modal.course} onClose={()=>setModal(null)}/>}

      <div style={{maxWidth:1120,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* ── HERO ──────────────────────────────── */}
        <div className="anim-fade-in-down" style={{
          background:"linear-gradient(135deg,#0284C7 0%,#0369A1 35%,#7C3AED 75%,#6D28D9 100%)",
          backgroundSize:"200% 200%",animation:"gradientShift 8s ease infinite",
          borderRadius:28,padding:"36px 40px",color:"white",
          boxShadow:"0 16px 48px rgba(2,132,199,0.30)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.07)",animation:"float 5s ease-in-out infinite"}}/>
          <div style={{position:"absolute",bottom:-20,left:100,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.05)",animation:"float 7s ease-in-out infinite 1s"}}/>
          <div style={{position:"absolute",top:30,right:"30%",width:40,height:40,borderRadius:"50%",background:"rgba(251,191,36,0.15)",animation:"float 4s ease-in-out infinite 0.5s"}}/>
          <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:20,position:"relative"}}>
            <div className="anim-float" style={{width:60,height:60,borderRadius:20,
              background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 8px 24px rgba(0,0,0,0.15)"}}>
              <BookOpen size={30} color="white"/>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <h1 style={{fontSize:28,fontWeight:800,margin:0,letterSpacing:-0.5}}>Course Library</h1>
                <span className="anim-pulse" style={{fontSize:10,fontWeight:800,padding:"3px 10px",
                  borderRadius:999,background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.35)"}}>
                  FREE
                </span>
              </div>
              <p style={{fontSize:13,opacity:0.85,margin:0}}>
                {COURSES.length} courses · {COURSES.reduce((a,c)=>a+c.lessons,0)} lessons · Click any lesson to watch
              </p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",position:"relative"}}>
            {[
              {v:`${enrolled.size}`,      l:"Enrolled"},
              {v:COURSES.reduce((a,c)=>a+c.lessons,0), l:"Total Lessons"},
              {v:"4",       l:"Instructors"},
              {v:"3,910+",  l:"Students"},
            ].map((s,i)=>(
              <div key={i} className={`anim-fade-in-up stagger-${i+1}`}
                style={{background:"rgba(255,255,255,0.16)",backdropFilter:"blur(12px)",
                  border:"1px solid rgba(255,255,255,0.28)",borderRadius:16,
                  padding:"12px 22px",textAlign:"center",minWidth:90}}>
                <p style={{fontSize:22,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILTERS ───────────────────────────── */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {["All","Beginner","Intermediate","Advanced"].map(f=>{
            const active=filter===f;
            return (
              <button key={f} className="btn-press" onClick={()=>setFilter(f)} style={{
                padding:"8px 20px",borderRadius:12,fontSize:12,fontWeight:700,
                border:`1.5px solid ${active?T.primary:T.border}`,cursor:"pointer",
                background:active?T.primary:T.card,color:active?"#fff":T.muted,
                transition:"all 0.18s",
                boxShadow:active?"0 4px 14px rgba(2,132,199,0.28)":"none"}}>
                {f} {f!=="All"&&`(${COURSES.filter(c=>c.level===f).length})`}
              </button>
            );
          })}
          <span style={{marginLeft:"auto",fontSize:12,color:T.muted,fontWeight:600,
            background:"#EFF6FF",padding:"6px 14px",borderRadius:10,border:"1px solid #BFDBFE",color:T.primary}}>
            💡 Click any lesson to watch
          </span>
        </div>

        {/* ── COURSE GRID ───────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:18}}>
          {visible.map((c,ci)=>{
            const lc = LEVEL_COLOR[c.level]||LEVEL_COLOR.Beginner;
            const isEnrolled = enrolled.has(c.id);
            const isExpanded = expanded===c.id;
            const pct = getCourseProgress(c.id, c.items.length);
            const isHov = hovered===c.id;
            return (
              <div key={c.id} className={`anim-fade-in-up`}
                onMouseEnter={()=>setHovered(c.id)} onMouseLeave={()=>setHovered(null)}
                style={{background:T.card,borderRadius:22,overflow:"hidden",
                  border:`1.5px solid ${isHov?c.color:T.border}`,
                  boxShadow:isHov?`0 20px 48px rgba(15,23,42,0.14), 0 4px 16px ${c.color}22`:"0 4px 16px rgba(15,23,42,0.07)",
                  transform:isHov?"translateY(-6px)":"translateY(0)",
                  transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  animationDelay:ci*0.08+"s"}}>
                {/* Banner */}
                <div style={{background:`linear-gradient(135deg,${c.color},${c.color}bb)`,
                  padding:"22px 22px 18px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-20,right:-20,width:90,height:90,
                    borderRadius:"50%",background:"rgba(255,255,255,0.1)",animation:"float 4s ease-in-out infinite"}}/>
                  <div style={{position:"absolute",bottom:-10,left:20,width:50,height:50,
                    borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,position:"relative"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:6,marginBottom:8}}>
                        <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,
                          background:"rgba(255,255,255,0.22)",color:"white",border:"1px solid rgba(255,255,255,0.3)"}}>
                          {c.cat}
                        </span>
                        <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,
                          background:lc.bg,color:lc.color,border:`1px solid ${lc.border}`}}>
                          {c.level}
                        </span>
                      </div>
                      <h3 style={{fontSize:16,fontWeight:800,color:"white",margin:"0 0 5px",lineHeight:1.3}}>{c.title}</h3>
                      <p style={{fontSize:11,color:"rgba(255,255,255,0.82)",margin:0,lineHeight:1.5}}>{c.desc}</p>
                    </div>
                    {/* Progress ring */}
                    {isEnrolled && (
                      <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:6,backdropFilter:"blur(8px)"}}>
                        <ProgressRing pct={pct} color="white" size={52}/>
                      </div>
                    )}
                  </div>
                  {/* Metadata row */}
                  <div style={{display:"flex",gap:14,marginTop:12,position:"relative"}}>
                    {[{ic:"⏱",v:`${c.hrs}h content`},{ic:"📹",v:`${c.lessons} lessons`},{ic:"⭐",v:c.rating}].map((m,i)=>(
                      <span key={i} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.88)",display:"flex",gap:4}}>
                        {m.ic} {m.v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div style={{padding:18}}>
                  {/* Instructor + enrolled */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:"50%",
                        background:`linear-gradient(135deg,${c.color},${c.color}88)`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:10,fontWeight:800,color:"white"}}>
                        {c.instructor.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <p style={{fontSize:11,fontWeight:700,color:T.text,margin:0}}>{c.instructor}</p>
                        <p style={{fontSize:9,color:T.muted,margin:0}}>{c.students.toLocaleString()} students</p>
                      </div>
                    </div>
                    {isEnrolled&&<span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,
                      background:"#ECFDF5",color:T.emerald,border:"1px solid #A7F3D0"}}>
                      ✓ Enrolled
                    </span>}
                  </div>

                  {/* Progress bar */}
                  {isEnrolled&&(
                    <div style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:10,fontWeight:700,color:T.muted}}>Your Progress</span>
                        <span style={{fontSize:10,fontWeight:800,color:c.color}}>{pct}%</span>
                      </div>
                      <div style={{height:7,borderRadius:999,background:"#E2E8F0"}}>
                        <div style={{height:7,borderRadius:999,
                          width:mounted?`${pct}%`:"0%",
                          background:`linear-gradient(to right,${c.color},${c.color}88)`,
                          transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:`0 2px 6px ${c.color}44`}}/>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{display:"flex",gap:8,marginBottom:isExpanded?14:0}}>
                    <button className="btn-press ripple-btn" onClick={()=>{
                      if(!isEnrolled) setEnrolled(p=>{const n=new Set(p);n.add(c.id);return n;});
                      setExpanded(isExpanded?null:c.id);
                    }} style={{flex:1,padding:"10px",borderRadius:13,fontSize:12,fontWeight:800,
                      border:"none",cursor:"pointer",
                      background:isEnrolled?`linear-gradient(135deg,${c.color},${c.color}cc)`:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",
                      color:isEnrolled?"white":T.primary,
                      display:"flex",alignItems:"center",justifyContent:"center",gap:7,
                      boxShadow:isEnrolled?`0 6px 18px ${c.color}44`:"none",
                      transition:"all 0.2s"}}>
                      <Play size={13}/>
                      {isEnrolled?"Continue Learning":"Enroll & Start"}
                    </button>
                    <button className="btn-press" onClick={()=>setExpanded(isExpanded?null:c.id)}
                      style={{width:42,height:42,borderRadius:13,border:`1px solid ${T.border}`,
                        background:T.soft,cursor:"pointer",display:"flex",alignItems:"center",
                        justifyContent:"center",color:T.muted,transition:"all 0.15s"}}>
                      {isExpanded?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
                    </button>
                  </div>

                  {/* Lesson list */}
                  {isExpanded&&(
                    <div className="anim-fade-in" style={{borderTop:`1px solid ${T.border}`,paddingTop:14,
                      display:"flex",flexDirection:"column",gap:5}}>
                      <p style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",
                        letterSpacing:1.2,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                        📹 Click a lesson to watch
                      </p>
                      {c.items.map((lesson,idx)=>{
                        const isDone=!!(progress[c.id]||{})[idx];
                        const canPlay=isEnrolled||idx===0;
                        return (
                          <div key={idx} className={`anim-fade-in-up stagger-${Math.min(idx+1,6)}`}
                            onClick={()=>canPlay&&openLesson(c,lesson,idx)}
                            style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",
                              borderRadius:11,cursor:canPlay?"pointer":"not-allowed",
                              background:isDone?"linear-gradient(90deg,#ECFDF5,#F0FDF4)":T.soft,
                              border:`1px solid ${isDone?"#A7F3D0":T.border}`,
                              borderLeft:`3px solid ${isDone?T.emerald:canPlay?c.color:"#E2E8F0"}`,
                              transition:"all 0.18s",opacity:canPlay?1:0.5}}>
                            <div style={{width:30,height:30,borderRadius:9,flexShrink:0,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              background:isDone?T.emerald:lesson.vid?c.color:"#E2E8F0",
                              boxShadow:isDone?`0 2px 8px rgba(5,150,105,0.3)`:lesson.vid?`0 2px 8px ${c.color}44`:"none"}}>
                              {isDone?<CheckCircle2 size={14} color="white"/>:lesson.vid?<Play size={12} color="white"/>:<Lock size={11} color={T.muted}/>}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <p style={{fontSize:11,fontWeight:700,color:isDone?T.emerald:T.text,margin:0}}>{lesson.t}</p>
                              <p style={{fontSize:9,color:T.muted,margin:0}}>{lesson.d}</p>
                            </div>
                            <span style={{fontSize:10,color:T.muted,flexShrink:0,fontWeight:600}}>{lesson.min}m</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.2)}}
      `}</style>
    </div>
  );
}
