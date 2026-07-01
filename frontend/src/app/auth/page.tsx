"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Bot, Lock, Mail, User } from "lucide-react";

export default function Authentication() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("farmer@agriguardian.com");
  const [password, setPassword] = useState("farmer123");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const path = isLogin ? "/api/v1/auth/token" : "/api/v1/auth/register";
    const body = isLogin 
      ? new URLSearchParams({ username: email, password: password }) 
      : JSON.stringify({ email, password, full_name: fullName });

    const headers = isLogin 
      ? { "Content-Type": "application/x-www-form-urlencoded" } 
      : { "Content-Type": "application/json" };

    fetch(path, {
      method: "POST",
      headers: headers,
      body: body
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Authentication failed");
        }
        return res.json();
      })
      .then(async (data) => {
        if (isLogin) {
          // Save the JWT token
          localStorage.setItem("token", data.access_token);

          // Fetch real user profile
          const meRes = await fetch("/api/v1/auth/me", {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            const name = meData.full_name || meData.email;
            const initials = name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            localStorage.setItem(
              "user",
              JSON.stringify({ name, email: meData.email, initials })
            );
          }

          // Redirect to dashboard
          router.push("/dashboard");
        } else {
          // Registration success — switch to login view
          setIsLogin(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="relative min-h-screen bg-[#070a13] text-white flex items-center justify-center font-sans p-6 overflow-hidden">
      {/* Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-teal-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-sky-950/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl space-y-6 z-10 relative">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 font-bold text-white mb-2">
            A
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? "Enter your credentials to access the Swarm OS" : "Register to start autonomous farm monitoring"}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rajesh Kumar"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@agriguardian.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 font-semibold text-sm text-white shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? "Sign In" : "Register"} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-teal-400 hover:underline font-medium"
          >
            {isLogin ? "Need an account? Register here" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
