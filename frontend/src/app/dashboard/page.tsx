"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  CloudSun, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  ChevronRight, 
  MapPin, 
  Info, 
  DollarSign, 
  Droplet 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from "recharts";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [hasFarm, setHasFarm] = useState<boolean | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const farmRes = await fetch("/api/v1/farms", {
          headers: getAuthHeaders(),
        });
        if (!farmRes.ok) throw new Error("Farms fetch failed");
        const farms = await farmRes.json();
        
        if (farms.length === 0) {
          setHasFarm(false);
          setLoading(false);
          return;
        }

        setHasFarm(true);
        const firstFarm = farms[0];

        const analyticsRes = await fetch(`/api/v1/analytics?farm_id=${firstFarm.id}`, {
          headers: getAuthHeaders(),
        });
        if (!analyticsRes.ok) throw new Error("Analytics fetch failed");
        const analyticsData = await analyticsRes.json();
        setData(analyticsData);
      } catch (err) {
        console.error("Dashboard initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 dark:text-slate-400">Synthesizing swarm intelligence...</p>
      </div>
    );
  }

  if (hasFarm === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center max-w-md mx-auto">
        <div className="p-4 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <MapPin size={48} className="animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome to AgriGuardian Swarm!</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
            To activate autonomous swarm monitoring, please register your farm and crop fields in the system.
          </p>
        </div>
        <a
          href="/farm-overview"
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 font-semibold text-sm text-white shadow-lg shadow-teal-600/15 transition-all"
        >
          Register Your Farm
        </a>
      </div>
    );
  }

  // Bind dynamic data from backend
  const healthScore: number | null = data?.crop_health_score ?? null;
  const hasScanData: boolean = data?.has_scan_data ?? false;
  const sustainabilityScore: number | null = data?.sustainability_score ?? null;
  const carbonFootprint: number | null = data?.carbon_footprint_kg_co2 ?? null;
  const waterEfficiency: number = data?.water_efficiency_pct ?? 50;
  const latestDiagnosis = data?.latest_diagnosis ?? null;

  const yieldData = data?.yield_forecast ?? [];
  const healthTrend = data?.health_trend ?? [];
  const timelineEvents = data?.timeline_events ?? [];

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farm Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Real-time agricultural telemetry & agent diagnostics.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Swarm Monitoring Active
        </div>
      </div>

      {/* Top Recommendations Feed */}
      <div className={`glass-panel p-6 rounded-2xl border-l-4 ${
        latestDiagnosis ? "border-amber-500" : "border-teal-500"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-xl ${
            latestDiagnosis ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
          }`}>
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base">
              {latestDiagnosis ? "Today's AI Recommendation" : "All Systems Nominal"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              {latestDiagnosis ? (
                <>
                  <b>{latestDiagnosis.disease_name}</b> detected in crop (severity: {Math.round(latestDiagnosis.severity_score * 100)}%). {latestDiagnosis.treatment_plan.split('\n')[0]}
                </>
              ) : hasScanData ? (
                "No crop diseases or pest infestations detected. Continue standard monitoring. Perform scans via the Image Scanner to check plant health."
              ) : (
                "No crop scans uploaded yet. Go to the Image Scanner and upload a photo of your crop leaf to activate disease detection and health tracking."
              )}
            </p>
            <div className="flex gap-4 pt-2">
              <span className={`text-xs font-semibold ${latestDiagnosis ? "text-amber-600 dark:text-amber-400" : "text-emerald-600"}`}>
                Priority: {latestDiagnosis ? "High" : "Low"}
              </span>
              <span className="text-xs text-gray-400">
                Agent Source: {latestDiagnosis ? "Vision + Risk Agent" : "Coordinator Agent"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Meters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Crop Health Meter */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Crop Health</span>
            <Activity className={healthScore !== null ? "text-emerald-500" : "text-gray-400"} size={20} />
          </div>
          <div className="py-4 text-center">
            {healthScore !== null ? (
              <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">{healthScore}%</span>
            ) : (
              <span className="text-2xl font-bold text-gray-400 dark:text-slate-500">No Data</span>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {healthScore !== null ? "Based on latest scan" : "Upload a crop scan to measure"}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div style={{ width: healthScore !== null ? `${healthScore}%` : "0%" }} className="bg-emerald-500 h-full rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Disease Risk Meter */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Disease Risk</span>
            <AlertTriangle className={latestDiagnosis ? "text-red-500 animate-pulse" : hasScanData ? "text-emerald-500" : "text-gray-400"} size={20} />
          </div>
          <div className="py-4 text-center">
            {hasScanData ? (
              <span className={`text-4xl font-extrabold ${latestDiagnosis ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {latestDiagnosis ? (latestDiagnosis.severity_score > 0.7 ? "High" : "Medium") : "Low"}
              </span>
            ) : (
              <span className="text-2xl font-bold text-gray-400 dark:text-slate-500">No Data</span>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {latestDiagnosis ? `${latestDiagnosis.disease_name} active (${Math.round(latestDiagnosis.severity_score * 100)}% severity)` : hasScanData ? "All crops safe & clear" : "Scan a crop to detect disease"}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div style={{ width: latestDiagnosis ? `${latestDiagnosis.severity_score * 100}%` : "0%" }} className={`h-full rounded-full ${latestDiagnosis ? "bg-red-500" : "bg-emerald-500"}`}></div>
          </div>
        </div>

        {/* Water Efficiency */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Water Efficiency</span>
            <Droplet className="text-sky-500" size={20} />
          </div>
          <div className="py-4 text-center">
            <span className="text-4xl font-extrabold text-sky-600 dark:text-sky-400">{waterEfficiency}%</span>
            <p className="text-xs text-gray-400 mt-1">Saved 30,000L this month</p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div style={{ width: `${waterEfficiency}%` }} className="bg-sky-500 h-full rounded-full"></div>
          </div>
        </div>

        {/* Sustainability Score */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Eco Score</span>
            <CheckCircle className={sustainabilityScore !== null ? "text-teal-500" : "text-gray-400"} size={20} />
          </div>
          <div className="py-4 text-center">
            {sustainabilityScore !== null ? (
              <span className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">{sustainabilityScore}/100</span>
            ) : (
              <span className="text-2xl font-bold text-gray-400 dark:text-slate-500">No Data</span>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {carbonFootprint !== null ? `Carbon: ${carbonFootprint} kg CO₂` : "No eco metrics yet"}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div style={{ width: `${sustainabilityScore}%` }} className="bg-teal-500 h-full rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yield Forecast Chart */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Yield Forecast (Tons)</h3>
              <p className="text-xs text-gray-500">Comparing AI predictions with actual harvest weights.</p>
            </div>
            <TrendingUp className="text-teal-500" size={20} />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="predicted" name="AI Predicted" stroke="#0f766e" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
                <Area type="monotone" dataKey="actual" name="Actual Harvest" stroke="#0284c7" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini-Weather Widget & Map */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Weather Outlook</h3>
              <CloudSun className="text-sky-500" size={20} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-border">
              <div>
                <p className="text-2xl font-bold">32°C</p>
                <p className="text-xs text-gray-500">Bareilly, UP</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Partly Cloudy</p>
                <p className="text-xs text-gray-500">Rain Prob: 20%</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 border border-border rounded-xl overflow-hidden h-32 relative bg-slate-200 dark:bg-slate-900 flex items-center justify-center">
            {/* Mock Satellite Map */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="relative text-center text-white p-2">
              <MapPin size={16} className="mx-auto text-teal-400 animate-bounce" />
              <span className="text-[10px] font-semibold tracking-wider uppercase">Field A (2.5 Acres)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Pending Action Items</h3>
            <span className="text-xs text-gray-500">3 Tasks</span>
          </div>
          <div className="space-y-3">
            {[
              { title: "Apply Copper Fungicide spray", desc: "Foliar spray across North Field rows.", time: "6:00 AM", cat: "treatment" },
              { title: "Inspect drip lines for clogging", desc: "Check lateral lines in Field A.", time: "8:00 AM", cat: "watering" },
              { title: "Record tomato leaf growth samples", desc: "Upload photo to Vision scanner.", time: "Anytime", cat: "scouting" }
            ].map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border bg-white/40 dark:bg-slate-900/40 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-colors">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.desc}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400">
                  {task.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Farm Timeline */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg">Farm Timeline</h3>
          <div className="relative border-l border-border pl-4 ml-2 space-y-6">
            {timelineEvents.map((evt: any, idx: number) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[21px] mt-1.5 w-3 h-3 rounded-full bg-teal-600 border border-white dark:border-slate-950"></div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400">{evt.date}</span>
                  <h4 className="text-sm font-semibold mt-0.5">{evt.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
