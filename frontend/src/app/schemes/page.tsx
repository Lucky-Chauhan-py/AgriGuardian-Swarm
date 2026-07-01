"use client";

import React, { useState, useEffect } from "react";
import { Award, Search, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function GovernmentSchemes() {
  const [query, setQuery] = useState("");
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial load of default schemes
    handleSearch("all");
  }, []);

  const handleSearch = (searchQuery = query) => {
    setLoading(true);
    // Call Government Agent text workflow
    fetch("/api/v1/agents/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `scheme search: ${searchQuery}`, farm_id: 1 })
    })
      .then((res) => res.json())
      .then((data) => {
        // If data.data has schemes, use it, otherwise mock fallback
        const fetchedSchemes = data.data?.schemes || [
          {
            title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            category: "Direct Benefit Transfer / Income Support",
            benefits: "₹6,000 per year direct income support in 3 installments of ₹2,000.",
            eligibility_reason: "Eligible. Your farm size of 2.5 acres is below the 5-acre limit.",
            is_eligible: true,
            description: "An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments to all small and marginal farmers.",
            application_process: "Apply online through the PM-Kisan portal or via Common Service Centres (CSCs)."
          },
          {
            title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            category: "Crop Insurance",
            benefits: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
            eligibility_reason: "Eligible. Highly recommended for crop protection against weather volatility.",
            is_eligible: true,
            description: "A government-sponsored crop insurance scheme that integrates multiple stakeholders and provides insurance coverage against crop damage.",
            application_process: "Enroll through local banks, cooperative societies, or directly online on the PMFBY portal."
          }
        ];
        setSchemes(fetchedSchemes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error searching schemes", err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Government Schemes</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Search agricultural loans, subsidies, and grants using semantic RAG vector search.</p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search schemes (e.g., 'subsidies for drip irrigation', 'crop insurance', 'tractor loan')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
        <button
          onClick={() => handleSearch()}
          className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 font-semibold text-sm text-white shadow-md"
        >
          Search Schemes
        </button>
      </div>

      {/* Schemes Results List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : schemes.length > 0 ? (
          schemes.map((scheme, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl space-y-4 hover:border-teal-500/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-50 dark:bg-teal-950/30 border border-teal-500/20 px-2.5 py-0.5 rounded-md">
                    {scheme.category}
                  </span>
                  <h3 className="font-bold text-lg mt-1.5">{scheme.title}</h3>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  scheme.is_eligible 
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400" 
                    : "bg-amber-500/10 border-amber-500/25 text-amber-600"
                }`}>
                  {scheme.is_eligible ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {scheme.is_eligible ? "Eligible" : "Check Details"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm leading-relaxed">
                <div className="md:col-span-2 space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Description</h4>
                    <p className="text-gray-600 dark:text-slate-300 font-light">{scheme.description}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Application Process</h4>
                    <p className="text-gray-600 dark:text-slate-300 font-light">{scheme.application_process}</p>
                  </div>
                </div>
                
                <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/40 border border-border p-4 rounded-xl">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs text-gray-400">BENEFITS</h4>
                    <p className="font-medium text-gray-700 dark:text-slate-200">{scheme.benefits}</p>
                  </div>
                  <div className="space-y-1 border-t border-border pt-3">
                    <h4 className="font-semibold text-xs text-gray-400">ELIGIBILITY FEEDBACK</h4>
                    <p className="text-xs text-gray-600 dark:text-slate-300">{scheme.eligibility_reason}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            No matching schemes found. Try another search term.
          </div>
        )}
      </div>
    </div>
  );
}
