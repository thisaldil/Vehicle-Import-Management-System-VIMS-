import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE } from "../../utils/api";
import { getGoogleClientId } from "../../utils/env";

const Register = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busyLocal, setBusyLocal] = useState(false);
  const [errLocal, setErrLocal] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const GOOGLE_CLIENT_ID = getGoogleClientId();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSuccess = async (response) => {
    try {
      const endpoint = "/auth/google/register";
      const url = endpoint && (endpoint.startsWith("http") || API_BASE === "") ? endpoint : `${API_BASE.replace(/\/$/,"")}${endpoint}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        if (res.status === 409) {
          toast.error("User already exists. Try logging in.");
        } else {
          toast.error(msg.message || "Registration failed. Please try again.");
        }
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || data?.error || "Registration failed";
        toast.error(msg);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data.userId) localStorage.setItem("userId", data.userId);

      toast.success("Registration successful! Welcome to VIMS!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Registration Error:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error(
          "Connection error. Please check your internet and try again."
        );
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleError = (error) => {
    console.error("Google OAuth Error:", error);
    toast.error("Google authentication failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrLocal("");
    if (!name || !email || !password) {
      setErrLocal("Name, email and password are required");
      return;
    }
    if (password.length < 6) {
      setErrLocal("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setErrLocal("Passwords do not match");
      return;
    }
    try {
      setBusyLocal(true);
      const endpoint = "/auth/register";
      const url = endpoint && (endpoint.startsWith("http") || API_BASE === "") ? endpoint : `${API_BASE.replace(/\/$/,"")}${endpoint}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch (_) {
        const txt = await res.text().catch(() => "");
        data = { message: txt };
      }
      if (!res.ok) {
        const msg = data?.message || data?.error || "Registration failed";
        setErrLocal(msg);
        setBusyLocal(false);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data.userId) localStorage.setItem("userId", data.userId);

      toast.success("Registration successful! Redirecting...");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Register error:", err);
      setErrLocal("Network error");
    } finally {
      setBusyLocal(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex min-h-screen">
          {/* Left Panel - Brand */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-lg"
            >
              {/* Logo */}
              <div className="mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">V</span>
                  </div>
                  <span className="text-2xl font-bold text-white">VIMS</span>
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Join the Future of Vehicle Imports
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Get started with VIMS today. Manage shipments, customs, RMV, and invoices with confidence. Free for 14 days.
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  { title: 'No Credit Card Required', desc: 'Start free for 14 days' },
                  { title: 'Premium Support', desc: 'Get help when you need it' },
                  { title: 'Advanced Analytics', desc: 'Track your business growth' },
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-5 h-5 rounded-full bg-secondary-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-secondary-400"></div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{benefit.title}</h3>
                      <p className="text-slate-400 text-sm">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Register Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md mx-auto"
            >
              {/* Card */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 sm:p-10 shadow-2xl">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-slate-300">Join VIMS in just a few steps</p>
                </div>

                {/* Google Sign Up */}
                <div className="mb-6">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="filled_white"
                    size="large"
                    text="signup_with"
                  />
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900/50 text-slate-400 backdrop-blur">or with email</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
                    <div className={`relative group transition-all duration-300 ${
                      focusedField === 'name' ? 'ring-2 ring-secondary-400/50' : ''
                    }`}>
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-secondary-400 transition" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-secondary-400/50 transition backdrop-blur-sm"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                    <div className={`relative group transition-all duration-300 ${
                      focusedField === 'email' ? 'ring-2 ring-secondary-400/50' : ''
                    }`}>
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-secondary-400 transition" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-secondary-400/50 transition backdrop-blur-sm"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                    <div className={`relative group transition-all duration-300 ${
                      focusedField === 'password' ? 'ring-2 ring-secondary-400/50' : ''
                    }`}>
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-secondary-400 transition" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-secondary-400/50 transition backdrop-blur-sm"
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
                    <div className={`relative group transition-all duration-300 ${
                      focusedField === 'confirmPassword' ? 'ring-2 ring-secondary-400/50' : ''
                    }`}>
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-secondary-400 transition" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-secondary-400/50 transition backdrop-blur-sm"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {errLocal && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                      {errLocal}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={busyLocal}
                    className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {busyLocal ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="pt-6 border-t border-white/10 text-center">
                  <p className="text-slate-300 text-sm">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-secondary-400 hover:text-secondary-300 transition"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>

              {/* Footer Text */}
              <p className="text-center text-slate-400 text-xs mt-8">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
