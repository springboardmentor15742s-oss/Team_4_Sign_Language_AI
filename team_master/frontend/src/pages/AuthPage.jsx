import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Hand, Eye, EyeOff } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const Field = ({icon:Icon, label, type="text", value, onChange, placeholder, right, focused, onFocus, onBlur}) => {
  return (
    <div>
      <label style={{fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:5}}>{label}</label>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
          color: focused ? T.primary : T.muted,pointerEvents:"none",transition:"color 0.2s"}}>
          <Icon size={15}/>
        </div>
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{width:"100%",padding:"10px 12px 10px 36px",
            border:`1px solid ${focused ? T.primary : T.border}`,borderRadius:12,
            fontSize:13,fontWeight:500,color:T.text,background:T.card,outline:"none",boxSizing:"border-box",
            paddingRight:right?40:12,
            boxShadow: focused ? "0 0 0 3px rgba(2,132,199,0.15)" : "none",
            transition:"border-color 0.2s, box-shadow 0.2s"}}
          onFocus={onFocus}
          onBlur={onBlur}/>
        {right && <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)"}}>{right}</div>}
      </div>
    </div>
  );
};

const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" style={{animation:"spin 0.8s linear infinite",flexShrink:0}}>
    <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5"/>
    <path d="M9 2 A7 7 0 0 1 16 9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ROLES = [
  {key:"LEARNER",    emoji:"🎓", label:"Learner",    desc:"I want to learn sign language"},
  {key:"INSTRUCTOR", emoji:"👨‍🏫", label:"Instructor", desc:"I teach sign language courses"},
];

const GOALS = ["Learn ASL Alphabet (A-Z)","Master Everyday Conversation Signs","Professional & Workplace Vocabulary","Prepare for Certification","Teach Sign Language to Others"];

export default function AuthPage({ onLoginSuccess }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin]           = useState(true);
  const [email, setEmail]               = useState("ankurbiswal1968@gmail.com");
  const [password, setPassword]         = useState("password123");
  const [showPw, setShowPw]             = useState(false);
  const [fullName, setFullName]         = useState("Ankur Biswal");
  const [selectedRole, setRole]         = useState("LEARNER");
  const [level, setLevel]               = useState("Beginner");
  const [goals, setGoals]               = useState(["Learn ASL Alphabet (A-Z)","Master Everyday Conversation Signs"]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [focusField, setFocusField]     = useState(null);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const toggleGoal = (g) => setGoals(p => p.includes(g) ? p.filter(x=>x!==g) : [...p,g]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      if (isLogin) { await login(email, password); }
      else { await register({ fullName, email, password, role: selectedRole, learningLevel: level, learningGoals: goals }); }
      onLoginSuccess?.();
    } catch(err) { setError(err?.message || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#F0F9FF 0%,#F8FAFC 50%,#FFF7ED 100%)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px",
      position:"relative",overflow:"hidden"}}>

      {/* Floating decorative orbs */}
      <div style={{position:"absolute",top:"-10%",left:"-5%",width:320,height:320,borderRadius:"50%",
        background:"rgba(2,132,199,0.12)",filter:"blur(60px)",animation:"float 6s ease-in-out infinite",
        pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"5%",right:"-8%",width:280,height:280,borderRadius:"50%",
        background:"rgba(124,58,237,0.10)",filter:"blur(50px)",animation:"float 8s ease-in-out infinite 1.5s",
        pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"60%",left:"10%",width:200,height:200,borderRadius:"50%",
        background:"rgba(249,115,22,0.08)",filter:"blur(40px)",animation:"float 7s ease-in-out infinite 3s",
        pointerEvents:"none"}}/>

      {/* ASL letter decorations */}
      <div style={{position:"absolute",top:"8%",right:"12%",fontSize:120,fontWeight:800,
        color:T.text,opacity:0.03,pointerEvents:"none",userSelect:"none",lineHeight:1}}>A</div>
      <div style={{position:"absolute",bottom:"12%",left:"8%",fontSize:120,fontWeight:800,
        color:T.text,opacity:0.03,pointerEvents:"none",userSelect:"none",lineHeight:1}}>B</div>
      <div style={{position:"absolute",top:"45%",right:"5%",fontSize:100,fontWeight:800,
        color:T.text,opacity:0.025,pointerEvents:"none",userSelect:"none",lineHeight:1}}>C</div>

      <div style={{width:"100%",maxWidth:440,position:"relative",zIndex:1}}>

        {/* Brand */}
        <div className={mounted ? "anim-bounce-in" : ""} style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:56,height:56,borderRadius:18,background:"linear-gradient(135deg,#0284C7,#7C3AED)",
            display:"inline-flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 8px 24px rgba(2,132,199,0.3)",marginBottom:12}}>
            <Hand size={28} color="white"/>
          </div>
          <h1 style={{fontSize:26,fontWeight:800,color:T.text,margin:0}}>SignLearn <span style={{color:T.primary}}>AI</span></h1>
          <p style={{fontSize:13,color:T.muted,marginTop:4}}>AI-powered sign language learning platform</p>
        </div>

        {/* Card */}
        <div className="anim-scale-in" style={{background:"rgba(255,255,255,0.97)",borderRadius:24,
          border:`1px solid ${T.border}`,
          boxShadow:"0 8px 32px rgba(15,23,42,0.08)",overflow:"hidden",
          backdropFilter:"blur(20px)"}}>

          {/* Tab switcher */}
          <div style={{display:"flex",background:T.soft,margin:16,borderRadius:14,padding:4}}>
            {[["Login","Sign In"],["Register","Create Account"]].map(([key,label],i)=>{
              const active=(i===0&&isLogin)||(i===1&&!isLogin);
              return (
                <button key={key} onClick={()=>{setIsLogin(i===0);setError("");}}
                  style={{flex:1,padding:"9px",borderRadius:11,fontSize:13,fontWeight:700,border:"none",cursor:"pointer",
                    background:active?T.card:"transparent",color:active?T.primary:T.muted,
                    boxShadow:active?"0 2px 8px rgba(15,23,42,0.08)":"none",transition:"all 0.15s"}}>
                  {label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="anim-fade-in-up"
            style={{padding:"8px 20px 20px",display:"flex",flexDirection:"column",gap:14,animationDelay:"0.15s"}}>

            {/* Error */}
            {error && <div style={{padding:"10px 14px",background:"#FFF1F2",border:"1px solid #FECDD3",
              borderRadius:12,fontSize:12,fontWeight:600,color:"#BE123C"}}>{error}</div>}

            {/* Register-only: role selector */}
            {!isLogin && (
              <div>
                <label style={{fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8}}>Select Your Role</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {ROLES.map(r=>{
                    const active=selectedRole===r.key;
                    return (
                      <button key={r.key} type="button" onClick={()=>setRole(r.key)}
                        style={{padding:"12px 10px",borderRadius:14,border:`2px solid ${active?T.primary:T.border}`,
                          cursor:"pointer",background:active?"#EFF6FF":T.card,transition:"all 0.15s",textAlign:"left"}}>
                        <div style={{fontSize:20,marginBottom:4}}>{r.emoji}</div>
                        <p style={{fontSize:12,fontWeight:800,color:active?T.primary:T.text,margin:0}}>{r.label}</p>
                        <p style={{fontSize:10,color:T.muted,marginTop:2,lineHeight:1.3}}>{r.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Name (register only) */}
            {!isLogin && <Field icon={User} label="Full Name" value={fullName} onChange={setFullName} placeholder="Ankur Biswal"
              focused={focusField==="fullName"}
              onFocus={()=>setFocusField("fullName")}
              onBlur={()=>setFocusField(null)}/>}

            {/* Email */}
            <Field icon={Mail} label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com"
              focused={focusField==="email"}
              onFocus={()=>setFocusField("email")}
              onBlur={()=>setFocusField(null)}/>

            {/* Password */}
            <Field icon={Lock} label="Password" type={showPw?"text":"password"} value={password} onChange={setPassword}
              placeholder={isLogin?"Enter password":"Create a strong password"}
              focused={focusField==="password"}
              onFocus={()=>setFocusField("password")}
              onBlur={()=>setFocusField(null)}
              right={<button type="button" onClick={()=>setShowPw(!showPw)}
                style={{background:"none",border:"none",cursor:"pointer",color:T.muted,display:"flex",alignItems:"center"}}>
                {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>}/>

            {/* Register-only: level + goals */}
            {!isLogin && <>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:5}}>Learning Level</label>
                <select value={level} onChange={e=>setLevel(e.target.value)}
                  style={{width:"100%",padding:"10px 12px",border:`1px solid ${T.border}`,borderRadius:12,
                    fontSize:13,color:T.text,background:T.card,outline:"none"}}>
                  {["Beginner","Intermediate","Advanced"].map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8}}>Learning Goals</label>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {GOALS.map(g=>{
                    const on=goals.includes(g);
                    return (
                      <label key={g} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:10,
                        cursor:"pointer",background:on?"#EFF6FF":T.soft,border:`1px solid ${on?"#BFDBFE":T.border}`,transition:"all 0.1s"}}>
                        <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${on?T.primary:T.border}`,
                          background:on?T.primary:"white",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {on&&<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
                        </div>
                        <input type="checkbox" checked={on} onChange={()=>toggleGoal(g)} style={{display:"none"}}/>
                        <span style={{fontSize:11,fontWeight:600,color:on?T.primary:T.text}}>{g}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </>}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-press"
              style={{padding:"12px",borderRadius:14,background:`linear-gradient(135deg,${T.primary},#0369A1)`,
                color:"white",border:"none",fontSize:14,fontWeight:800,cursor:loading?"not-allowed":"pointer",
                opacity:loading?0.85:1,boxShadow:"0 4px 12px rgba(2,132,199,0.35)",marginTop:4,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                transition:"opacity 0.2s"}}>
              {loading && <Spinner/>}
              {loading ? "Processing..." : isLogin ? "Sign In to Continue →" : "Create My Account →"}
            </button>

            {/* Demo hint */}
            {isLogin && <p style={{textAlign:"center",fontSize:11,color:T.muted}}>
              Demo: <strong>ankurbiswal1968@gmail.com</strong> / <strong>password123</strong>
            </p>}
          </form>
        </div>

        {/* Footer */}
        <p style={{textAlign:"center",fontSize:11,color:T.muted,marginTop:16}}>
          SignLearn AI · Team 4 · Infosys Springboard 2026
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
