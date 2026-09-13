import React, { useRef, useEffect, useCallback } from "react";
import { GraduationCap, X, Download } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",muted:"#64748B",soft:"#F1F5F9" };

export default function CertModal({ cert, userName, onClose }) {
  const canvasRef = useRef(null);

  const drawCert = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 900, H = 620;
    canvas.width = W; canvas.height = H;

    const rr = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    };

    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, W, H);

    // Double border
    const primaryColor = cert.color || "#0284C7";
    ctx.strokeStyle = primaryColor; ctx.lineWidth = 6;
    rr(14, 14, W - 28, H - 28, 16); ctx.stroke();
    ctx.strokeStyle = primaryColor + "55"; ctx.lineWidth = 2;
    rr(22, 22, W - 44, H - 44, 12); ctx.stroke();

    // Header gradient band
    const hg = ctx.createLinearGradient(0, 0, W, 0);
    hg.addColorStop(0, primaryColor); hg.addColorStop(1, "#7C3AED");
    ctx.fillStyle = hg; rr(14, 14, W - 28, 142, 16); ctx.fill();

    // Dot pattern on header
    for (let gx = 30; gx < W - 30; gx += 18) for (let gy = 18; gy < 155; gy += 18) {
      ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fill();
    }

    // Trophy emoji
    ctx.font = "54px serif"; ctx.textAlign = "center";
    ctx.fillText("\uD83C\uDFC6", W / 2, 86);

    // Platform tag
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("SIGNLEARN AI  \u00B7  INFOSYS SPRINGBOARD 2026", W / 2, 136);

    // Section heading
    ctx.fillStyle = primaryColor; ctx.font = "bold 12px sans-serif";
    ctx.fillText("CERTIFICATE OF COMPLETION", W / 2, 192);

    // Rule
    ctx.beginPath(); ctx.moveTo(W / 2 - 130, 202); ctx.lineTo(W / 2 + 130, 202);
    ctx.strokeStyle = primaryColor + "88"; ctx.lineWidth = 1.5; ctx.stroke();

    // Certify text
    ctx.fillStyle = "#64748B"; ctx.font = "italic 15px Georgia,serif";
    ctx.fillText("This is to certify that", W / 2, 244);

    // Learner name
    const displayName = userName || "Ankur Biswal";
    ctx.fillStyle = "#0F172A"; ctx.font = "bold 34px Georgia,serif";
    ctx.fillText(displayName, W / 2, 292);
    const nw = ctx.measureText(displayName).width;
    ctx.beginPath(); ctx.moveTo(W / 2 - nw / 2, 302); ctx.lineTo(W / 2 + nw / 2, 302);
    ctx.strokeStyle = "#0F172A33"; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = "#64748B"; ctx.font = "italic 15px Georgia,serif";
    ctx.fillText("has successfully completed all lessons in", W / 2, 330);

    // Course title
    ctx.fillStyle = primaryColor; ctx.font = "bold 22px sans-serif";
    ctx.fillText(cert.title || "ASL Course", W / 2, 366);

    // Level pill
    const lw = 110;
    ctx.fillStyle = primaryColor + "18"; rr(W / 2 - lw / 2, 380, lw, 26, 13); ctx.fill();
    ctx.strokeStyle = primaryColor + "44"; ctx.lineWidth = 1;
    rr(W / 2 - lw / 2, 380, lw, 26, 13); ctx.stroke();
    ctx.fillStyle = primaryColor; ctx.font = "bold 11px sans-serif";
    ctx.fillText((cert.level || "Beginner") + " Level", W / 2, 397);

    // Meta row
    const issued = cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : new Date().toLocaleDateString("en-IN");
    [(cert.hrs || 3) + "h Content", (cert.lessons || 8) + " Lessons", "Issued: " + issued].forEach((m, i) => {
      ctx.fillStyle = "#94A3B8"; ctx.font = "11px sans-serif";
      ctx.fillText(m, W / 2 - 200 + i * 200, 430);
    });

    // Separator
    ctx.beginPath(); ctx.moveTo(60, 456); ctx.lineTo(W - 60, 456);
    ctx.strokeStyle = "#E2E8F0"; ctx.lineWidth = 1; ctx.stroke();

    // Instructor (left)
    ctx.fillStyle = "#0F172A"; ctx.font = "italic bold 15px Georgia,serif"; ctx.textAlign = "left";
    ctx.fillText(cert.instructor || "Dr. Sarah Chen", 90, 498);
    ctx.fillStyle = "#64748B"; ctx.font = "10px sans-serif";
    ctx.fillText("Course Instructor", 90, 514);

    // Official seal (centre)
    const sg = ctx.createRadialGradient(W / 2, 492, 8, W / 2, 492, 36);
    sg.addColorStop(0, primaryColor); sg.addColorStop(1, "#7C3AED");
    ctx.beginPath(); ctx.arc(W / 2, 492, 36, 0, Math.PI * 2);
    ctx.fillStyle = sg; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "white"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("OFFICIAL", W / 2, 487); ctx.fillText("SEAL", W / 2, 500);

    // Platform (right)
    ctx.fillStyle = "#0F172A"; ctx.font = "italic bold 15px Georgia,serif"; ctx.textAlign = "right";
    ctx.fillText("SignLearn AI Platform", W - 90, 498);
    ctx.fillStyle = "#64748B"; ctx.font = "10px sans-serif";
    ctx.fillText("Powered by Infosys Springboard", W - 90, 514);

    // Footer
    ctx.fillStyle = "#CBD5E1"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Issued digitally by SignLearn AI \u00B7 github.com/springboardmentor15742s-oss/Team_4_Sign_Language_AI", W / 2, 566);
  }, [cert, userName]);

  useEffect(() => { drawCert(); }, [drawCert]);

  const download = () => {
    const link = document.createElement("a");
    const safeTitle = (cert.title || "Course").replace(/\s+/g, "_");
    link.download = safeTitle + "_Certificate.png";
    link.href = canvasRef.current.toDataURL("image/png", 1.0);
    link.click();
  };

  const courseColor = cert.color || "#0284C7";

  return (
    <div className="anim-fade-in" style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(10,15,28,0.88)", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 20, backdropFilter: "blur(12px)"
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="anim-scale-in" style={{
        background: T.card, borderRadius: 24, maxWidth: 740,
        width: "100%", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.55)"
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${courseColor}, #7C3AED)`,
          padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <GraduationCap size={20} color="white" />
            <p style={{ fontSize: 15, fontWeight: 800, color: "white", margin: 0 }}>Certificate of Completion</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 10,
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <X size={15} color="white" />
          </button>
        </div>
        <div style={{ padding: 16, background: "#F1F5F9", overflowX: "auto" }}>
          <canvas ref={canvasRef} style={{
            borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
            maxWidth: "100%", display: "block", margin: "0 auto"
          }} />
        </div>
        <div style={{ padding: "14px 20px", display: "flex", gap: 10, borderTop: "1px solid " + T.border }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: 12,
            border: "1px solid " + T.border, background: T.soft, fontSize: 12, fontWeight: 700,
            color: T.muted, cursor: "pointer"
          }}>Close</button>
          <button onClick={download} style={{
            flex: 2, padding: "11px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${courseColor}, #7C3AED)`,
            fontSize: 12, fontWeight: 800, color: "white", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: `0 6px 18px ${courseColor}55`
          }}>
            <Download size={15} /> Download Certificate (.PNG)
          </button>
        </div>
      </div>
    </div>
  );
}
