"use client";

import React, { useState } from "react";
import { Settings as SettingsIcon, User, Globe, Shield, Save } from "lucide-react";

export default function Settings() {
  const [fullName, setFullName] = useState("Rajesh Kumar");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("farmer@agriguardian.com");
  const [language, setLanguage] = useState("en");
  const [apiKey, setApiKey] = useState("");
  const [mockMode, setMockMode] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Simulate saving settings
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Configure your farmer profile, system preferences, and AI agent keys.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Settings */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-3">
            <User className="text-teal-600" size={20} /> Farmer Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-gray-500">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
                required
                disabled
              />
            </div>
          </div>
        </div>

        {/* Preference Settings */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-3">
            <Globe className="text-teal-600" size={20} /> Localization & Language
          </h3>
          <div className="space-y-1.5 max-w-xs">
            <label className="text-xs font-medium text-gray-500">Primary Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-teal-500"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>

        {/* AI & Security Settings */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-3">
            <Shield className="text-teal-600" size={20} /> AI Core Configuration
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Gemini 2.5 API Key</label>
              <input
                type="password"
                placeholder="AI key from Google AI Studio (optional, defaults to Mock Mode if empty)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-teal-500/10 border border-teal-500/25">
              <div>
                <p className="text-sm font-semibold">Offline / Simulated Swarm Mode</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Runs high-fidelity mock agent reasoning workflows for zero-setup evaluations.</p>
              </div>
              <input
                type="checkbox"
                checked={mockMode}
                onChange={(e) => setMockMode(e.target.checked)}
                className="w-5 h-5 accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {success && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Settings saved successfully!</span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 font-semibold text-sm text-white shadow-lg shadow-teal-600/15 flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={16} />
            )}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
