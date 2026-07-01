"use client";

import React, { useState } from "react";
import { LineChart, BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Activity, Droplet, DollarSign, Sprout } from "lucide-react";

export default function AnalyticsSimulators() {
  // Yield Simulator State
  const [sizeAcres, setSizeAcres] = useState(2.5);
  const [fertilizerEfficiency, setFertilizerEfficiency] = useState(80);
  const [hasDisease, setHasDisease] = useState(false);

  // Water Simulator State
  const [irrigationType, setIrrigationType] = useState("Drip");

  // Expense Simulator State
  const [seedCost, setSeedCost] = useState(4000);
  const [fertCost, setFertCost] = useState(6500);
  const [laborCost, setLaborCost] = useState(8000);
  const [pestCost, setPestCost] = useState(2500);

  // Calculations
  const baseYieldPerAcre = 12.5; // tons
  const diseaseImpact = hasDisease ? 0.65 : 1.0;
  const fertilizerMultiplier = fertilizerEfficiency / 100;
  const projectedYield = (sizeAcres * baseYieldPerAcre * fertilizerMultiplier * diseaseImpact).toFixed(1);
  const projectedRevenue = Math.round(Number(projectedYield) * 10 * 2200); // 10q per ton * 2200 Rs/q

  // Water Calculations
  const waterUsagePerDay = irrigationType === "Drip" 
    ? sizeAcres * 2100 // 2100 liters per acre for drip
    : sizeAcres * 6000; // 6000 liters per acre for flood
  const waterSavings = irrigationType === "Drip" 
    ? (sizeAcres * 6000) - (sizeAcres * 2100)
    : 0;

  // Expense Calculations
  const totalExpenses = seedCost + fertCost + laborCost + pestCost;
  const netProfit = projectedRevenue - totalExpenses;

  const expenseData = [
    { name: "Seeds", value: seedCost, color: "#0f766e" },
    { name: "Fertilizer", value: fertCost, color: "#0d9488" },
    { name: "Labor", value: laborCost, color: "#0284c7" },
    { name: "Pesticides", value: pestCost, color: "#38bdf8" }
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Farm Simulators</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Model farm yields, water consumption, and expense margins interactively.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Simulator */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Sprout className="text-teal-600" /> Yield & Revenue Simulator
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-gray-500">
                <span>Farm Size (Acres)</span>
                <span>{sizeAcres} Acres</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={sizeAcres}
                onChange={(e) => setSizeAcres(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-gray-500">
                <span>Fertilizer Efficiency (%)</span>
                <span>{fertilizerEfficiency}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={fertilizerEfficiency}
                onChange={(e) => setFertilizerEfficiency(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-white/30 dark:bg-slate-900/30">
              <div>
                <p className="font-semibold text-sm">Active Leaf Blight Infection</p>
                <p className="text-[10px] text-gray-400">Simulates a 35% yield reduction due to early blight.</p>
              </div>
              <input
                type="checkbox"
                checked={hasDisease}
                onChange={(e) => setHasDisease(e.target.checked)}
                className="w-5 h-5 accent-red-600 cursor-pointer"
              />
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-[10px] text-gray-400 font-bold uppercase">PROJECTED YIELD</p>
                <p className="text-xl font-bold mt-1 text-teal-600 dark:text-teal-400">{projectedYield} Tons</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-[10px] text-gray-400 font-bold uppercase">EST. REVENUE</p>
                <p className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">₹{projectedRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Water Simulator */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Droplet className="text-sky-600" /> Water Usage Simulator
          </h3>
          <div className="space-y-6 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-gray-500">Irrigation System Type</label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="Drip">Drip Irrigation (Efficient)</option>
                <option value="Flood">Flood Irrigation (Traditional)</option>
              </select>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">Projected Daily Water Draw</p>
                  <p className="text-[10px] text-gray-400">Estimated liters pumped from water source per day.</p>
                </div>
                <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{waterUsagePerDay.toLocaleString()} Liters</p>
              </div>

              {irrigationType === "Drip" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400">
                  <p className="text-[10px] font-bold uppercase tracking-wider">RESOURCE SAVINGS</p>
                  <p className="text-sm font-semibold mt-1">Drip irrigation is saving {waterSavings.toLocaleString()} Liters of water per day compared to flood irrigation!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expense Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4 h-fit">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <DollarSign className="text-teal-600" /> Expense Allocation
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-500">Seed Purchase (₹)</label>
              <input
                type="number"
                value={seedCost}
                onChange={(e) => setSeedCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-500">Fertilizer Inputs (₹)</label>
              <input
                type="number"
                value={fertCost}
                onChange={(e) => setFertCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-500">Labor & Power (₹)</label>
              <input
                type="number"
                value={laborCost}
                onChange={(e) => setLaborCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-500">Pesticides & Treatment (₹)</label>
              <input
                type="number"
                value={pestCost}
                onChange={(e) => setPestCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Expense Breakdown Chart */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Cost Breakdown & Net Return</h3>
              <p className="text-xs text-gray-500">Breakdown of farm expenses relative to simulated net profits.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">ESTIMATED NET PROFIT</p>
              <p className={`text-lg font-extrabold ${netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                ₹{netProfit.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
