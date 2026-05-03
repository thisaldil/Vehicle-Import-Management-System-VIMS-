import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Mail, Lock, Zap, Shield, BarChart3 } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";
import LoginGoogle from "../../components/auth/GoogleLogin";
import mainLogo from "../../images/mainlogo.png";

/* ─── Animated Mesh Grid Background ─────────────────────────────────────── */
const MeshGrid = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.035]"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e2d9f3" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

/* ─── Floating Orbs ──────────────────────────────────────────────────────── */
const Orbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Primary orb — top-left */}
    <motion.div
      className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
      style={{
        background:
          "radial-gradient(circle at 40% 40%, rgba(139,92,246,0.18) 0%, rgba(79,70,229,0.08) 50%, transparent 70%)",
      }}
      animate={{ scale: [1, 1.06, 1], rotate: [0, 8, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Secondary orb — bottom-right */}
    <motion.div
      className="absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full"
      style={{
        background:
          "radial-gradient(circle at 60% 60%, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)",
      }}
      animate={{ scale: [1, 1.08, 1], rotate: [0, -6, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Accent orb — center */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
      }}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

/* ─── Scan line shimmer strip ────────────────────────────────────────────── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] pointer-events-none"
    style={{
      background:
        "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 40%, rgba(99,102,241,0.6) 50%, rgba(139,92,246,0.4) 60%, transparent 100%)",
      top: 0,
    }}
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    aria-hidden="true"
  />
);

/* ─── Feature pill ───────────────────────────────────────────────────────── */
const FeaturePill = ({ icon: Icon, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 bg-white/[0.04] backdrop-blur-sm group hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300"
  >
    <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center group-hover:bg-violet-500/25 transition-colors">
      <Icon className="w-4 h-4 text-violet-400" />
    </div>
    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors font-[var(--font-main)]">
      {label}
    </span>
  </motion.div>
);

/* ─── Stat badge ─────────────────────────────────────────────────────────── */
const StatBadge = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="text-center"
  >
    <p className="text-2xl font-bold text-white tabular-nums tracking-tight">{value}</p>
    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
  </motion.div>
);

/* ════════════════════════════════════════════════════════════════════════════
   MAIN LOGIN COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const headline = "Vehicle Import\nManagement System";

  /* Typewriter effect for headline */
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(headline.slice(0, i + 1));
      i++;
      if (i >= headline.length) clearInterval(interval);
    }, 38);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (data) => console.log("Email login success:", data);
  const handleGoogleSuccess = (data) => console.log("Google login success:", data);

  return (
    <>
      {/* ── Google Font import ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;500;600;700&display=swap');

        :root {
          --font-main: 'Sora', sans-serif;
          --font-mono: 'Space Mono', monospace;
          --violet: #8b5cf6;
          --violet-dim: rgba(139,92,246,0.15);
          --teal: #14b8a6;
          --emerald: #10b981;
        }

        * { box-sizing: border-box; }

        .login-root {
          font-family: var(--font-main);
          min-height: 100svh;
          min-height: 100dvh;
        }

        /* ── Glass card ── */
        .glass-card {
          background: linear-gradient(135deg,
            rgba(255,255,255,0.06) 0%,
            rgba(255,255,255,0.02) 100%);
          border: 0.5px solid rgba(255,255,255,0.10);
          box-shadow:
            0 0 0 0.5px rgba(255,255,255,0.04) inset,
            0 40px 80px rgba(0,0,0,0.5),
            0 8px 32px rgba(139,92,246,0.08);
        }

        /* ── Input overrides inside glass ── */
        .auth-input {
          font-family: var(--font-main) !important;
          background: rgba(255,255,255,0.05) !important;
          border: 0.5px solid rgba(255,255,255,0.12) !important;
          border-radius: 14px !important;
          color: white !important;
          font-size: 14px !important;
          padding: 0 14px !important;
          height: 48px !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
        }
        .auth-input:focus {
          border-color: rgba(139,92,246,0.5) !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12) !important;
          outline: none !important;
        }
        .auth-input::placeholder { color: rgba(148,163,184,0.5) !important; }

        /* ── Submit button ── */
        .auth-btn {
          font-family: var(--font-main) !important;
          width: 100% !important;
          height: 50px !important;
          border-radius: 14px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          letter-spacing: 0.02em !important;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%) !important;
          border: none !important;
          color: white !important;
          cursor: pointer !important;
          transition: opacity 0.2s, transform 0.15s !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .auth-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          border-radius: inherit;
        }
        .auth-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .auth-btn:active { transform: translateY(0) scale(0.99); }

        /* ── Google button ── */
        .google-btn {
          font-family: var(--font-main) !important;
          width: 100% !important;
          height: 48px !important;
          border-radius: 14px !important;
          background: rgba(255,255,255,0.06) !important;
          border: 0.5px solid rgba(255,255,255,0.12) !important;
          color: rgba(255,255,255,0.85) !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: background 0.2s, border-color 0.2s !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
        }
        .google-btn:hover {
          background: rgba(255,255,255,0.10) !important;
          border-color: rgba(255,255,255,0.2) !important;
        }

        /* ── Headline typewriter ── */
        .headline {
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: white;
          white-space: pre-line;
        }
        .headline-accent {
          background: linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Cursor blink ── */
        .cursor::after {
          content: '|';
          animation: blink 0.75s step-end infinite;
          color: #a78bfa;
          font-weight: 300;
        }
        @keyframes blink { 0%,100%{ opacity: 1 } 50%{ opacity: 0 } }

        /* ── Mono tag ── */
        .mono-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(167,139,250,0.7);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── Divider label ── */
        .divider-text {
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(148,163,184,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0 12px;
          background: transparent;
        }

        /* ── Link ── */
        .signup-link {
          color: #a78bfa;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s, color 0.2s;
        }
        .signup-link:hover { gap: 10px; color: #c4b5fd; }

        /* ── Mobile top bar ── */
        .mobile-top {
          display: none;
        }

        /* ── Stats row ── */
        .stats-divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.08);
        }

        /* ── Responsive ── */
        @media (max-width: 1023px) {
          .left-panel { display: none !important; }
          .right-panel {
            width: 100% !important;
            padding: 0 !important;
          }
          .login-root {
            background: linear-gradient(160deg, #0b0b1a 0%, #0d0d20 50%, #0a0a14 100%);
          }
          .mobile-top {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 40px 24px 0;
          }
          .mobile-logo { height: 56px; width: auto; object-fit: contain; }
          .mobile-title {
            font-family: var(--font-main);
            font-size: 18px;
            font-weight: 700;
            color: white;
            letter-spacing: -0.02em;
            text-align: center;
            margin: 0;
          }
          .mobile-subtitle {
            font-family: var(--font-mono);
            font-size: 10px;
            color: rgba(167,139,250,0.6);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            text-align: center;
            margin: 0;
          }
          .card-wrapper {
            padding: 20px 16px 32px !important;
          }
          .glass-card {
            border-radius: 24px !important;
            padding: 28px 22px !important;
          }
        }

        @media (min-width: 480px) and (max-width: 1023px) {
          .card-wrapper {
            padding: 32px 32px 48px !important;
          }
          .glass-card {
            border-radius: 28px !important;
            padding: 36px 32px !important;
          }
        }

        /* Smooth focus ring for accessibility */
        *:focus-visible {
          outline: 2px solid rgba(139,92,246,0.7);
          outline-offset: 2px;
        }
      `}</style>

      <div
        className="login-root relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #080812 0%, #0c0c1e 45%, #080814 100%)",
        }}
      >
        <MeshGrid />
        <Orbs />
        <ScanLine />

        <div className="relative z-10 flex min-h-screen min-h-[100svh]">

          {/* ══════════ LEFT PANEL ══════════ */}
          <div
            className="left-panel hidden lg:flex lg:w-[52%] flex-col justify-between px-12 xl:px-16 py-14"
            style={{ borderRight: "0.5px solid rgba(255,255,255,0.05)" }}
          >
            {/* Logo + mono tag */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-4"
            >
              <img
                src={mainLogo}
                alt="VIMS logo"
                className="h-12 w-auto object-contain"
                style={{ filter: "drop-shadow(0 4px 16px rgba(139,92,246,0.3))" }}
              />
              <div>
                <p className="text-white font-bold text-lg leading-none tracking-tight" style={{ fontFamily: "var(--font-main)" }}>
                  VIMS
                </p>
                <p className="mono-tag">v2.0 · 2030</p>
              </div>
            </motion.div>

            {/* Centre copy */}
            <div className="flex-1 flex flex-col justify-center max-w-xl">
              <motion.p
                className="mono-tag mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                // system.initialize
              </motion.p>

              {/* Animated headline */}
              <h1 className={`headline cursor mb-8`}>
                {typedText.includes("\n") ? (
                  <>
                    {typedText.split("\n")[0]}
                    {"\n"}
                    <span className="headline-accent">{typedText.split("\n")[1]}</span>
                  </>
                ) : (
                  typedText
                )}
              </h1>

              <motion.p
                className="text-base text-slate-400 mb-10 leading-relaxed max-w-sm"
                style={{ fontFamily: "var(--font-main)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.7 }}
              >
                Track shipments, manage customs, handle RMV registration,
                and generate invoices from one unified platform.
              </motion.p>

              {/* Feature pills */}
              <div className="space-y-3">
                <FeaturePill icon={Zap} label="Real-time shipment tracking" delay={1.9} />
                <FeaturePill icon={Shield} label="Customs clearance automation" delay={2.1} />
                <FeaturePill icon={BarChart3} label="Smart invoicing & analytics" delay={2.3} />
              </div>
            </div>

            {/* Stats row */}
            <motion.div
              className="flex items-center gap-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.6 }}
            >
              <StatBadge value="12K+" label="Vehicles tracked" delay={2.6} />
              <div className="stats-divider" />
              <StatBadge value="99.9%" label="Uptime SLA" delay={2.7} />
              <div className="stats-divider" />
              <StatBadge value="48h" label="Avg clearance" delay={2.8} />
            </motion.div>
          </div>

          {/* ══════════ RIGHT PANEL ══════════ */}
          <div className="right-panel w-full lg:w-[48%] flex flex-col justify-center">

            {/* Mobile-only top branding */}
            <div className="mobile-top">
              <img src={mainLogo} alt="VIMS logo" className="mobile-logo" />
              <p className="mobile-title">VIMS</p>
              <p className="mobile-subtitle">Vehicle Import Management</p>
            </div>

            <div className="card-wrapper w-full max-w-[440px] mx-auto px-6 py-12 lg:px-10">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >

                {/* ── Glass Card ── */}
                <div className="glass-card rounded-[28px] p-8 sm:p-10 relative overflow-hidden">

                  {/* Inner shimmer line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.4) 40%, rgba(99,102,241,0.6) 50%, rgba(167,139,250,0.4) 60%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Header */}
                  <div className="mb-7">
                    <motion.p
                      className="mono-tag mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      // auth.login
                    </motion.p>
                    <motion.h2
                      className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                      style={{ fontFamily: "var(--font-main)" }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      Welcome back
                    </motion.h2>
                    <motion.p
                      className="text-sm text-slate-400 mt-1"
                      style={{ fontFamily: "var(--font-main)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Sign in to continue to your dashboard
                    </motion.p>
                  </div>

                  {/* ── Login Form ── */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.5 }}
                  >
                    <LoginForm onSuccess={handleLoginSuccess} />
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    className="relative mb-5 flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                  >
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                    <span className="divider-text">or</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  </motion.div>

                  {/* Google Login */}
                  <motion.div
                    className="mb-7"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 }}
                  >
                    <LoginGoogle onSuccess={handleGoogleSuccess} />
                  </motion.div>

                  {/* Register */}
                  <motion.div
                    className="pt-6 flex flex-col items-center gap-2"
                    style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.95 }}
                  >
                    <p className="text-sm text-slate-500" style={{ fontFamily: "var(--font-main)" }}>
                      Don't have an account?
                    </p>
                    <Link to="/register" className="signup-link group">
                      Create account
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>

                {/* Footer */}
                <motion.p
                  className="text-center mt-6"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "rgba(100,116,139,0.5)",
                    letterSpacing: "0.06em",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.05 }}
                >
                  © 2030 VIMS · All rights reserved
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;