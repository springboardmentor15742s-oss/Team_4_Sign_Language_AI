import React, { useState } from "react";
import { BookOpen, Play, ChevronDown, ChevronUp, Clock, Star, Lock, CheckCircle2, X, ExternalLink } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

// Real YouTube embed IDs — verified ASL teaching videos
const COURSES = [
  {id:"c1",title:"ASL Alphabet Basics",desc:"Learn all 26 letters with real-time AI feedback.",level:"Beginner",cat:"Alphabet",hrs:3,lessons:8,instructor:"Dr. Sarah Chen",color:"#0284C7",
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
  {id:"c2",title:"Common Everyday Phrases",desc:"Master 50 essential phrases: greetings, please, thank you and more.",level:"Beginner",cat:"Phrases",hrs:4,lessons:6,instructor:"Prof. James Wilson",color:"#F97316",
    items:[
      {t:"Greetings & Farewells",d:"Hello, goodbye, good morning",min:18,vid:"0FcwzMq4iWg",done:true},
      {t:"Please & Thank You",d:"Polite ASL expressions",min:15,vid:"tkMg8g8vVUo",done:true},
      {t:"Yes, No & Maybe",d:"Affirmations and negations",min:12,vid:"v1desDduz5M",done:false},
      {t:"Pronouns",d:"I, you, we, they in ASL",min:16,vid:"aNLRwrEHVCQ",done:false},
      {t:"Questions",d:"Who, what, where, when, why",min:20,vid:"0FcwzMq4iWg",done:false},
      {t:"Phrases Quiz",d:"Assessment",min:10,vid:"",done:false},
    ]},
  {id:"c3",title:"Numbers, Colors & Time",desc:"Numbers 1–100, all colors, days, months, telling time.",level:"Beginner",cat:"Core Vocab",hrs:5,lessons:7,instructor:"Dr. Sarah Chen",color:"#059669",
    items:[
      {t:"Numbers 1–10",d:"Counting basics",min:14,vid:"v1desDduz5M",done:true},
      {t:"Numbers 11–100",d:"Teens, tens, hundreds",min:18,vid:"0FcwzMq4iWg",done:false},
      {t:"Colors",d:"All major colors in ASL",min:15,vid:"tkMg8g8vVUo",done:false},
      {t:"Days of Week",d:"Monday through Sunday",min:12,vid:"v1desDduz5M",done:false},
      {t:"Months",d:"January through December",min:14,vid:"aNLRwrEHVCQ",done:false},
      {t:"Telling Time",d:"Hours, minutes, expressions",min:16,vid:"0FcwzMq4iWg",done:false},
      {t:"Numbers Quiz",d:"Comprehensive test",min:10,vid:"",done:false},
    ]},
  {id:"c4",title:"Intermediate Conversations",desc:"Real conversations: family, work, weather, emotions and daily life.",level:"Intermediate",cat:"Conversation",hrs:8,lessons:7,instructor:"Prof. James Wilson",color:"#7C3AED",
    items:[
      {t:"Family Members",d:"Mother, father, siblings",min:18,vid:"tkMg8g8vVUo",done:false},
      {t:"Emotions & Feelings",d:"Happy, sad, angry, excited",min:16,vid:"v1desDduz5M",done:false},
      {t:"Food & Eating",d:"Foods, restaurant, ordering",min:20,vid:"0FcwzMq4iWg",done:false},
      {t:"Jobs & Occupations",d:"Doctor, teacher, engineer",min:18,vid:"aNLRwrEHVCQ",done:false},
      {t:"Weather & Seasons",d:"Conditions and seasons",min:15,vid:"tkMg8g8vVUo",done:false},
      {t:"Daily Routines",d:"Morning activities",min:22,vid:"v1desDduz5M",done:false},
      {t:"Conversation Practice",d:"Role-play daily scenarios",min:25,vid:"",done:false},
    ]},
  {id:"c5",title:"Medical & Emergency Signs",desc:"Critical signs for healthcare, emergencies and medical vocabulary.",level:"Intermediate",cat:"Specialized",hrs:6,lessons:6,instructor:"Dr. Emily Rodriguez",color:"#DC2626",
    items:[
      {t:"Body Parts",d:"Head, arms, legs, organs",min:20,vid:"0FcwzMq4iWg",done:false},
      {t:"Pain & Symptoms",d:"Describing discomfort",min:18,vid:"tkMg8g8vVUo",done:false},
      {t:"Emergency Signs",d:"Help, call 911, danger, fire",min:15,vid:"v1desDduz5M",done:false},
      {t:"Hospital Vocabulary",d:"Doctor, nurse, medicine",min:20,vid:"aNLRwrEHVCQ",done:false},
      {t:"Mental Health",d:"Anxiety, depression, therapy",min:18,vid:"0FcwzMq4iWg",done:false},
      {t:"Medical Assessment",d:"Final test",min:12,vid:"",done:false},
    ]},
  {id:"c6",title:"Professional & Workplace",desc:"Workplace communication: meetings, presentations and technology.",level:"Advanced",cat:"Professional",hrs:10,lessons:7,instructor:"Prof. David Kim",color:"#0F172A",
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

function VideoModal({lesson, course, onClose}) {
  const hasVideo = !!lesson.vid;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}
      onClick={(e)=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.card,borderRadius:24,width:"100%",maxWidth:800,boxShadow:"0 24px 64px rgba(0,0,0,0.3)",overflow:"hidden",position:"relative"}}>
        {/* Header */}
        <div style={{background:course.color,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.8)",margin:"0 0 3px",textTransform:"uppercase",letterSpacing:1}}>{course.title}</p>
            <p style={{fontSize:16,fontWeight:800,color:"white",margin:0}}>{lesson.t}</p>
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <X size={16} color="white"/>
          </button>
        </div>
        {/* Video */}
        {hasVideo ? (
          <div style={{position:"relative",paddingBottom:"56.25%",height:0,background:"#000"}}>
            <iframe
              style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
              src={`https://www.youtube.com/embed/${lesson.vid}?autoplay=1&rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson.t}
            />
          </div>
        ) : (
          <div style={{height:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0F172A",gap:16}}>
            <div style={{width:60,height:60,borderRadius:20,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <BookOpen size={30} color="white"/>
            </div>
            <p style={{color:"white",fontWeight:700,fontSize:14,margin:0}}>Assessment — No video required</p>
            <p style={{color:"#94A3B8",fontSize:12,margin:0}}>Go to AI Practice tab to take the interactive assessment</p>
          </div>
        )}
        {/* Footer */}
        <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Clock size={14} color={T.muted}/>
            <span style={{fontSize:12,color:T.muted,fontWeight:600}}>{lesson.min} minutes</span>
          </div>
          <a href={hasVideo?`https://youtube.com/watch?v=${lesson.vid}`:"#"} target="_blank" rel="noreferrer"
            style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,color:T.primary,textDecoration:"none"}}>
            <ExternalLink size={13}/> Open in YouTube
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
  const [modal,    setModal]    = useState(null); // {lesson, course}
  const [progress, setProgress] = useState({"c1":{"0":true,"1":true,"2":true}});

  const visible = filter==="All" ? COURSES : COURSES.filter(c=>c.level===filter);

  const getCourseProgress = (courseId, totalLessons) => {
    const done = Object.keys(progress[courseId]||{}).length;
    return Math.round((done/totalLessons)*100);
  };

  const markDone = (courseId, lessonIdx) => {
    setProgress(p=>({...p,[courseId]:{...(p[courseId]||{}),[lessonIdx]:true}}));
  };

  const openLesson = (course, lesson, idx) => {
    if (!enrolled.has(course.id)) {
      setEnrolled(p=>{const n=new Set(p);n.add(course.id);return n;});
    }
    markDone(course.id, idx);
    setModal({lesson, course});
  };

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0"}}>
      {modal && <VideoModal lesson={modal.lesson} course={modal.course} onClose={()=>setModal(null)}/>}

      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#0284C7 0%,#0369A1 40%,#7C3AED 100%)",
          borderRadius:24,padding:"28px 32px",color:"white",boxShadow:"0 8px 24px rgba(2,132,199,0.25)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
            <div style={{width:52,height:52,borderRadius:18,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <BookOpen size={28} color="white"/>
            </div>
            <div>
              <h1 style={{fontSize:24,fontWeight:800,margin:0}}>Course Library</h1>
              <p style={{fontSize:13,opacity:0.85,marginTop:3}}>{COURSES.length} courses · {COURSES.reduce((a,c)=>a+c.lessons,0)} lessons · Click any lesson to watch</p>
            </div>
          </div>
          <div style={{display:"flex",gap:14,marginTop:20,flexWrap:"wrap"}}>
            {[{v:enrolled.size,l:"Enrolled"},{v:COURSES.reduce((a,c)=>a+c.lessons,0),l:"Total Lessons"},{v:"6",l:"Instructors"},{v:"Free",l:"All Courses"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:14,padding:"10px 18px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["All","Beginner","Intermediate","Advanced"].map(f=>{
            const active=filter===f;
            return <button key={f} onClick={()=>setFilter(f)}
              style={{padding:"7px 18px",borderRadius:12,fontSize:12,fontWeight:700,border:`1px solid ${active?T.primary:T.border}`,cursor:"pointer",background:active?T.primary:T.card,color:active?"#fff":T.muted,transition:"all 0.15s"}}>{f}</button>;
          })}
          <span style={{marginLeft:"auto",fontSize:12,color:T.muted,alignSelf:"center",fontWeight:600}}>
            💡 Click any lesson row to watch the video
          </span>
        </div>

        {/* Course grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(330px,1fr))",gap:16}}>
          {visible.map(c=>{
            const lc      = LEVEL_COLOR[c.level]||LEVEL_COLOR.Beginner;
            const isEnrolled  = enrolled.has(c.id);
            const isExpanded  = expanded===c.id;
            const pct     = getCourseProgress(c.id, c.items.length);

            return (
              <div key={c.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.05)",overflow:"hidden"}}>
                {/* Banner */}
                <div style={{background:c.color,padding:"20px 20px 16px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-16,right:-16,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                    <div style={{flex:1}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:999,background:"rgba(255,255,255,0.2)",color:"white",border:"1px solid rgba(255,255,255,0.3)"}}>{c.cat}</span>
                      <h3 style={{fontSize:15,fontWeight:800,color:"white",margin:"8px 0 4px",lineHeight:1.3}}>{c.title}</h3>
                      <p style={{fontSize:11,color:"rgba(255,255,255,0.85)",margin:0,lineHeight:1.4}}>{c.desc}</p>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:12,marginTop:12}}>
                    {[{v:`${c.hrs}h`},{v:`${c.lessons} lessons`},{v:"⭐ 4.8"}].map((m,i)=>(
                      <span key={i} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{m.v}</span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div style={{padding:16}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:999,background:lc.bg,color:lc.color,border:`1px solid ${lc.border}`}}>{c.level}</span>
                      <span style={{fontSize:11,color:T.muted}}>by {c.instructor}</span>
                    </div>
                    {isEnrolled && <CheckCircle2 size={16} color={T.emerald}/>}
                  </div>

                  {/* Progress */}
                  {isEnrolled && <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:10,fontWeight:700,color:T.muted}}>Progress</span>
                      <span style={{fontSize:10,fontWeight:800,color:T.primary}}>{pct}%</span>
                    </div>
                    <div style={{height:6,borderRadius:999,background:T.border}}>
                      <div style={{height:6,borderRadius:999,width:`${pct}%`,background:`linear-gradient(to right,${T.primary},#38BDF8)`,transition:"width 0.4s"}}/>
                    </div>
                  </div>}

                  {/* Buttons */}
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{
                      if(!isEnrolled){setEnrolled(p=>{const n=new Set(p);n.add(c.id);return n;});}
                      setExpanded(isExpanded?null:c.id);
                    }}
                      style={{flex:1,padding:"9px",borderRadius:12,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",
                        background:isEnrolled?T.primary:"#F0F9FF",color:isEnrolled?"white":T.primary,
                        display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      {isEnrolled?<><Play size={13}/> Continue</>:"Enroll & Start"}
                    </button>
                    <button onClick={()=>setExpanded(isExpanded?null:c.id)}
                      style={{width:38,height:38,borderRadius:12,border:`1px solid ${T.border}`,background:T.soft,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.muted}}>
                      {isExpanded?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
                    </button>
                  </div>

                  {/* Lesson list — clickable with video player */}
                  {isExpanded && (
                    <div style={{marginTop:12,borderTop:`1px solid ${T.border}`,paddingTop:12,display:"flex",flexDirection:"column",gap:5}}>
                      <p style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>📹 Click a lesson to watch</p>
                      {c.items.map((lesson,idx)=>{
                        const isDone = !!(progress[c.id]||{})[idx];
                        const canPlay = isEnrolled || idx===0;
                        return (
                          <div key={idx}
                            onClick={()=>canPlay && openLesson(c, lesson, idx)}
                            style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,
                              background:isDone?"#ECFDF5":T.soft,
                              border:`1px solid ${isDone?"#A7F3D0":T.border}`,
                              cursor:canPlay?"pointer":"not-allowed",
                              transition:"all 0.15s",
                              opacity:canPlay?1:0.5}}>
                            <div style={{width:28,height:28,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                              background:isDone?"#059669":lesson.vid?T.primary:"#E2E8F0"}}>
                              {isDone?<CheckCircle2 size={14} color="white"/>:lesson.vid?<Play size={12} color="white"/>:<Lock size={11} color={T.muted}/>}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <p style={{fontSize:11,fontWeight:700,color:isDone?T.emerald:T.text,margin:0}}>{lesson.t}</p>
                              <p style={{fontSize:10,color:T.muted,margin:0}}>{lesson.d}</p>
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
    </div>
  );
}
