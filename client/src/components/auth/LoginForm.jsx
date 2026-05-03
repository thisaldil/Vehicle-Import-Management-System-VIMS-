import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import { buildUrl } from "../../utils/api";

const LoginForm = ({
  action = "/auth/login",
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) {
      setErr("Email and password are required");
      return;
    }
    try {
      setBusy(true);
      const url = buildUrl(action);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const raw = await res.text();
      let data = {};
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          data = { message: raw };
        }
      }

      if (!res.ok) {
        const message =
          data?.message ||
          data?.error ||
          data?.msg ||
          (raw ? String(raw).slice(0, 300) : "") ||
          `Login failed (HTTP ${res.status})`;
        setErr(message);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data.userId) localStorage.setItem("userId", data.userId);
      if (data.user && (data.user.id || data.user._id)) {
        localStorage.setItem("userId", data.user.id || data.user._id);
      }

      console.log("Login successful, token stored:", data.token);

      if (onSuccess) onSuccess(data);

      navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr("Network error");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
        <div className={`relative group transition-all duration-300 ${
          emailFocused ? 'ring-2 ring-primary-400/50' : ''
        }`}>
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-400 transition" />
          <input
            type="email"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary-400/50 transition backdrop-blur-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
        <div className={`relative group transition-all duration-300 ${
          passwordFocused ? 'ring-2 ring-primary-400/50' : ''
        }`}>
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-400 transition" />
          <input
            type="password"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary-400/50 transition backdrop-blur-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
      </div>

      {/* Error Message */}
      {err && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {err}
        </div>
      )}

      {/* Forgot Password Link */}
      <div className="text-right">
        <a
          href="#forgot"
          className="text-sm text-slate-400 hover:text-primary-400 transition font-medium"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {busy ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
