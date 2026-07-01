"use client";

import React, { useState, useEffect } from "react";
import { Sprout, Plus, CheckCircle, Database, HelpCircle, HardHat, Landplot } from "lucide-react";

export default function FarmOverview() {
  const [fields, setFields] = useState<any[]>([]);
  const [farm, setFarm] = useState<any>(null);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newCropType, setNewCropType] = useState("Tomato");
  const [newCropVariety, setNewCropVariety] = useState("");

  useEffect(() => {
    // Fetch farm and fields
    fetch("/api/v1/farms/1")
      .then((res) => res.json())
      .then((data) => {
        setFarm(data);
        setFields(data.fields || []);
      })
      .catch((err) => console.error("Error loading farm profile", err));
  }, []);

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName) return;

    const payload = {
      name: newFieldName,
      crop_type: newCropType,
      crop_variety: newCropVariety || null,
      planting_date: new Date().toISOString()
    };

    fetch("/api/v1/farms/1/fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((newField) => {
        setFields([...fields, newField]);
        setNewFieldName("");
        setNewCropVariety("");
        setShowAddField(false);
      })
      .catch((err) => console.error("Error adding field", err));
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Farm Overview</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Manage land records, fields, and soil composition telemetry.</p>
      </div>

      {/* Farm Details Card */}
      {farm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl md:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Landplot className="text-teal-600" /> Farm Registration Registry
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 font-medium">FARM NAME</p>
                <p className="text-base font-semibold">{farm.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">LOCATION</p>
                <p className="text-base font-semibold">{farm.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">FARM SIZE</p>
                <p className="text-base font-semibold">{farm.size_acres} Acres</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">WATER SOURCE</p>
                <p className="text-base font-semibold">{farm.water_source}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">IRRIGATION METHOD</p>
                <p className="text-base font-semibold">{farm.irrigation_type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">SOIL BASELINE</p>
                <p className="text-base font-semibold">{farm.soil_type}</p>
              </div>
            </div>
          </div>

          {/* Soil N-P-K Telemetry */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Database className="text-teal-600" /> Soil Parameters (NPK)
            </h3>
            <div className="space-y-3">
              {[
                { name: "Nitrogen (N)", level: "Medium", value: "280 kg/ha", color: "bg-teal-500" },
                { name: "Phosphorus (P)", level: "High", value: "35 kg/ha", color: "bg-emerald-500" },
                { name: "Potassium (K)", level: "Medium", value: "190 kg/ha", color: "bg-sky-500" },
                { name: "Soil pH", level: "Optimal", value: "6.5 pH", color: "bg-indigo-500" }
              ].map((soil, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{soil.name}</span>
                    <span className="text-gray-400">{soil.value} ({soil.level})</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${soil.color}`} style={{ width: soil.level === "High" ? "85%" : "60%" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Field List & Add Field Button */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Field Compartments</h2>
          <button
            onClick={() => setShowAddField(!showAddField)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 font-semibold text-sm text-white flex items-center gap-2 shadow-lg shadow-teal-600/15"
          >
            <Plus size={16} /> Add Field
          </button>
        </div>

        {/* Add Field Inline Modal/Form */}
        {showAddField && (
          <form onSubmit={handleAddField} className="glass-panel p-6 rounded-2xl space-y-4 max-w-lg">
            <h3 className="font-semibold text-base">Add New Field</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Field Name</label>
                <input
                  type="text"
                  placeholder="e.g. North Patch"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Crop Type</label>
                <select
                  value={newCropType}
                  onChange={(e) => setNewCropType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-teal-500"
                >
                  <option>Tomato</option>
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Potato</option>
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium">Crop Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Arka Rakshak / PBW 343"
                  value={newCropVariety}
                  onChange={(e) => setNewCropVariety(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddField(false)}
                className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-gray-50 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold"
              >
                Save Field
              </button>
            </div>
          </form>
        )}

        {/* Fields Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <div key={field.id} className="glass-panel p-6 rounded-2xl space-y-4 hover:border-teal-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Sprout size={22} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  field.status === "active" ? "bg-emerald-500/15 text-emerald-600" : "bg-gray-500/15 text-gray-500"
                }`}>
                  {field.status === "active" ? "Growing" : "Harvested"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-base">{field.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Crop: {field.crop_type} ({field.crop_variety || "Standard"})</p>
                <p className="text-xs text-gray-400 mt-1">Planted on: {new Date(field.planting_date).toLocaleDateString()}</p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-gray-400">Stage: Vegetative</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">Health: 88%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
