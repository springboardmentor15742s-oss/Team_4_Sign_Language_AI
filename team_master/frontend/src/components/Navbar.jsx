import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Hand, User, ChevronDown, LogOut, LayoutDashboard, Award, Camera, BookOpen, Trophy, History, Shield, Menu, X, Bell, Check, Clock } from "lucide-react";

const ROLE_STYLE = {
  LEARNER:    { bg:"#EFF6FF", color:"#1D4ED8", label:"Learner",    grad:"linear-gradient(135deg,#0284C7,#3B82F6)" },
  INSTRUCTOR: { bg:"#ECFDF5", color:"#065F46", label:"Instructor", grad:"linear-gradient(135deg,#059669,#10B981)" },
  TRAINER:    { bg:"#F0FDF4", color:"#166534", label:"Trainer",    grad:"linear-gradient(135deg,#16A34A,#4ADE80)" },
  ADMIN:      { bg:"#FEF3C7", color:"#92400E", label:"Admin",      grad:"linear-gradient(135deg,#D97706,#F59E0B)" },
};

const NAV_ITEMS = [
  { tab:"dashboard",   label:"Dashboard",   Icon:LayoutDashboard, color:"#0284C7", accent:"#EFF6FF" },
  { tab:"practice",    label:"AI Practice", Icon:Camera,           color:"#059669", accent:"#ECFDF5" },
  { tab:"quiz",        label:"Speed Quiz",  Icon:Award,            color:"#F97316", accent:"#FFF7ED" },
  { tab:"courses",     label:"Courses",     Icon:BookOpen,         color:"#7C3AED", accent:"#F5F3FF" },
  { tab:"leaderboard", label:"Leaderboard", Icon:Trophy,           color:"#D97706", accent:"#FFFBEB" },
  { tab:"history",     label:"History",     Icon:History,          color:"#7C3AED", accent:"#F5F3FF" },
  { tab:"profile",     label:"Profile",     Icon:User,             color:"#0284C7", accent:"#EFF6FF" },
];

const MOCK_NOTIFS = [
  { id:1, type:"streak",  icon:"🔥", msg:"6-day streak! Keep it up!",              time:"2m ago",  read:false },
  { id:2, type:"mastery", icon:"⭐", msg:"You mastered sign B — 91% accuracy",      time:"1h ago",  read:false },
  { id:3, type:"quiz",    icon:"🏆", msg:"Top 10 on this week's leaderboard!",       time:"3h ago",  read:false },
  { id:4, type:"course",  icon:"📚", msg:"New lesson available in ASL Alphabet",     time:"1d ago",  read:true  },
  { id:5, type:"tip",     icon:"💡", msg:"Tip: Practice letters J & Z — motion signs",time:"2d ago", read:true  },
];

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUser,    setShowUser]    = useState(false);
  const [showNotifs,  setShowNotifs]  = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [hovered,     setHovered]     = useState(null);
  const [notifs,      setNotifs]      = useState(MOCK_NOTIFS);
  const bellRef = useRef(null);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 960);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-dropdown]")) {
        setShowUser(false);
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(n => n.map(x => ({...x, read:true})));
  const markOneRead = (id) => setNotifs(n => n.map(x => x.id===id ? {...x,read:true} : x));

  const role = user?.role || "LEARNER";
  const rs   = ROLE_STYLE[role] || ROLE_STYLE.LEARNER;
  const handleLogout = () => { logout(); setShowUser(false); setMobileOpen(false); setActiveTab("auth"); };
  const navigate = (tab) => { setActiveTab(tab); setMobileOpen(false); setShowUser(false); };

  const allNavItems = [
    ...NAV_ITEMS,
    ...(role==="ADMIN"||role==="INSTRUCTOR" ? [{tab:"instructor",label:"Instructor",Icon:Shield,color:"#1D4ED8",accent:"#EFF6FF"}] : [])
  ];

  const NavBtn = ({ tab, label, Icon, color, accent }) => {
    const active = activeTab===tab, isHov = hovered===tab;
    return (
      <button onClick={()=>navigate(tab)}
        onMouseEnter={()=>setHovered(tab)} onMouseLeave={()=>setHovered(null)}
        style={{ position:"relative", display:"flex", alignItems:"center", gap:6,
          padding: isMobile?"11px 16px":"7px 13px",
          borderRadius:11, fontSize:12, fontWeight:700, border:"none", cursor:"pointer",
          transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
          width: isMobile?"100%":"auto",
          background: active?color : isHov?accent:"transparent",
          color: active?"#fff" : isHov?color:"#475569",
          boxShadow: active&&!isMobile ? `0 4px 14px ${color}44`:"none",
          transform: active||isHov ? "translateY(-1px)":"none" }}>
        <Icon size={14} style={{transition:"transform 0.2s", transform:isHov?"scale(1.15) rotate(5deg)":"scale(1)"}}/>
        {label}
        {active && !isMobile && (
          <span style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",
            width:14,height:2,borderRadius:999,background:"rgba(255,255,255,0.7)"}}/>
        )}
        {tab==="practice" && !active && (
          <span className="notif-dot" style={{position:"absolute",top:5,right:5,
            width:7,height:7,borderRadius:"50%",background:"#F97316",boxShadow:"0 0 0 2px white"}}/>
        )}
      </button>
    );
  };

  return (
    <>
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background: scrolled?"rgba(255,255,255,0.96)":"rgba(255,255,255,0.98)",
        backdropFilter:"blur(20px)",
        borderBottom: scrolled?"1px solid #E2E8F0":"1px solid transparent",
        boxShadow: scrolled?"0 4px 24px rgba(15,23,42,0.08)":"0 1px 0 #F1F5F9",
        transition:"all 0.3s ease",
      }}>
        {/* Rainbow top line */}
        <div style={{height:3,width:"100%",
          background:"linear-gradient(90deg,#0284C7,#7C3AED,#F97316,#059669,#0284C7)",
          backgroundSize:"300% 100%", animation:"gradientShift 4s linear infinite"}}/>

        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 20px",height:58,
          display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>

          {/* Brand */}
          <div onClick={()=>navigate(isAuthenticated?"dashboard":"auth")}
            style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}}>
            <div className="anim-glow" style={{width:38,height:38,borderRadius:13,
              background:"linear-gradient(135deg,#0284C7,#7C3AED)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 14px rgba(2,132,199,0.35)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:"-100%",width:"60%",height:"100%",
                background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
                animation:"glassShimmer 2.5s ease-in-out infinite"}}/>
              <Hand size={19} color="white"/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontWeight:800,fontSize:17,color:"#0F172A",letterSpacing:-0.6}}>SignLearn</span>
              <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:999,
                background:"linear-gradient(135deg,#0284C7,#7C3AED)",color:"white",letterSpacing:0.5,
                boxShadow:"0 2px 8px rgba(2,132,199,0.3)"}}>AI</span>
            </div>
          </div>

          {/* Desktop Nav */}
          {isAuthenticated && !isMobile && (
            <nav style={{display:"flex",alignItems:"center",gap:2,background:"#F8FAFC",
              padding:"4px 6px",borderRadius:15,border:"1px solid #E2E8F0",
              flex:1,justifyContent:"center",overflowX:"auto",
              boxShadow:"inset 0 1px 3px rgba(15,23,42,0.04)"}}>
              {allNavItems.map(item => <NavBtn key={item.tab} {...item}/>)}
            </nav>
          )}

          {/* Right side */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {/* Mobile hamburger */}
            {isAuthenticated && isMobile && (
              <button onClick={()=>setMobileOpen(!mobileOpen)} className="btn-press" style={{
                width:40,height:40,borderRadius:12,
                background:mobileOpen?"#0284C7":"#F8FAFC",
                border:"1px solid #E2E8F0",display:"flex",alignItems:"center",
                justifyContent:"center",cursor:"pointer",transition:"all 0.2s",
                boxShadow:mobileOpen?"0 4px 12px rgba(2,132,199,0.3)":"none"}}>
                {mobileOpen?<X size={18} color="white"/>:<Menu size={18} color="#0F172A"/>}
              </button>
            )}

            {/* ── Notification Bell ── */}
            {isAuthenticated && !isMobile && (
              <div data-dropdown style={{position:"relative"}}>
                <button className="btn-press" onClick={()=>{setShowNotifs(!showNotifs);setShowUser(false);}}
                  style={{width:40,height:40,borderRadius:12,
                    background:showNotifs?"#EFF6FF":"#F8FAFC",
                    border:`1px solid ${showNotifs?"#BFDBFE":"#E2E8F0"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    cursor:"pointer",position:"relative",transition:"all 0.18s",
                    boxShadow:showNotifs?"0 4px 12px rgba(2,132,199,0.2)":"none"}}>
                  <Bell size={16} color={showNotifs?"#0284C7":"#64748B"}/>
                  {unread>0 && (
                    <span className="notif-dot" style={{
                      position:"absolute",top:7,right:7,
                      minWidth:16,height:16,borderRadius:999,
                      background:"#E11D48",border:"2px solid white",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:9,fontWeight:800,color:"white",padding:"0 3px"}}>
                      {unread}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifs && (
                  <div className="anim-scale-in" data-dropdown style={{
                    position:"absolute",right:0,top:"calc(100% + 10px)",width:320,
                    background:"white",border:"1px solid #E2E8F0",borderRadius:20,
                    boxShadow:"0 20px 60px rgba(15,23,42,0.18)",zIndex:100,overflow:"hidden"}}>
                    {/* Header */}
                    <div style={{padding:"14px 16px",borderBottom:"1px solid #F1F5F9",
                      display:"flex",alignItems:"center",justifyContent:"space-between",
                      background:"linear-gradient(135deg,#F8FAFC,#EFF6FF)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <Bell size={15} color="#0284C7"/>
                        <span style={{fontSize:13,fontWeight:800,color:"#0F172A"}}>Notifications</span>
                        {unread>0 && (
                          <span style={{fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:999,
                            background:"#E11D48",color:"white"}}>{unread} new</span>
                        )}
                      </div>
                      {unread>0 && (
                        <button onClick={markAllRead} style={{fontSize:11,fontWeight:700,
                          color:"#0284C7",background:"none",border:"none",cursor:"pointer",
                          display:"flex",alignItems:"center",gap:4}}>
                          <Check size={11}/>Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification list */}
                    <div style={{maxHeight:340,overflowY:"auto"}}>
                      {notifs.map((n,i) => (
                        <div key={n.id} className={`anim-fade-in-up stagger-${Math.min(i+1,6)}`}
                          onClick={()=>markOneRead(n.id)}
                          style={{display:"flex",alignItems:"flex-start",gap:10,
                            padding:"12px 16px",cursor:"pointer",
                            background:n.read?"white":"#F0F9FF",
                            borderBottom:"1px solid #F8FAFC",
                            borderLeft:`3px solid ${n.read?"transparent":"#0284C7"}`,
                            transition:"background 0.15s"}}
                          onMouseEnter={e=>e.currentTarget.style.background=n.read?"#F8FAFC":"#EFF6FF"}
                          onMouseLeave={e=>e.currentTarget.style.background=n.read?"white":"#F0F9FF"}>
                          <div style={{width:34,height:34,borderRadius:10,flexShrink:0,
                            background:n.read?"#F1F5F9":"#EFF6FF",
                            display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
                            {n.icon}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <p style={{fontSize:12,fontWeight:n.read?600:700,
                              color:n.read?"#64748B":"#0F172A",margin:"0 0 3px",lineHeight:1.4}}>
                              {n.msg}
                            </p>
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <Clock size={10} color="#94A3B8"/>
                              <span style={{fontSize:10,color:"#94A3B8"}}>{n.time}</span>
                              {!n.read && (
                                <span style={{width:6,height:6,borderRadius:"50%",
                                  background:"#0284C7",display:"inline-block",marginLeft:4}}/>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{padding:"10px 16px",borderTop:"1px solid #F1F5F9",
                      background:"#F8FAFC",textAlign:"center"}}>
                      <button style={{fontSize:12,fontWeight:700,color:"#0284C7",
                        background:"none",border:"none",cursor:"pointer"}}>
                        View all notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User pill */}
            {isAuthenticated && (
              <div data-dropdown style={{position:"relative",flexShrink:0}}>
                <button onClick={()=>{setShowUser(!showUser);setShowNotifs(false);}} className="btn-press"
                  style={{display:"flex",alignItems:"center",gap:9,padding:"5px 12px 5px 5px",
                    borderRadius:999,background:showUser?"#EFF6FF":"#F8FAFC",
                    border:showUser?"1px solid #BFDBFE":"1px solid #E2E8F0",cursor:"pointer",
                    transition:"all 0.18s",boxShadow:showUser?"0 4px 12px rgba(2,132,199,0.15)":"none"}}>
                  <div style={{padding:2,borderRadius:"50%",
                    background:"linear-gradient(135deg,#0284C7,#7C3AED,#F97316)",
                    animation:"spin 8s linear infinite"}}>
                    <div style={{background:"white",borderRadius:"50%",padding:1.5}}>
                      <img src={user?.avatarUrl||`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`}
                        alt={user?.fullName}
                        style={{width:27,height:27,borderRadius:"50%",objectFit:"cover",display:"block"}}/>
                    </div>
                  </div>
                  {!isMobile && (
                    <div style={{textAlign:"left"}}>
                      <p style={{fontSize:12,fontWeight:700,color:"#0F172A",lineHeight:1,
                        maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {user?.fullName}
                      </p>
                      <span style={{fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:999,
                        background:rs.grad,color:"white",display:"inline-block",marginTop:2}}>
                        {rs.label}
                      </span>
                    </div>
                  )}
                  <ChevronDown size={12} color="#94A3B8"
                    style={{transition:"transform 0.2s",transform:showUser?"rotate(180deg)":"rotate(0deg)"}}/>
                </button>

                {/* User dropdown */}
                {showUser && (
                  <div className="anim-scale-in" data-dropdown style={{
                    position:"absolute",right:0,top:"calc(100% + 10px)",width:220,
                    background:"white",border:"1px solid #E2E8F0",borderRadius:18,
                    boxShadow:"0 16px 48px rgba(15,23,42,0.16)",zIndex:100,overflow:"hidden"}}>
                    <div style={{padding:"16px",background:"linear-gradient(135deg,#0284C7,#7C3AED)",textAlign:"center"}}>
                      <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                        <div style={{padding:2.5,borderRadius:"50%",background:"rgba(255,255,255,0.4)"}}>
                          <img src={user?.avatarUrl||`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`}
                            style={{width:44,height:44,borderRadius:"50%",display:"block"}}/>
                        </div>
                      </div>
                      <p style={{fontSize:13,fontWeight:800,color:"white",margin:0}}>{user?.fullName}</p>
                      <p style={{fontSize:10,color:"rgba(255,255,255,0.8)",marginTop:2}}>{user?.email}</p>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:999,
                        background:"rgba(255,255,255,0.2)",color:"white",
                        border:"1px solid rgba(255,255,255,0.3)",display:"inline-block",marginTop:6}}>
                        {rs.label}
                      </span>
                    </div>
                    <div style={{padding:8}}>
                      {[{icon:<User size={13} color="#0284C7"/>,bg:"#EFF6FF",label:"View Profile",action:()=>{navigate("profile");setShowUser(false);}},
                        {icon:<LogOut size={13} color="#DC2626"/>,bg:"#FFF1F2",label:"Sign Out",action:handleLogout,red:true}]
                        .map((item,i)=>(
                          <button key={i} onClick={item.action} className="btn-press"
                            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
                              borderRadius:10,background:"none",border:"none",fontSize:12,fontWeight:700,
                              color:item.red?"#DC2626":"#374151",cursor:"pointer",textAlign:"left",transition:"background 0.15s"}}
                            onMouseEnter={e=>e.currentTarget.style.background=item.red?"#FFF1F2":"#F8FAFC"}
                            onMouseLeave={e=>e.currentTarget.style.background="none"}>
                            <div style={{width:26,height:26,borderRadius:8,background:item.bg,
                              display:"flex",alignItems:"center",justifyContent:"center"}}>{item.icon}</div>
                            {item.label}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isAuthenticated && isMobile && mobileOpen && (
        <>
          <div onClick={()=>setMobileOpen(false)} style={{position:"fixed",inset:0,
            background:"rgba(15,23,42,0.4)",zIndex:40,backdropFilter:"blur(4px)"}}/>
          <div className="anim-slide-right" style={{position:"fixed",top:0,left:0,bottom:0,width:280,
            background:"white",zIndex:50,borderRight:"1px solid #E2E8F0",
            boxShadow:"8px 0 32px rgba(15,23,42,0.14)",overflowY:"auto"}}>
            <div style={{padding:"20px",background:"linear-gradient(135deg,#0284C7,#7C3AED)",
              display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:38,height:38,borderRadius:12,background:"rgba(255,255,255,0.2)",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Hand size={20} color="white"/>
              </div>
              <div>
                <p style={{fontSize:16,fontWeight:800,color:"white",margin:0}}>SignLearn AI</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:1}}>Navigation</p>
              </div>
              <button onClick={()=>setMobileOpen(false)} style={{marginLeft:"auto",width:32,height:32,
                borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <X size={16} color="white"/>
              </button>
            </div>
            <div style={{padding:12,display:"flex",flexDirection:"column",gap:3}}>
              {allNavItems.map(item=><NavBtn key={item.tab} {...item}/>)}
            </div>
            <div style={{margin:12,paddingTop:12,borderTop:"1px solid #E2E8F0"}}>
              <button onClick={handleLogout} className="btn-press"
                style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",
                  borderRadius:12,background:"linear-gradient(135deg,#FFF1F2,#FEE2E2)",
                  border:"1px solid #FECDD3",fontSize:13,fontWeight:700,color:"#DC2626",cursor:"pointer"}}>
                <LogOut size={15}/> Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes glassShimmer{0%{left:-100%}100%{left:200%}}
        @keyframes notifPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}
        @keyframes glow{0%,100%{box-shadow:0 4px 14px rgba(2,132,199,0.35)}50%{box-shadow:0 4px 22px rgba(2,132,199,0.6)}}
        [data-dropdown]:hover { z-index:101; }
      `}</style>
    </>
  );
}
