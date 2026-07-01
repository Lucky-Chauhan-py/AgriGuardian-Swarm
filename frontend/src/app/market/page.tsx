"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Award, MapPin, Calculator, DollarSign, ArrowUpRight } from "lucide-react";

export default function MarketIntelligence() {
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commodity, setCommodity] = useState("Tomato");
  const [qtyQuintals, setQtyQuintals] = useState(10);
  const [cultivationCost, setCultivationCost] = useState(8000); // flat cost

  useEffect(() => {
    // Fetch market price data
    fetch(`/api/v1/analytics?farm_id=1`)
      .then((res) => res.json())
      .then(() => {
        // Mock market data matching MarketIntelligenceAgent
        setMarketData({
          commodity: commodity,
          current_price: {
            min: commodity === "Tomato" ? 1800 : 2100,
            max: commodity === "Tomato" ? 2500 : 2300,
            modal: commodity === "Tomato" ? 2200 : 2245,
            unit: "Quintal (100 kg)"
          },
          nearby_markets: [
            { market_name: "Bareilly Mandi", distance_km: 8, price: commodity === "Tomato" ? 2200 : 2245, transport_cost_per_q: 50 },
            { market_name: "Lucknow Grain Market", distance_km: 75, price: (commodity === "Tomato" ? 2200 : 2245) + 250, transport_cost_per_q: 150 },
            { market_name: "Regional FPO Hub", distance_km: 15, price: (commodity === "Tomato" ? 2200 : 2245) - 50, transport_cost_per_q: 30 }
          ],
          market_trend: "Bullish",
          price_change_forecast_pct: 8.5,
          selling_opportunity: "Hold harvesting/selling for 7-10 days if storage allows. Prices are expected to rise by 8.5% due to lower arrivals in neighboring districts."
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching market prices", err);
        setLoading(false);
      });
  }, [commodity]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate profit
  const totalRevenue = qtyQuintals * marketData.current_price.modal;
  const estimatedTransport = qtyQuintals * 50; // Bareilly Mandi default
  const totalCost = cultivationCost + estimatedTransport;
  const netProfit = totalRevenue - totalCost;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Track mandi prices, analyze profit margins, and select optimal selling windows.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mandi Price Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold uppercase">Select Commodity</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-teal-500"
            >
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Wheat">Wheat (गेहूँ)</option>
            </select>
          </div>

          <div className="py-4">
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-50 dark:bg-teal-950/30 border border-teal-500/20 px-2 py-0.5 rounded-md">
              Mandi Modal Price
            </span>
            <p className="text-4xl font-extrabold mt-2">₹{marketData.current_price.modal} <span className="text-xs text-gray-400">/ {marketData.current_price.unit}</span></p>
            <p className="text-xs text-gray-400 mt-1">Range: ₹{marketData.current_price.min} - ₹{marketData.current_price.max}</p>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
            <span className="text-gray-400">Price Trend:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ArrowUpRight size={14} /> {marketData.market_trend} (+{marketData.price_change_forecast_pct}%)
            </span>
          </div>
        </div>

        {/* Selling Recommendation */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4 border-l-4 border-amber-500">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="text-amber-500" /> Market Agent Selling Strategy
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
            {marketData.selling_opportunity}
          </p>
          <div className="text-xs text-gray-400">
            Source: Regional Mandi Arrivals & Volatility Indices.
          </div>
        </div>
      </div>

      {/* Profit Margin Calculator & Nearby Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nearby Markets */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="text-teal-655 text-teal-600" /> Nearby Markets Comparison
          </h3>
          <div className="space-y-3">
            {marketData.nearby_markets.map((market: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-white/40 dark:bg-slate-900/40 gap-4">
                <div>
                  <h4 className="font-semibold text-sm">{market.market_name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Distance: {market.distance_km} km | Transport: ₹{market.transport_cost_per_q}/q</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-teal-600 dark:text-teal-400">₹{market.price}/q</p>
                  <p className="text-[10px] text-gray-400">Net after transport: ₹{market.price - market.transport_cost_per_q}/q</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Calculator */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calculator className="text-teal-600" /> Profit Calculator
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-500">Harvest Quantity (Quintals)</label>
              <input
                type="number"
                value={qtyQuintals}
                onChange={(e) => setQtyQuintals(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-500">Cultivation Cost (₹)</label>
              <input
                type="number"
                value={cultivationCost}
                onChange={(e) => setCultivationCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Estimated Revenue:</span>
                <span className="font-bold">₹{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Transport Cost:</span>
                <span>₹{estimatedTransport.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-border pt-2 text-sm">
                <span className="font-semibold">Net Profit:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
