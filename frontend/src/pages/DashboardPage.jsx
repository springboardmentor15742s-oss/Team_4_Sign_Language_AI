import React from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock3,
  History,
  ListChecks,
  Target,
  Zap,
} from "lucide-react";

const C = {
  bg: "#f7f8fa",
  card: "#ffffff",
  border: "#dfe3e8",
  primary: "#1f6f62",
  primaryDark: "#164d45",
  text: "#17202a",
  muted: "#66717d",
  soft: "#f1f4f6",
  warning: "#a15c16",
  danger: "#b42318",
};

const recentAttempts = [
  { sign: "HELLO", result: "Good", accuracy: "82%", time: "Today, 10:20 AM", note: "Review wrist angle" },
  { sign: "A", result: "Passed", accuracy: "88%", time: "Today, 10:12 AM", note: "Consistent hand shape" },
  { sign: "C", result: "Needs review", accuracy: "64%", time: "Yesterday", note: "Keep fingers rounded" },
  { sign: "THANK YOU", result: "Good", accuracy: "79%", time: "Yesterday", note: "Practice motion speed" },
];

const reviewItems = [
  { label: "Letter C", detail: "Hand shape consistency", status: "Needs review" },
  { label: "Thank you", detail: "Motion speed", status: "Practice" },
  { label: "Numbers 1-5", detail: "Short recap", status: "Optional" },
];

const week = [
  ["Mon", 2],
  ["Tue", 3],
  ["Wed", 1],
  ["Thu", 4],
  ["Fri", 2],
  ["Sat", 3],
  ["Sun", 0],
];

function Button({ children, onClick, variant = "primary" }) {
  const primary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: 40,
        padding: "9px 14px",
        borderRadius: 8,
        border: `1px solid ${primary ? C.primary : C.border}`,
        background: primary ? C.primary : C.card,
        color: primary ? "#fff" : C.text,
        fontSize: 13,
        fontWeight: 760,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style }) {
  return (
    <section
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        boxShadow: "0 10px 30px rgba(23,32,42,0.05)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, fontSize: 15, color: C.text }}>
        <Icon size={17} color={C.primary} aria-hidden="true" />
        {title}
      </h2>
      {action}
    </div>
  );
}

function ProgressRow({ label, value, detail }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 720, color: C.text }}>{label}</span>
        <span style={{ fontSize: 12, color: C.muted }}>{detail}</span>
      </div>
      <div style={{ height: 7, borderRadius: 999, background: C.soft, overflow: "hidden" }}>
        <div style={{ width: value, height: "100%", borderRadius: 999, background: C.primary }} />
      </div>
    </div>
  );
}

export default function DashboardPage({ onStartPractice, onStartQuiz, onViewHistory }) {
  const maxWeek = Math.max(...week.map(([, value]) => value));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "30px 0 54px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px", display: "grid", gap: 18 }}>
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ margin: "0 0 6px", color: C.primary, fontSize: 13, fontWeight: 800 }}>
              Learning dashboard
            </p>
            <h1 style={{ margin: 0, color: C.text, fontSize: 32, lineHeight: 1.15, letterSpacing: 0 }}>
              Continue your lessons and review recent attempts.
            </h1>
            <p style={{ margin: "10px 0 0", maxWidth: 650, color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
              Focus on the next practice set, check what needs review, and keep progress visible without the noise.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button onClick={onStartPractice}>
              <Camera size={16} aria-hidden="true" />
              Start practice
            </Button>
            <Button onClick={onStartQuiz} variant="secondary">
              <Zap size={16} aria-hidden="true" />
              Quick quiz
            </Button>
          </div>
        </header>

        <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 16 }}>
          <Card style={{ padding: 24 }}>
            <SectionTitle icon={BookOpen} title="Current module" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
              <div>
                <p style={{ margin: "0 0 8px", color: C.muted, fontSize: 13, fontWeight: 720 }}>ASL alphabet basics</p>
                <h2 style={{ margin: 0, color: C.text, fontSize: 26, lineHeight: 1.15 }}>
                  Review letters A-C with camera feedback
                </h2>
                <p style={{ margin: "12px 0 0", color: C.muted, lineHeight: 1.65, fontSize: 14 }}>
                  Practice the hand shapes that appeared in recent attempts. The next session should prioritize
                  Letter C before moving back into phrases.
                </p>
              </div>
              <div
                style={{
                  minWidth: 150,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.soft,
                  padding: 14,
                }}
              >
                <span style={{ display: "block", color: C.muted, fontSize: 12, marginBottom: 6 }}>Last practiced</span>
                <strong style={{ color: C.text, fontSize: 18 }}>Today</strong>
                <span style={{ display: "block", color: C.muted, fontSize: 12, marginTop: 4 }}>10:20 AM</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
              <Button onClick={onStartPractice}>
                Practice this module <ArrowRight size={15} aria-hidden="true" />
              </Button>
              <Button onClick={onViewHistory} variant="secondary">
                <History size={15} aria-hidden="true" />
                View history
              </Button>
            </div>
          </Card>

          <Card style={{ padding: 22 }}>
            <SectionTitle icon={Target} title="Progress summary" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[
                ["Lessons completed", "7 of 12"],
                ["Needs review", "3 signs"],
                ["Current streak", "4 days"],
                ["Practice time", "18 min today"],
              ].map(([label, value]) => (
                <div key={label} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, background: "#fbfcfd" }}>
                  <strong style={{ display: "block", color: C.text, fontSize: 18, marginBottom: 4 }}>{value}</strong>
                  <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gap: 13 }}>
              <ProgressRow label="Alphabet module" value="58%" detail="7/12 lessons" />
              <ProgressRow label="Everyday signs" value="34%" detail="4/12 lessons" />
              <ProgressRow label="Assessment readiness" value="46%" detail="needs review" />
            </div>
          </Card>
        </div>

        <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "0.75fr 1.25fr", gap: 16 }}>
          <Card style={{ padding: 22 }}>
            <SectionTitle icon={BarChart3} title="Weekly practice" />
            <div style={{ display: "flex", alignItems: "end", gap: 8, height: 142, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
              {week.map(([day, value]) => (
                <div key={day} style={{ flex: 1, display: "grid", gap: 6, justifyItems: "center", alignItems: "end" }}>
                  <span style={{ color: C.muted, fontSize: 11 }}>{value}</span>
                  <div
                    title={`${value} practice sessions`}
                    style={{
                      width: "100%",
                      maxWidth: 30,
                      height: value ? `${Math.max((value / maxWeek) * 90, 18)}px` : 6,
                      borderRadius: "6px 6px 0 0",
                      background: value ? C.primary : C.border,
                    }}
                  />
                  <span style={{ color: C.muted, fontSize: 11, fontWeight: 650 }}>{day}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: "12px 0 0", color: C.muted, fontSize: 13, lineHeight: 1.55 }}>
              Practice is steady, but Sunday has no session logged yet.
            </p>
          </Card>

          <Card style={{ padding: 22 }}>
            <SectionTitle
              icon={Clock3}
              title="Recent attempts"
              action={
                <button
                  onClick={onViewHistory}
                  style={{ border: 0, background: "transparent", color: C.primary, fontSize: 13, fontWeight: 760, cursor: "pointer" }}
                >
                  View all
                </button>
              }
            />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
                <thead>
                  <tr>
                    {["Sign", "Result", "Accuracy", "Time", "Note"].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          textAlign: "left",
                          color: C.muted,
                          fontSize: 12,
                          fontWeight: 760,
                          padding: "0 10px 9px 0",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((attempt) => {
                    const needsReview = attempt.result === "Needs review";
                    return (
                      <tr key={`${attempt.sign}-${attempt.time}`}>
                        <td style={{ padding: "12px 10px 12px 0", color: C.text, fontSize: 13, fontWeight: 750 }}>
                          {attempt.sign}
                        </td>
                        <td style={{ padding: "12px 10px 12px 0" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              borderRadius: 999,
                              padding: "4px 8px",
                              background: needsReview ? "#fff4e8" : "#edf6f3",
                              color: needsReview ? C.warning : C.primaryDark,
                              fontSize: 12,
                              fontWeight: 740,
                            }}
                          >
                            {needsReview ? <ListChecks size={13} /> : <CheckCircle2 size={13} />}
                            {attempt.result}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px 12px 0", color: C.text, fontSize: 13 }}>{attempt.accuracy}</td>
                        <td style={{ padding: "12px 10px 12px 0", color: C.muted, fontSize: 13 }}>{attempt.time}</td>
                        <td style={{ padding: "12px 0", color: C.muted, fontSize: 13 }}>{attempt.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card style={{ padding: 22 }}>
          <SectionTitle icon={ListChecks} title="Review queue" />
          <div className="review-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {reviewItems.map((item) => (
              <article key={item.label} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, background: "#fbfcfd" }}>
                <span style={{ color: C.primary, fontSize: 12, fontWeight: 800 }}>{item.status}</span>
                <h3 style={{ margin: "8px 0 5px", color: C.text, fontSize: 16 }}>{item.label}</h3>
                <p style={{ margin: 0, color: C.muted, fontSize: 13, lineHeight: 1.5 }}>{item.detail}</p>
              </article>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .dashboard-grid,
          .review-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
