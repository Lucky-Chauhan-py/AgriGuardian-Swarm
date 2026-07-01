"use client";

import React, { useState, useEffect } from "react";
import { FilePieChart, Download, Plus, Eye, Sparkles, TrendingUp, DollarSign } from "lucide-react";

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    fetch("/api/v1/reports?farm_id=1")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports", err);
        setLoading(false);
      });
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    fetch("/api/v1/reports?farm_id=1", {
      method: "POST"
    })
      .then((res) => res.json())
      .then((newReport) => {
        setReports([newReport, ...reports]);
        setSelectedReport(newReport);
        setGenerating(false);
      })
      .catch((err) => {
        console.error("Error generating report", err);
        setGenerating(false);
      });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Insights</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Generate and download comprehensive farm health and financial PDF reports.</p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-gray-400 font-semibold text-sm text-white flex items-center gap-2 shadow-lg shadow-teal-600/15"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Compiling...
            </>
          ) : (
            <>
              <Plus size={16} /> Compile Swarm Report
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports History List */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 h-fit">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FilePieChart className="text-teal-600" /> Compiled Reports
            </h3>
            <div className="space-y-2">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                    selectedReport?.id === report.id
                      ? "border-teal-500 bg-teal-500/5 text-teal-700 dark:text-teal-400 font-semibold"
                      : "border-border hover:bg-gray-50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm truncate">{report.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                  <Eye size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Report Viewer / Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedReport ? (
              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Compiled on {new Date(selectedReport.created_at).toLocaleString()}</p>
                  </div>
                  {selectedReport.file_path && (
                    <a
                      href={selectedReport.file_path}
                      download
                      className="px-4 py-2 rounded-xl border border-border hover:bg-gray-50 dark:hover:bg-slate-900 text-sm font-semibold flex items-center gap-2"
                    >
                      <Download size={16} /> Download PDF
                    </a>
                  )}
                </div>

                {/* AI Insights summary */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-base flex items-center gap-2 text-teal-700 dark:text-teal-400">
                    <Sparkles size={18} /> Swarm Key Insights
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border space-y-2 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                    {selectedReport.summary ? (
                      selectedReport.summary.split(", ").map((insight: string, i: number) => (
                        <p key={i}>• {insight}</p>
                      ))
                    ) : (
                      <p>All systems functioning normally. Crop health is optimal.</p>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                {selectedReport.data_json && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      <TrendingUp className="text-teal-600" /> Projected Financials
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div className="p-4 rounded-xl border border-border bg-white/30 dark:bg-slate-900/30">
                        <p className="text-xs text-gray-400 font-medium uppercase">Yield Target</p>
                        <p className="text-lg font-bold mt-1 text-teal-600 dark:text-teal-400">
                          {selectedReport.data_json.yield_prediction_tons} Tons
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-border bg-white/30 dark:bg-slate-900/30">
                        <p className="text-xs text-gray-400 font-medium uppercase">Est. Expenses</p>
                        <p className="text-lg font-bold mt-1 text-red-500">
                          ₹{selectedReport.data_json.estimated_expenses?.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-border bg-white/30 dark:bg-slate-900/30">
                        <p className="text-xs text-gray-400 font-medium uppercase">Est. Net Profit</p>
                        <p className="text-lg font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                          ₹{selectedReport.data_json.estimated_profit?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-2xl text-center text-gray-400">
                No reports compiled yet. Click "Compile Swarm Report" to generate your first intelligence summary.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
