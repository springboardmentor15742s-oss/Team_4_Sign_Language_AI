import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Hand, User, ChevronDown, LogOut, LayoutDashboard, Award, Camera, Database, BookOpen, Trophy, History, Shield, Menu, X } from "lucide-react";

const ROLE_STYLE = {
  LEARNER:    { bg:"#EFF6FF", color:"#1D4ED8", label:"Learner" },
  INSTRUCTOR: { bg:"#ECFDF5", color:"#065F46", label:"Instructor" },
  TRAINER:    { bg:"#F0FDF4", color:"#166534", label:"Trainer" },
  ADMIN:      { bg:"#FEF3C7", color:"#92400E", label:"Admin" },
};

const NAV_ITEMS = [
  { tab:"dashboard",   label:"Dashboard",   Icon:LayoutDashboard, color:"#0284C7" },
  { tab:"practice",    label:"AI Practice", Icon:Camera,           color:"#0284C7" },
  { tab:"quiz",        label:"Speed Quiz",  Icon:Award,            color:"#F97316" },
  { tab:"courses",     label:"Courses",     Icon:BookOpen,         color:"#7C3AED" },
  { tab:"leaderboard", label:"Leaderboard", Icon:Trophy,           color:"#D97706" },
  { tab:"history",     label:"History",     Icon:History,          color:"#7C3AED" },
  { tab:"datasets",    label:"Datasets",    Icon:Database,         color:"#059669" },
  { tab:"profile",     label:"Profile",     Icon:User,             color:"#0F172A" },
];

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUser, setShowUser]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const role = user?.role || "LEARNER";
  const rs   = ROLE_STYLE[role] || ROLE_STYLE.LEARNER;

  const handleLogout = () => { logout(); setShowUser(false); setMobileOpen(false); setActiveTab("auth"); };
  const navigate     = (tab) => { setActiveTab(tab); setMobileOpen(false); setShowUser(false); };

  const allNavItems = [...NAV_ITEMS,
    ...(role === "ADMIN" || role === "INSTRUCTOR"
      ? [{ tab:"instructor", label:"Instructor", Icon:Shield, color:"#1D4ED8" }]
      : [])
  ];

  const NavBtn = ({ tab, label, Icon, color }) => {
    const active = activeTab === tab;
    return (
      <button onClick={() => navigate(tab)} style={{
        display:"flex", alignItems:"center", gap:6, padding: isMobile ? "10px 14px" : "6px 12px",
        borderRadius:10, fontSize:12, fontWeight:700, border:"none", cursor:"pointer",
        transition:"all 0.15s", width: isMobile ? "100%" : "auto",
        background: active ? color : "transparent",
        color: active ? "#fff" : "#475569",
        boxShadow: active && !isMobile ? `0 2px 8px ${color}33` : "none",
      }}>
        <Icon size={14}/> {label}
      </button>
    );
  };

  return (
    <>
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid #E2E8F0", boxShadow:"0 1px 8px rgba(15,23,42,0.06)",
      }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 20px", height:60,
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>

          {/* Brand */}
          <div onClick={() => navigate(isAuthenticated ? "dashboard" : "auth")}
            style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:12,
              background:"linear-gradient(135deg,#0284C7,#7C3AED)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 3px 8px rgba(2,132,199,0.3)" }}>
              <Hand size={18} color="white"/>
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontWeight:800, fontSize:16, color:"#0F172A", letterSpacing:-0.5 }}>SignLearn</span>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:999,
                  background:"#EFF6FF", color:"#0284C7", border:"1px solid #BFDBFE" }}>AI</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          {isAuthenticated && !isMobile && (
            <nav style={{ display:"flex", alignItems:"center", gap:2,
              background:"#F8FAFC", padding:"4px 6px", borderRadius:14,
              border:"1px solid #E2E8F0", flex:1, justifyContent:"center", overflowX:"auto" }}>
              {allNavItems.map(item => <NavBtn key={item.tab} {...item}/>)}
            </nav>
          )}

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Mobile hamburger */}
            {isAuthenticated && isMobile && (
              <button onClick={() => setMobileOpen(!mobileOpen)} style={{
                width:38, height:38, borderRadius:12, background:"#F8FAFC",
                border:"1px solid #E2E8F0", display:"flex", alignItems:"center",
                justifyContent:"center", cursor:"pointer" }}>
                {mobileOpen ? <X size={18} color="#0F172A"/> : <Menu size={18} color="#0F172A"/>}
              </button>
            )}

            {/* User pill */}
            {isAuthenticated && (
              <div style={{ position:"relative", flexShrink:0 }}>
                <button onClick={() => setShowUser(!showUser)} style={{
                  display:"flex", alignItems:"center", gap:8, padding:"5px 10px 5px 5px",
                  borderRadius:999, background:"#F8FAFC", border:"1px solid #E2E8F0",
                  cursor:"pointer" }}>
                  <img src={user?.avatarUrl} alt={user?.fullName}
                    style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover",
                      border:"2px solid #BFDBFE" }}/>
                  {!isMobile && (
                    <div style={{ textAlign:"left" }}>
                      <p style={{ fontSize:12, fontWeight:700, color:"#0F172A", lineHeight:1,
                        maxWidth:88, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {user?.fullName}
                      </p>
                      <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:999,
                        background:rs.bg, color:rs.color }}>{rs.label}</span>
                    </div>
                  )}
                  <ChevronDown size={13} color="#94A3B8"/>
                </button>

                {showUser && (
                  <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:200,
                    background:"white", border:"1px solid #E2E8F0", borderRadius:16,
                    boxShadow:"0 8px 24px rgba(15,23,42,0.12)", zIndex:100, overflow:"hidden" }}>
                    <div style={{ padding:"12px 16px", borderBottom:"1px solid #F1F5F9" }}>
                      <p style={{ fontSize:13, fontWeight:700, color:"#0F172A", margin:0 }}>{user?.fullName}</p>
                      <p style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{user?.email}</p>
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999,
                        background:rs.bg, color:rs.color, marginTop:4, display:"inline-block" }}>{rs.label}</span>
                    </div>
                    <div style={{ padding:6 }}>
                      <button onClick={() => { navigate("profile"); setShowUser(false); }} style={{
                        width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                        borderRadius:10, background:"none", border:"none", fontSize:12, fontWeight:700,
                        color:"#374151", cursor:"pointer", textAlign:"left" }}>
                        <User size={14} color="#0284C7"/> View Profile
                      </button>
                      <button onClick={handleLogout} style={{
                        width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                        borderRadius:10, background:"none", border:"none", fontSize:12, fontWeight:700,
                        color:"#DC2626", cursor:"pointer", textAlign:"left" }}>
                        <LogOut size={14}/> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile slide-out nav */}
      {isAuthenticated && isMobile && mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:40 }}/>
          <div style={{ position:"fixed", top:60, left:0, bottom:0, width:260,
            background:"white", zIndex:50, borderRight:"1px solid #E2E8F0",
            boxShadow:"4px 0 20px rgba(15,23,42,0.12)", overflowY:"auto", padding:12 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              {allNavItems.map(item => <NavBtn key={item.tab} {...item}/>)}
            </div>
            <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid #E2E8F0" }}>
              <button onClick={handleLogout} style={{
                width:"100%", display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
                borderRadius:10, background:"#FFF1F2", border:"none", fontSize:13, fontWeight:700,
                color:"#DC2626", cursor:"pointer", textAlign:"left" }}>
                <LogOut size={15}/> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
