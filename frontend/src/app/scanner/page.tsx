"use client";

import React, { useState } from "react";
import { Upload, AlertCircle, CheckCircle, ShieldAlert, Sparkles, BrainCircuit } from "lucide-react";

export default function ImageScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [mockDisease, setMockDisease] = useState("Tomato Early Blight");

  const cropDiseases: Record<string, string[]> = {
    Tomato: ["Tomato Early Blight", "Tomato Late Blight", "Tomato Spider Mites"],
    Wheat: ["Wheat Rust", "Wheat Powdery Mildew"],
    Rice: ["Rice Blast", "Rice Bacterial Leaf Blight"],
    Potato: ["Potato Late Blight", "Potato Early Blight"],
    Other: ["Nutrient Deficiency: Iron", "Healthy Leaf"],
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("farm_id", "1");
    formData.append("mock_disease", mockDisease);

    try {
      const res = await fetch("/api/v1/agents/scan", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: `Server error: ${res.status}` }));
        throw new Error(errData.detail || "Scan failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Image Scanner</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Upload crop leaves or pests to run the autonomous multi-agent diagnostics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="glass-panel p-6 rounded-2xl space-y-6 h-fit">
          <h3 className="font-semibold text-lg">Upload Crop Photo</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-teal-500 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm font-medium">Drag &amp; drop or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG up to 10MB</p>
            </div>

            {previewUrl && (
              <div className="rounded-xl overflow-hidden border border-border h-48 relative">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Select Crop Type</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => {
                    const crop = e.target.value;
                    setSelectedCrop(crop);
                    setMockDisease(cropDiseases[crop][0]);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none"
                >
                  <option>Tomato</option>
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Potato</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Select Disease to Simulate</label>
                <select
                  value={mockDisease}
                  onChange={(e) => setMockDisease(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none"
                >
                  {cropDiseases[selectedCrop].map((disease) => (
                    <option key={disease}>{disease}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-sm text-white shadow-lg shadow-teal-600/15 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Agents Coordinating...
                </>
              ) : (
                "Scan with AI Swarm"
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="glass-panel p-8 rounded-2xl space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <BrainCircuit className="text-teal-600 animate-pulse" /> Swarm Activating...
              </h3>
              <div className="space-y-3 font-mono text-xs text-gray-600 dark:text-slate-300">
                {[
                  "[Vision Agent]: Analyzing crop image for disease patterns...",
                  "[Weather Agent]: Cross-referencing current climate conditions...",
                  "[Risk Agent]: Calculating yield loss probability...",
                  "[Planning Agent]: Generating treatment schedule...",
                  "[GovScheme Agent]: Searching for applicable insurance...",
                  "[Market Agent]: Evaluating crop sellability...",
                  "[Memory Agent]: Saving event to farm history...",
                  "[Notification Agent]: Scheduling treatment reminders...",
                  "[Report Agent]: Compiling diagnostic summary...",
                  "[Coordinator]: Synthesizing all agent outputs...",
                ].map((log, i) => (
                  <div key={i} className="flex gap-2 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                    <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">►</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !loading ? (
            <div className="space-y-6">
              {/* Diagnosis */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Diagnosis Report</span>
                  <span className="text-xs text-gray-400">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-red-600 dark:text-red-400">
                      {result.workflow_results?.diagnosis?.disease_name || "Unknown"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Classification: {result.workflow_results?.diagnosis?.pest_or_disease || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 border border-border px-4 py-2 rounded-xl">
                    <div className="text-center">
                      <span className="text-lg font-bold text-red-500">
                        {Math.round((result.workflow_results?.diagnosis?.severity_score || 0) * 100)}%
                      </span>
                      <p className="text-[10px] text-gray-400">Severity</p>
                    </div>
                    <div className="text-center border-l border-border pl-4">
                      <span className="text-sm font-semibold">{result.workflow_results?.diagnosis?.growth_stage || "N/A"}</span>
                      <p className="text-[10px] text-gray-400">Growth Stage</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Symptoms Observed:</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                    {result.workflow_results?.diagnosis?.symptoms || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Treatment Plan:</h4>
                  <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-500/20 text-sm text-gray-600 dark:text-slate-300 space-y-1.5">
                    {(result.workflow_results?.diagnosis?.treatment_plan || "").split("\n").map((line: string, i: number) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tasks + Swarm integrations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <CheckCircle className="text-teal-600" /> Treatment Tasks Added
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      ...(result.workflow_results?.tasks?.daily_tasks || []),
                      ...(result.workflow_results?.tasks?.weekly_tasks || []),
                    ].slice(0, 3).map((task: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl border border-border bg-white/40 dark:bg-slate-900/40">
                        <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{task.category}</p>
                        <p className="text-sm font-semibold mt-0.5">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Sparkles className="text-teal-600" /> Swarm Integrations
                  </h3>
                  <div className="space-y-3.5 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 font-semibold">MARKET OPPORTUNITY</p>
                      <p className="font-medium text-gray-600 dark:text-slate-300">
                        {result.workflow_results?.market?.selling_opportunity || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1 border-t border-border pt-3">
                      <p className="text-xs text-gray-400 font-semibold">ELIGIBLE GOVT SCHEME</p>
                      <p className="font-medium text-gray-600 dark:text-slate-300">
                        {result.workflow_results?.schemes?.[0]?.title
                          ? <>Matches <b>{result.workflow_results.schemes[0].title}</b>. Benefit: {result.workflow_results.schemes[0].benefits}</>
                          : "No matching schemes found"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thought Logs */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <BrainCircuit className="text-teal-600" /> Swarm Orchestration Log
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto font-mono text-xs text-gray-600 dark:text-slate-300 pr-2">
                  {(result.workflow_results?.thought_logs || []).map((log: any, i: number) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">[{log.agent}]:</span>
                      <span>{log.thought}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : !loading && (
            <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 flex flex-col items-center justify-center min-h-[400px]">
              <ShieldAlert size={48} className="text-teal-500/30 mb-4" />
              <p className="text-base font-semibold">No active scan results.</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                Upload a leaf photo and click Scan to activate the autonomous multi-agent analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
