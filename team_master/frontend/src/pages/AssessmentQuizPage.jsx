import React, { useState, useEffect, useCallback } from "react";
import { Award, CheckCircle2, XCircle, RotateCcw, Zap, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",red:"#E11D48",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const QUESTIONS = [
  {q:"Which hand shape represents the letter A?",opts:["Fist with thumb on the side","Flat hand palm out","All fingers spread wide","Index finger pointing up"],ans:0,sign:"A"},
  {q:"How do you sign HELLO in ASL?",opts:["Fist moves upward","Open palm waves from forehead outward","Two hands clap together","Index finger taps lips"],ans:1,sign:"HELLO"},
  {q:"NAMASTE requires how many hands?",opts:["One hand","Two hands pressed together","One fist on a palm","Two V-signs"],ans:1,sign:"NAMASTE"},
  {q:"Which sign uses only the pinky finger?",opts:["Y","I","L","J"],ans:1,sign:"I"},
  {q:"How do you sign YES in ASL?",opts:["Open hand waves side to side","Index finger circles forward","Fist nods up and down","Flat hand sweeps forward"],ans:2,sign:"YES"},
  {q:"The letter V in ASL looks like which common gesture?",opts:["Thumbs up","Peace/victory sign","OK sign","Index pointing sideways"],ans:1,sign:"V"},
  {q:"PLEASE is a dynamic sign — what motion does it use?",opts:["Waving side to side","Vertical fist nod","Open palm circular on chest","Both hands clapping"],ans:2,sign:"PLEASE"},
  {q:"Which letter requires a J-curve motion?",opts:["I","J","K","L"],ans:1,sign:"J"},
  {q:"NAMASTE is a two-hand static sign. Both palms are:",opts:["One on top of the other","Pressed together, fingers up","Interlocked at the index fingers","Spread wide apart"],ans:1,sign:"NAMASTE"},
  {q:"The Z sign requires what type of motion?",opts:["Circular motion","Up-down nod","3-stroke zigzag with index finger","Side-to-side wave"],ans:2,sign:"Z"},
];

const CIRCUM = 2*Math.PI*28; // r=28

export default function AssessmentQuizPage() {
  const [phase,    setPhase]   = useState("intro");
  const [idx,      setIdx]     = useState(0);
  const [score,    setScore]   = useState(0);
  const [selected, setSelected]= useState(null);
  const [answers,  setAnswers] = useState([]);
  const [timeLeft, setTime]    = useState(20);
  const [totalTime,setTotal]   = useState(0);
  const [flash,    setFlash]   = useState(null); // 'correct' | 'wrong'
  const [mounted,  setMounted] = useState(false);
  useEffect(()=>{ setTimeout(()=>setMounted(true),80); },[]);

  const q = QUESTIONS[idx];
  const timerColor = timeLeft>10?"#059669":timeLeft>5?"#D97706":"#E11D48";

  const handleAnswer = useCallback((optIdx)=>{
    if(selected!==null) return;
    setSelected(optIdx);
    const correct = optIdx===q.ans;
    if(correct) setScore(p=>p+1);
    setFlash(correct?"correct":"wrong");
    setTimeout(()=>setFlash(null),450);
    setAnswers(p=>[...p,{q:q.q,chosen:optIdx,correct,ans:q.ans,sign:q.sign}]);
    setTimeout(()=>{
      if(idx<QUESTIONS.length-1){ setIdx(p=>p+1); setSelected(null); setTime(20); }
      else{
        setPhase("result");
        if(correct) confetti({particleCount:130,spread:70,origin:{y:0.6}});
      }
    },1000);
  },[selected,q,idx]);

  useEffect(()=>{
    if(phase!=="quiz") return;
    const iv=setInterval(()=>{
      setTime(p=>{ if(p<=1){ handleAnswer(-1); return 20; } return p-1; });
      setTotal(p=>p+1);
    },1000);
    return()=>clearInterval(iv);
  },[phase,handleAnswer]);

  const restart=()=>{ setPhase("quiz");setIdx(0);setScore(0);setSelected(null);setAnswers([]);setTime(20);setTotal(0); };
  const pct   = Math.round((score/QUESTIONS.length)*100);
  const grade = pct>=90?"A+":pct>=75?"B":pct>=60?"C":"D";
  const gradeGrad = pct>=90?"linear-gradient(135deg,#059669,#047857)":pct>=75?"linear-gradient(135deg,#0284C7,#0369A1)":pct>=60?"linear-gradient(135deg,#D97706,#B45309)":"linear-gradient(135deg,#E11D48,#BE123C)";

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0",
      backgroundImage:"radial-gradient(#E2E8F0 1px,transparent 1px)",backgroundSize:"24px 24px"}}>
      <div style={{maxWidth:700,margin:"0 auto",padding:"0 20px"}}>

        {/* INTRO */}
        {phase==="intro"&&(
          <div className="anim-fade-in-up" style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{background:"linear-gradient(135deg,#F97316 0%,#EA580C 60%,#D97706 100%)",
              backgroundSize:"200% 200%",animation:"gradientShift 5s ease infinite",
              borderRadius:24,padding:"36px",color:"white",boxShadow:"0 8px 32px rgba(249,115,22,0.30)",
              textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.08)",animation:"float 4s ease-in-out infinite"}}/>
              <div className="anim-bounce-in" style={{width:68,height:68,borderRadius:22,background:"rgba(255,255,255,0.22)",
                display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",
                boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
                <Award size={38} color="white"/>
              </div>
              <h1 style={{fontSize:28,fontWeight:800,margin:0}}>Speed Quiz</h1>
              <p style={{fontSize:14,opacity:0.9,marginTop:8}}>{QUESTIONS.length} questions · 20 seconds each · Sign language knowledge</p>
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:26,
              boxShadow:"0 4px 20px rgba(15,23,42,0.07)"}}>
              <p style={{fontSize:13,fontWeight:800,color:T.text,marginBottom:16}}>What to expect:</p>
              {[["⏱ Timed","20 seconds per question — stay focused"],
                ["🖐 Sign Knowledge","Questions on ASL gestures and hand shapes"],
                ["⚡ Dynamic Signs","HELLO, PLEASE, YES, J, Z and more"],
                ["🏆 Scoring","Grade A+ for 90%+ score"]
              ].map(([e,d],i)=>(
                <div key={i} className={`anim-fade-in-up stagger-${i+1}`}
                  style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:20,flexShrink:0}}>{e.split(" ")[0]}</span>
                  <div>
                    <p style={{fontSize:12,fontWeight:700,color:T.text,margin:0}}>{e.slice(3)}</p>
                    <p style={{fontSize:11,color:T.muted,margin:"2px 0 0"}}>{d}</p>
                  </div>
                </div>
              ))}
              <button className="btn-press" onClick={()=>setPhase("quiz")}
                style={{width:"100%",marginTop:20,padding:"14px",borderRadius:14,background:T.orange,
                  color:"white",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",
                  boxShadow:`0 6px 20px rgba(249,115,22,0.35)`,display:"flex",
                  alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s"}}>
                <Zap size={18}/> Start Speed Quiz
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase==="quiz"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Progress header */}
            <div className="anim-fade-in-down" style={{background:T.card,border:`1px solid ${T.border}`,
              borderRadius:16,padding:"14px 20px",boxShadow:"0 2px 8px rgba(15,23,42,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:700,color:T.muted}}>Question {idx+1} of {QUESTIONS.length}</span>
                {/* SVG circular timer */}
                <div style={{position:"relative",width:60,height:60,flexShrink:0}}>
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#E2E8F0" strokeWidth="5"/>
                    <circle cx="30" cy="30" r="24" fill="none"
                      stroke={timerColor} strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={CIRCUM}
                      strokeDashoffset={CIRCUM*(1-timeLeft/20)}
                      style={{transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dashoffset 1s linear,stroke 0.3s"}}/>
                  </svg>
                  <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:14,fontWeight:800,color:timerColor}}>{timeLeft}</span>
                </div>
              </div>
              {/* Progress fill bar */}
              <div style={{height:7,borderRadius:999,background:T.border,overflow:"hidden"}}>
                <div style={{height:7,borderRadius:999,
                  width:`${((idx+1)/QUESTIONS.length)*100}%`,
                  background:"linear-gradient(to right,#0284C7,#7C3AED)",transition:"width 0.4s ease"}}/>
              </div>
              {/* Timer bar */}
              <div style={{height:4,borderRadius:999,background:T.border,marginTop:5,overflow:"hidden"}}>
                <div style={{height:4,borderRadius:999,background:timerColor,
                  width:`${(timeLeft/20)*100}%`,transition:"width 1s linear"}}/>
              </div>
            </div>

            {/* Question card */}
            <div key={idx} className="anim-scale-in" style={{
              background:flash==="correct"?"#F0FDF4":flash==="wrong"?"#FFF1F2":T.card,
              border:`2px solid ${flash==="correct"?"#059669":flash==="wrong"?"#E11D48":T.border}`,
              borderRadius:24,padding:"28px",boxShadow:"0 4px 24px rgba(15,23,42,0.08)",
              transition:"background 0.3s,border-color 0.3s"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
                <div style={{width:48,height:48,borderRadius:16,background:"#FFF7ED",
                  border:"1px solid #FED7AA",display:"flex",alignItems:"center",
                  justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(249,115,22,0.15)"}}>
                  <span style={{fontSize:16,fontWeight:800,color:T.orange}}>{q.sign}</span>
                </div>
                <p style={{fontSize:16,fontWeight:700,color:T.text,margin:0,lineHeight:1.5}}>{q.q}</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {q.opts.map((opt,i)=>{
                  const isSel=selected===i, isCorr=selected!==null&&i===q.ans, isWrong=isSel&&i!==q.ans;
                  return (
                    <button key={i} className={`anim-fade-in-up btn-press stagger-${i+1}`}
                      onClick={()=>handleAnswer(i)} disabled={selected!==null}
                      style={{padding:"13px 16px",borderRadius:14,
                        border:`2px solid ${isCorr?"#059669":isWrong?"#E11D48":isSel?"#0284C7":T.border}`,
                        background:isCorr?"#ECFDF5":isWrong?"#FFF1F2":isSel?"#EFF6FF":T.card,
                        cursor:selected===null?"pointer":"default",textAlign:"left",
                        fontSize:13,fontWeight:700,color:isCorr?T.emerald:isWrong?T.red:T.text,
                        transition:"all 0.18s",display:"flex",alignItems:"center",gap:12,
                        boxShadow:isCorr?"0 4px 12px rgba(5,150,105,0.2)":isWrong?"0 4px 12px rgba(225,29,72,0.2)":"none"}}>
                      <div style={{width:28,height:28,borderRadius:9,
                        border:`2px solid ${isCorr?"#059669":isWrong?"#E11D48":T.border}`,
                        background:isCorr?T.emerald:isWrong?T.red:"white",
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {isCorr?<CheckCircle2 size={14} color="white"/>:isWrong?<XCircle size={14} color="white"/>
                          :<span style={{fontSize:11,fontWeight:800,color:T.muted}}>{"ABCD"[i]}</span>}
                      </div>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <span style={{fontSize:12,fontWeight:700,color:T.muted}}>
                Score: {score}/{idx+(selected!==null?1:0)} · {totalTime}s elapsed
              </span>
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase==="result"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="anim-bounce-in" style={{background:gradeGrad,borderRadius:24,padding:"36px",
              color:"white",textAlign:"center",boxShadow:`0 8px 32px ${pct>=75?"rgba(5,150,105,0.3)":"rgba(225,29,72,0.3)"}`,
              position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
              <p style={{fontSize:60,margin:0,lineHeight:1}}>{pct>=90?"🏆":pct>=75?"🎯":pct>=60?"💪":"📖"}</p>
              <p style={{fontSize:48,fontWeight:800,margin:"10px 0 0",lineHeight:1}}>{grade}</p>
              <p style={{fontSize:20,fontWeight:700,opacity:0.92,margin:"8px 0 0"}}>{score}/{QUESTIONS.length} correct · {pct}%</p>
              <p style={{fontSize:13,opacity:0.8,marginTop:4}}>Completed in {totalTime}s</p>
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:22,
              boxShadow:"0 4px 20px rgba(15,23,42,0.07)"}}>
              <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
                <Trophy size={14} color={T.amber}/>Answer Review
              </p>
              {answers.map((a,i)=>(
                <div key={i} className={`anim-fade-in-up`} style={{padding:"10px 13px",borderRadius:12,marginBottom:8,
                  background:a.correct?"#F0FDF4":"#FFF1F2",
                  borderLeft:`3px solid ${a.correct?"#059669":"#E11D48"}`,
                  border:`1px solid ${a.correct?"#BBF7D0":"#FECDD3"}`,
                  animationDelay:i*0.04+"s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {a.correct?<CheckCircle2 size={14} color={T.emerald}/>:<XCircle size={14} color={T.red}/>}
                    <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:999,background:"white",color:T.primary}}>{a.sign}</span>
                    <p style={{fontSize:11,color:T.text,margin:0,flex:1}}>{a.q.slice(0,55)}...</p>
                  </div>
                  {!a.correct&&<p style={{fontSize:10,color:T.emerald,marginTop:4,marginLeft:22}}>
                    ✓ Correct: {QUESTIONS[i]?.opts[a.ans]}
                  </p>}
                </div>
              ))}
            </div>
            <button className="btn-press" onClick={restart}
              style={{padding:"13px",borderRadius:14,background:T.orange,color:"white",border:"none",
                fontSize:13,fontWeight:800,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                boxShadow:`0 6px 20px rgba(249,115,22,0.35)`}}>
              <RotateCcw size={16}/> Try Again
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>
    </div>
  );
}
