import React, { useState, useEffect, useCallback } from "react";
import { Award, Timer, CheckCircle2, XCircle, RotateCcw, Zap, Trophy } from "lucide-react";
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

export default function AssessmentQuizPage() {
  const [phase,   setPhase]   = useState("intro"); // intro | quiz | result
  const [idx,     setIdx]     = useState(0);
  const [score,   setScore]   = useState(0);
  const [selected,setSelected]= useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTime]   = useState(20);
  const [totalTime,setTotalTime]=useState(0);

  const q = QUESTIONS[idx];

  const handleAnswer = useCallback((optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === q.ans;
    if (correct) setScore(p=>p+1);
    setAnswers(p=>[...p,{q:q.q,chosen:optIdx,correct,ans:q.ans,sign:q.sign}]);
    setTimeout(()=>{
      if (idx < QUESTIONS.length-1) { setIdx(p=>p+1); setSelected(null); setTime(20); }
      else {
        setPhase("result");
        if (correct) confetti({particleCount:120,spread:70,origin:{y:0.6}});
      }
    }, 1000);
  },[selected,q,idx]);

  useEffect(()=>{
    if(phase!=="quiz") return;
    const interval=setInterval(()=>{
      setTime(p=>{
        if(p<=1){ handleAnswer(-1); return 20; }
        return p-1;
      });
      setTotalTime(p=>p+1);
    },1000);
    return ()=>clearInterval(interval);
  },[phase,handleAnswer]);

  const restart = () => { setPhase("quiz");setIdx(0);setScore(0);setSelected(null);setAnswers([]);setTime(20);setTotalTime(0); };
  const pct = Math.round((score/QUESTIONS.length)*100);
  const grade = pct>=90?"A+":pct>=75?"B":pct>=60?"C":"D";

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0"}}>
      <div style={{maxWidth:700,margin:"0 auto",padding:"0 20px"}}>

        {/* INTRO */}
        {phase==="intro"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{background:"linear-gradient(135deg,#F97316 0%,#EA580C 60%,#D97706 100%)",borderRadius:24,padding:"32px",color:"white",boxShadow:"0 8px 24px rgba(249,115,22,0.3)",textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:20,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Award size={36} color="white"/></div>
              <h1 style={{fontSize:26,fontWeight:800,margin:0}}>Speed Quiz</h1>
              <p style={{fontSize:14,opacity:0.9,marginTop:8}}>{QUESTIONS.length} questions · 20 seconds each · Sign language knowledge</p>
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(15,23,42,0.06)"}}>
              <p style={{fontSize:13,fontWeight:800,color:T.text,marginBottom:14}}>What to expect:</p>
              {[["⏱ Timed","20 seconds per question — stay focused"],["🖐 Sign Knowledge","Questions on ASL gestures and hand shapes"],["⚡ Dynamic Signs","HELLO, PLEASE, YES, J, Z and more"],["🏆 Scoring","Grade A+ for 90%+ score"]].map(([e,d],i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:18}}>{e.split(" ")[0]}</span>
                  <div><p style={{fontSize:12,fontWeight:700,color:T.text,margin:0}}>{e.slice(3)}</p><p style={{fontSize:11,color:T.muted,margin:0}}>{d}</p></div>
                </div>
              ))}
              <button onClick={()=>setPhase("quiz")}
                style={{width:"100%",marginTop:20,padding:"13px",borderRadius:14,background:T.orange,color:"white",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:`0 4px 14px ${T.orange}44`,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <Zap size={18}/> Start Speed Quiz
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase==="quiz"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Progress bar */}
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 18px",boxShadow:"0 2px 8px rgba(15,23,42,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:700,color:T.muted}}>Question {idx+1} of {QUESTIONS.length}</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <Timer size={14} color={timeLeft<=5?T.red:T.amber}/>
                  <span style={{fontSize:14,fontWeight:800,color:timeLeft<=5?T.red:T.text}}>{timeLeft}s</span>
                </div>
              </div>
              <div style={{height:8,borderRadius:999,background:T.border,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:999,
                  width:`${((idx+1)/QUESTIONS.length)*100}%`,
                  background:`linear-gradient(to right,${T.primary},${T.violet})`,transition:"width 0.3s"}}/>
              </div>
              {/* Timer bar */}
              <div style={{height:5,borderRadius:999,background:T.border,marginTop:6,overflow:"hidden"}}>
                <div style={{height:5,borderRadius:999,background:timeLeft<=5?T.red:T.amber,
                  width:`${(timeLeft/20)*100}%`,transition:"width 1s linear"}}/>
              </div>
            </div>

            {/* Question card */}
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:24,padding:"28px",boxShadow:"0 4px 20px rgba(15,23,42,0.08)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <div style={{width:44,height:44,borderRadius:14,background:"#FFF7ED",border:`1px solid #FED7AA`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:16,fontWeight:800,color:T.orange}}>{q.sign}</span>
                </div>
                <p style={{fontSize:16,fontWeight:700,color:T.text,margin:0,lineHeight:1.4}}>{q.q}</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {q.opts.map((opt,i)=>{
                  const isSelected=selected===i;
                  const isCorrect=selected!==null&&i===q.ans;
                  const isWrong=isSelected&&i!==q.ans;
                  return (
                    <button key={i} onClick={()=>handleAnswer(i)} disabled={selected!==null}
                      style={{padding:"13px 16px",borderRadius:14,border:`2px solid ${isCorrect?"#059669":isWrong?"#E11D48":selected===null?"#E2E8F0":T.border}`,
                        background:isCorrect?"#ECFDF5":isWrong?"#FFF1F2":isSelected?"#EFF6FF":T.card,
                        cursor:selected===null?"pointer":"default",textAlign:"left",fontSize:13,fontWeight:700,
                        color:isCorrect?T.emerald:isWrong?T.red:T.text,transition:"all 0.15s",
                        display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:26,height:26,borderRadius:9,border:`2px solid ${isCorrect?"#059669":isWrong?"#E11D48":T.border}`,
                        background:isCorrect?T.emerald:isWrong?T.red:"white",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {isCorrect?<CheckCircle2 size={14} color="white"/>:isWrong?<XCircle size={14} color="white"/>:
                          <span style={{fontSize:11,fontWeight:800,color:T.muted}}>{"ABCD"[i]}</span>}
                      </div>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Score chip */}
            <div style={{textAlign:"center"}}>
              <span style={{fontSize:12,fontWeight:700,color:T.muted}}>Score: {score}/{idx+(selected!==null?1:0)} · {totalTime}s elapsed</span>
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase==="result"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:`linear-gradient(135deg,${pct>=75?"#059669":"#E11D48"} 0%,${pct>=75?"#047857":"#BE123C"} 100%)`,
              borderRadius:24,padding:"32px",color:"white",textAlign:"center",boxShadow:`0 8px 24px ${pct>=75?"rgba(5,150,105,0.3)":"rgba(225,29,72,0.3)"}`}}>
              <p style={{fontSize:56,margin:0}}>{pct>=90?"🏆":pct>=75?"🎯":pct>=60?"💪":"📖"}</p>
              <p style={{fontSize:40,fontWeight:800,margin:"8px 0 0"}}>{grade}</p>
              <p style={{fontSize:20,fontWeight:700,opacity:0.9}}>{score}/{QUESTIONS.length} correct · {pct}%</p>
              <p style={{fontSize:13,opacity:0.8,marginTop:4}}>Completed in {totalTime}s</p>
            </div>
            {/* Answer review */}
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)"}}>
              <p style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><Trophy size={14} color={T.amber}/>Answer Review</p>
              {answers.map((a,i)=>(
                <div key={i} style={{padding:"10px 12px",borderRadius:12,marginBottom:8,background:a.correct?"#F0FDF4":"#FFF1F2",border:`1px solid ${a.correct?"#BBF7D0":"#FECDD3"}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {a.correct?<CheckCircle2 size={14} color={T.emerald}/>:<XCircle size={14} color={T.red}/>}
                    <span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:999,background:"white",color:T.primary}}>{a.sign}</span>
                    <p style={{fontSize:11,color:T.text,margin:0,flex:1}}>{a.q.slice(0,55)}...</p>
                  </div>
                  {!a.correct&&<p style={{fontSize:10,color:T.emerald,marginTop:4,marginLeft:22}}>✓ Correct: {QUESTIONS[i]?.opts[a.ans]}</p>}
                </div>
              ))}
            </div>
            <button onClick={restart} style={{padding:"12px",borderRadius:14,background:T.orange,color:"white",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 12px ${T.orange}44`}}>
              <RotateCcw size={16}/> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
