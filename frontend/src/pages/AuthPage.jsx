import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const T = {
  bg: "#f7f8fa",
  card: "#ffffff",
  border: "#dfe3e8",
  primary: "#1f6f62",
  primaryDark: "#164d45",
  text: "#17202a",
  muted: "#66717d",
  soft: "#f1f4f6",
  danger: "#b42318",
};

const ROLES = [
  { key: "LEARNER", label: "Learner", desc: "Practice lessons and review progress" },
  { key: "INSTRUCTOR", label: "Instructor", desc: "Create lessons and monitor learners" },
];

const GOALS = [
  "Learn ASL alphabet",
  "Practice everyday conversation signs",
  "Build workplace vocabulary",
  "Prepare for certification",
  "Teach sign language basics",
];

function Field({ icon: Icon, label, type = "text", value, onChange, placeholder, right }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{label}</span>
      <span style={{ position: "relative", display: "block" }}>
        <Icon
          size={16}
          aria-hidden="true"
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.muted }}
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            minHeight: 42,
            padding: right ? "10px 42px 10px 38px" : "10px 12px 10px 38px",
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            background: T.card,
            color: T.text,
            fontSize: 14,
            outlineColor: T.primary,
          }}
        />
        {right && (
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
            {right}
          </span>
        )}
      </span>
    </label>
  );
}

export default function AuthPage({ onLoginSuccess }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("ankurbiswal1968@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPw, setShowPw] = useState(false);
  const [fullName, setFullName] = useState("Ankur Biswal");
  const [selectedRole, setRole] = useState("LEARNER");
  const [level, setLevel] = useState("Beginner");
  const [goals, setGoals] = useState(["Learn ASL alphabet", "Practice everyday conversation signs"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleGoal = (goal) => {
    setGoals((current) => (current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          fullName,
          email,
          password,
          role: selectedRole,
          learningLevel: level,
          learningGoals: goals,
        });
      }
      onLoginSuccess?.();
    } catch (err) {
      setError(err?.message || "Could not continue. Please check the form and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        display: "grid",
        placeItems: "center",
        padding: "32px 16px",
      }}
    >
      <div className="auth-shell" style={{ width: "100%", maxWidth: 940, display: "grid", gridTemplateColumns: "1fr 440px", gap: 28 }}>
        <section
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: 32,
            minHeight: 480,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 16px 42px rgba(23,32,42,0.06)",
          }}
        >
          <div>
            <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 800, color: T.primary }}>
              Sign language learning
            </p>
            <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.05, color: T.text, letterSpacing: 0 }}>
              Practice and review sign language skills.
            </h1>
            <p style={{ margin: "18px 0 0", maxWidth: 520, color: T.muted, lineHeight: 1.7, fontSize: 15 }}>
              Continue lessons, review recent attempts, and track accuracy across alphabet and everyday signs.
            </p>
          </div>

          <div style={{ display: "grid", gap: 12, marginTop: 36 }}>
            {[
              ["Current module", "ASL alphabet basics"],
              ["Practice mode", "Webcam gesture review"],
              ["Progress view", "Accuracy and lesson completion"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  borderTop: `1px solid ${T.border}`,
                  paddingTop: 12,
                }}
              >
                <span style={{ color: T.muted, fontSize: 13 }}>{label}</span>
                <strong style={{ color: T.text, fontSize: 13, textAlign: "right" }}>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            boxShadow: "0 16px 42px rgba(23,32,42,0.06)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 20, borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", background: T.soft, borderRadius: 8, padding: 4 }}>
              {[
                ["login", "Sign in"],
                ["register", "Create account"],
              ].map(([key, label]) => {
                const active = (key === "login" && isLogin) || (key === "register" && !isLogin);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setIsLogin(key === "login");
                      setError("");
                    }}
                    style={{
                      flex: 1,
                      minHeight: 34,
                      border: 0,
                      borderRadius: 6,
                      background: active ? T.card : "transparent",
                      color: active ? T.text : T.muted,
                      fontSize: 13,
                      fontWeight: 750,
                      cursor: "pointer",
                      boxShadow: active ? "0 1px 4px rgba(23,32,42,0.08)" : "none",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 20, display: "grid", gap: 14 }}>
            {error && (
              <div
                style={{
                  padding: "10px 12px",
                  background: "#fff5f5",
                  border: "1px solid #ffd6d6",
                  borderRadius: 8,
                  color: T.danger,
                  fontSize: 13,
                  fontWeight: 650,
                }}
              >
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <Field icon={User} label="Full name" value={fullName} onChange={setFullName} placeholder="Your name" />
                <div style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Role</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {ROLES.map((role) => {
                      const active = selectedRole === role.key;
                      return (
                        <button
                          key={role.key}
                          type="button"
                          onClick={() => setRole(role.key)}
                          style={{
                            minHeight: 78,
                            padding: 12,
                            borderRadius: 8,
                            border: `1px solid ${active ? T.primary : T.border}`,
                            background: active ? "#edf6f3" : T.card,
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          <strong style={{ display: "block", marginBottom: 4, color: active ? T.primary : T.text, fontSize: 13 }}>
                            {role.label}
                          </strong>
                          <span style={{ color: T.muted, fontSize: 11, lineHeight: 1.35 }}>{role.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field
              icon={Lock}
              label="Password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder={isLogin ? "Enter password" : "Create a password"}
              right={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  style={{ border: 0, background: "transparent", color: T.muted, display: "flex", cursor: "pointer" }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {!isLogin && (
              <>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Learning level</span>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{
                      minHeight: 42,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.card,
                      color: T.text,
                      padding: "0 10px",
                      outlineColor: T.primary,
                    }}
                  >
                    {["Beginner", "Intermediate", "Advanced"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <div style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Learning goals</span>
                  <div style={{ display: "grid", gap: 6 }}>
                    {GOALS.map((goal) => {
                      const checked = goals.includes(goal);
                      return (
                        <label
                          key={goal}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                            padding: "8px 10px",
                            border: `1px solid ${checked ? "#bed8d1" : T.border}`,
                            borderRadius: 8,
                            background: checked ? "#edf6f3" : T.card,
                            color: T.text,
                            fontSize: 12,
                            fontWeight: 650,
                          }}
                        >
                          <input type="checkbox" checked={checked} onChange={() => toggleGoal(goal)} />
                          {goal}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                minHeight: 44,
                marginTop: 4,
                border: `1px solid ${T.primary}`,
                borderRadius: 8,
                background: T.primary,
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </button>

            {isLogin && (
              <p style={{ margin: 0, textAlign: "center", fontSize: 12, color: T.muted }}>
                Demo account is prefilled for review.
              </p>
            )}
          </form>
        </section>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .auth-shell {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
