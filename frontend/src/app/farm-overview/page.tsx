"use client";

import React, { useState, useEffect } from "react";
import { Sprout, Plus, CheckCircle, Database, HelpCircle, HardHat, LandPlot } from "lucide-react";

export default function FarmOverview() {
  const [fields, setFields] = useState<any[]>([]);
  const [farm, setFarm] = useState<any>(null);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newCropType, setNewCropType] = useState("Tomato");
  const [newCropVariety, setNewCropVariety] = useState("");

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Farm Form States
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState(1.0);
  const [soilType, setSoilType] = useState("Loamy");
  const [waterSource, setWaterSource] = useState("Borewell");
  const [irrigationType, setIrrigationType] = useState("Drip");

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchFarmProfile();
  }, []);

  const fetchFarmProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/farms", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load farms");
      const data = await res.json();
      if (data && data.length > 0) {
        const activeFarm = data[0];
        setFarm(activeFarm);
        setFields(activeFarm.fields || []);
        
        // Pre-fill form fields
        setFarmName(activeFarm.name);
        setFarmLocation(activeFarm.location);
        setFarmSize(activeFarm.size_acres);
        setSoilType(activeFarm.soil_type);
        setWaterSource(activeFarm.water_source);
        setIrrigationType(activeFarm.irrigation_type);
      } else {
        setFarm(null);
        setFields([]);
      }
    } catch (err) {
      console.error("Error loading farm profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: farmName,
        location: farmLocation,
        size_acres: farmSize,
        soil_type: soilType,
        water_source: waterSource,
        irrigation_type: irrigationType,
        fields: []
      };

      const res = await fetch("/api/v1/farms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Registration failed");
      
      await fetchFarmProfile();
      window.location.reload(); // Refresh layout farm name
    } catch (err) {
      console.error("Error registering farm:", err);
    }
  };

  const handleUpdateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farm) return;
    try {
      const payload = {
        name: farmName,
        location: farmLocation,
        size_acres: farmSize,
        soil_type: soilType,
        water_source: waterSource,
        irrigation_type: irrigationType,
        fields: []
      };

      const res = await fetch(`/api/v1/farms/${farm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Update failed");
      
      setIsEditing(false);
      await fetchFarmProfile();
      window.location.reload(); // Refresh layout farm name
    } catch (err) {
      console.error("Error updating farm:", err);
    }
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName || !farm) return;

    const payload = {
      name: newFieldName,
      crop_type: newCropType,
      crop_variety: newCropVariety || null,
      planting_date: new Date().toISOString()
    };

    fetch(`/api/v1/farms/${farm.id}/fields`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
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
      {farm ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl md:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <LandPlot className="text-teal-600" /> Farm Registration Registry
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline border border-border px-3 py-1.5 rounded-xl transition-all"
              >
                {isEditing ? "Cancel" : "Change Profile/Location"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateFarm} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Farm Name</label>
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Location (City, State)</label>
                    <input
                      type="text"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Farm Size (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={farmSize}
                      onChange={(e) => setFarmSize(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Soil Type</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none"
                    >
                      <option>Loamy</option>
                      <option>Sandy</option>
                      <option>Clay</option>
                      <option>Silty</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Water Source</label>
                    <select
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none"
                    >
                      <option>Borewell</option>
                      <option>Canal</option>
                      <option>Well</option>
                      <option>Rainfed</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Irrigation Method</label>
                    <select
                      value={irrigationType}
                      onChange={(e) => setIrrigationType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none"
                    >
                      <option>Drip</option>
                      <option>Sprinkler</option>
                      <option>Flood</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
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
            )}
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
      ) : !loading && (
        /* Register Farm Form for Onboarding new user */
        <form onSubmit={handleRegisterFarm} className="glass-panel p-6 rounded-2xl max-w-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <LandPlot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Onboarding: Register Your Farm</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Enter your land details to activate AI swarm monitoring.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Farm Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:border-teal-500"
                placeholder="e.g. Golden Field Farms"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Location (City, State)</label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:border-teal-500"
                placeholder="e.g. Amritsar, Punjab"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Farm Size (Acres)</label>
              <input
                type="number"
                step="0.1"
                value={farmSize}
                onChange={(e) => setFarmSize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none font-medium"
              >
                <option>Loamy</option>
                <option>Sandy</option>
                <option>Clay</option>
                <option>Silty</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Water Source</label>
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none font-medium"
              >
                <option>Borewell</option>
                <option>Canal</option>
                <option>Well</option>
                <option>Rainfed</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Irrigation Method</label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none font-medium"
              >
                <option>Drip</option>
                <option>Sprinkler</option>
                <option>Flood</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-lg shadow-teal-600/15 transition-colors"
            >
              Activate Swarm Platform
            </button>
          </div>
        </form>
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
                  className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-teal-500 font-medium"
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

      {/* Interactive AI Swarm Advisors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* NPK Fertilizer Calculator */}
        <NPKAdvisor />

        {/* Crop Rotation Simulator */}
        <CropRotationAdvisor />
      </div>
    </div>
  );
}

// Sub-component: NPK Fertilizer Advisor
function NPKAdvisor() {
  const [crop, setCrop] = useState("Tomato");
  const [n, setN] = useState(60);
  const [p, setP] = useState(20);
  const [k, setK] = useState(45);

  const requirements: Record<string, { n: number; p: number; k: number }> = {
    Tomato: { n: 150, p: 60, k: 120 },
    Wheat: { n: 120, p: 60, k: 40 },
    Rice: { n: 100, p: 50, k: 50 },
    Potato: { n: 120, p: 80, k: 120 },
  };

  const req = requirements[crop] || requirements.Tomato;

  // Calculate deficiencies
  const defN = Math.max(0, req.n - n);
  const defP = Math.max(0, req.p - p);
  const defK = Math.max(0, req.k - k);

  // Fertilizer conversion (bags of 50kg)
  // Urea: 46% N, SSP: 16% P, MOP: 60% K
  const ureaBags = ((defN / 0.46) / 50).toFixed(1);
  const sspBags = ((defP / 0.16) / 50).toFixed(1);
  const mopBags = ((defK / 0.60) / 50).toFixed(1);

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div>
        <h3 className="font-bold text-lg text-teal-600 dark:text-teal-400">NPK Fertilizer Advisor</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
          Enter soil test inputs to calculate exact bags of Urea, SSP, and MOP required per hectare.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Target Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none"
          >
            <option>Tomato</option>
            <option>Wheat</option>
            <option>Rice</option>
            <option>Potato</option>
          </select>
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          {[
            { label: "Current Nitrogen (N) - kg/ha", val: n, set: setN, max: 200, target: req.n },
            { label: "Current Phosphorus (P) - kg/ha", val: p, set: setP, max: 100, target: req.p },
            { label: "Current Potassium (K) - kg/ha", val: k, set: setK, max: 150, target: req.k },
          ].map((slider, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>{slider.label}</span>
                <span className="text-teal-600 dark:text-teal-400">
                  {slider.val} / <span className="text-gray-400">Target: {slider.target}</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={slider.max}
                value={slider.val}
                onChange={(e) => slider.set(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border space-y-3 text-sm">
          <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">fertilizer recommendation</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl border border-border bg-white/40 dark:bg-slate-900/40">
              <span className="text-base font-bold text-teal-600 dark:text-teal-400">{ureaBags}</span>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Urea Bags</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-white/40 dark:bg-slate-900/40">
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{sspBags}</span>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">SSP Bags</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-white/40 dark:bg-slate-900/40">
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{mopBags}</span>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">MOP Bags</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component: Crop Rotation Advisor
function CropRotationAdvisor() {
  const [prevCrop, setPrevCrop] = useState("Tomato");

  const rotationData: Record<
    string,
    { suggestion: string; benefit: string; recoveryScore: number; fixationRate: string }
  > = {
    Tomato: {
      suggestion: "Beans or Peas (Legumes)",
      benefit: "Replenishes severe Nitrogen depletion caused by high-feeding tomatoes, prevents build-up of solanaceous diseases like blight.",
      recoveryScore: 92,
      fixationRate: "High (60-80 kg/ha N fixed)"
    },
    Wheat: {
      suggestion: "Soybeans or Moong Dal (Green Gram)",
      benefit: "Replenishes potassium and nitrogen. Fits perfectly in the Kharif-Rabi cycle, improving organic soil carbon.",
      recoveryScore: 85,
      fixationRate: "Medium (40-50 kg/ha N fixed)"
    },
    Rice: {
      suggestion: "Chickpeas (Bengal Gram) or Lentils",
      benefit: "Requires minimal water, breaking soil compaction. Deep taproots extract lower soil nutrients, leaving upper profile fresh.",
      recoveryScore: 78,
      fixationRate: "Medium-High (50-60 kg/ha N fixed)"
    },
    Potato: {
      suggestion: "Maize (Corn) followed by Legumes",
      benefit: "Restores soil aeration. Maize's massive organic root residues prevent potato nematode build-up and enrich organic matters.",
      recoveryScore: 80,
      fixationRate: "High (adds 5-6 tons organic residue/ha)"
    }
  };

  const advice = rotationData[prevCrop] || rotationData.Tomato;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div>
        <h3 className="font-bold text-lg text-teal-600 dark:text-teal-400">Crop Rotation Advisor</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
          Select last season's crop to simulate soil depletion and discover the best next-season rotation.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Previously Harvested Crop</label>
          <select
            value={prevCrop}
            onChange={(e) => setPrevCrop(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none"
          >
            <option>Tomato</option>
            <option>Wheat</option>
            <option>Rice</option>
            <option>Potato</option>
          </select>
        </div>

        {/* Suggestions details */}
        <div className="space-y-4 text-sm bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-border">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">recommended next crop</span>
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{advice.suggestion}</p>
          </div>

          <div className="space-y-0.5 border-t border-border pt-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">agronomical benefit</span>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{advice.benefit}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">soil recovery rating</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-teal-600 dark:text-teal-400">{advice.recoveryScore}%</span>
                <div className="h-1.5 flex-1 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: `${advice.recoveryScore}%` }}></div>
                </div>
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">nitrogen fixation rate</span>
              <p className="text-xs font-semibold text-gray-600 dark:text-slate-300">{advice.fixationRate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
