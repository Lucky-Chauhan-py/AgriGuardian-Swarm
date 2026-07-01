"use client";

import React from "react";
import Link from "next/link";
import { 
  Sprout, 
  Bot, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  ArrowRight, 
  LineChart, 
  CloudRain, 
  Users 
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen bg-[#070a13] text-white overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-teal-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-sky-950/20 blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50 bg-[#070a13]/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-600 font-bold text-white shadow-lg shadow-teal-500/20">
            A
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
            AgriGuardian Swarm
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth" className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 font-medium text-sm transition-all duration-300 shadow-lg shadow-teal-600/10 hover:shadow-teal-500/25 flex items-center gap-2">
            Enter Platform <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-20 text-center max-w-5xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Tagline */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Cpu size={14} className="animate-spin-slow" />
            Autonomous Multi-Agent AI OS for Agriculture
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            The Autonomous Swarm <br/>
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
              Protecting Your Crops & Yield
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light"
          >
            Instead of waiting for commands, 12 specialized AI agents continuously collaborate. 
            They monitor soil, forecast weather risks, predict market prices, and diagnose crop health automatically.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link href="/auth" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 font-semibold text-sm hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 flex items-center justify-center gap-2 text-[#070a13]">
              Launch Farm Dashboard <ArrowRight size={18} />
            </Link>
            <Link href="/auth" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 font-semibold text-sm hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2">
              <Bot size={18} className="text-teal-400" /> Speak with the Swarm
            </Link>
          </motion.div>
        </motion.div>

        {/* Dynamic Swarm Preview Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 md:mt-20 p-4 rounded-2xl border border-slate-800 bg-slate-950/40 backdrop-blur-xl relative"
        >
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
          <div className="p-8 md:p-12 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl min-h-[300px] bg-gradient-to-b from-slate-900/50 to-transparent">
            {/* Swarm Node Cluster Diagram */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Center Coordinator Node */}
              <div className="absolute w-20 h-20 rounded-2xl bg-teal-500/20 border border-teal-400/50 flex flex-col items-center justify-center text-teal-300 shadow-2xl shadow-teal-500/40 z-10 animate-pulse">
                <Cpu size={28} />
                <span className="text-[9px] font-semibold uppercase mt-1">Coordinator</span>
              </div>
              
              {/* Orbiting Agent Nodes */}
              {[
                { label: "Vision", angle: 0, icon: Sprout, color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" },
                { label: "Weather", angle: 60, icon: CloudRain, color: "border-blue-500/30 text-blue-400 bg-blue-500/5" },
                { label: "Market", angle: 120, icon: LineChart, color: "border-yellow-500/30 text-yellow-400 bg-yellow-500/5" },
                { label: "Gov", angle: 180, icon: Users, color: "border-purple-500/30 text-purple-400 bg-purple-500/5" },
                { label: "Risk", angle: 240, icon: ShieldCheck, color: "border-red-500/30 text-red-400 bg-red-500/5" },
                { label: "Memory", angle: 300, icon: Zap, color: "border-sky-500/30 text-sky-400 bg-sky-500/5" }
              ].map((node, i) => {
                const radius = 110; // Radius of orbit
                const x = radius * Math.cos((node.angle * Math.PI) / 180);
                const y = radius * Math.sin((node.angle * Math.PI) / 180);
                const IconNode = node.icon;
                return (
                  <div
                    key={i}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className={`absolute w-12 h-12 rounded-xl border ${node.color} flex flex-col items-center justify-center shadow-lg`}
                  >
                    <IconNode size={16} />
                    <span className="text-[7px] font-medium mt-0.5">{node.label}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-6 font-light">Interactive visualization of multi-agent token passing and reflection.</p>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto relative z-10 border-t border-slate-900">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-display text-3xl font-bold">12 Agent Modules working as One System</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm font-light">Every module specializes in a specific domain and communicates via the coordinator.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Computer Vision Diagnosis",
              desc: "Upload leaves or soil photographs. The Vision Agent detects pests, blights, and deficiencies with 94% accuracy, outputting severity scores.",
              icon: Sprout,
              color: "text-emerald-400 bg-emerald-500/10"
            },
            {
              title: "Agrometeorological Intel",
              desc: "Aggregates localized weather metrics to warn about frost, heatwave spikes, or downpours, offering custom irrigation windows.",
              icon: CloudRain,
              color: "text-blue-400 bg-blue-500/10"
            },
            {
              title: "Mandi Price Forecasting",
              desc: "Collects regional market listings. Predicts selling windows and projects profits to make sure you sell at peak prices.",
              icon: LineChart,
              color: "text-yellow-400 bg-yellow-500/10"
            }
          ].map((feat, idx) => {
            const FeatIcon = feat.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl border border-slate-900 bg-slate-950/30 backdrop-blur-md space-y-4 hover:border-slate-800 transition-colors duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color}`}>
                  <FeatIcon size={24} />
                </div>
                <h3 className="font-display font-semibold text-lg">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-xs">
        <p>© 2026 AgriGuardian Swarm. Built for the Google × Kaggle AI Agents Capstone.</p>
      </footer>
    </div>
  );
}
