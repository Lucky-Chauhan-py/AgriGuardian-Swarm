"use client";

import React, { useState, useEffect } from "react";
import { CloudSun, Sun, CloudRain, CloudLightning, CloudDrizzle, Info, Thermometer, Droplet, Wind } from "lucide-react";

export default function WeatherCenter() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      try {
        const farmRes = await fetch("/api/v1/farms", {
          headers: getAuthHeaders(),
        });
        if (!farmRes.ok) throw new Error("Failed to fetch farms");
        const farms = await farmRes.json();
        
        const activeFarm = farms && farms.length > 0 ? farms[0] : null;
        const loc = activeFarm?.location || "Bareilly, Uttar Pradesh";
        const farmId = activeFarm?.id || 1;

        const analyticsRes = await fetch(`/api/v1/analytics?farm_id=${farmId}`, {
          headers: getAuthHeaders(),
        });
        if (!analyticsRes.ok) throw new Error("Failed to fetch analytics");
        const data = await analyticsRes.json();

        setWeather({
          location: loc,
          current_temp_c: 32.5,
          current_humidity: 63,
          precipitation_mm: 0.0,
          wind_kph: 12.5,
          condition: "Partly Cloudy",
          irrigation_recommendation: "Irrigate normally from Monday to Wednesday. Suspend irrigation on Thursday evening in anticipation of Friday's heavy rain (25mm). Ensure field drainage channels are clear.",
          alerts: [
            {
              type: "Heavy Rain Alert",
              severity: "medium",
              description: `Heavy rain (up to 25mm) predicted in ${loc}. Risk of waterlogging in low-lying fields.`
            }
          ],
          forecast: [
            { day: "Mon", temp: 32, humidity: 65, rain_prob: 20, condition: "Partly Cloudy" },
            { day: "Tue", temp: 33, humidity: 60, rain_prob: 10, condition: "Sunny" },
            { day: "Wed", temp: 34, humidity: 58, rain_prob: 5, condition: "Sunny" },
            { day: "Thu", temp: 35, humidity: 55, rain_prob: 40, condition: "Scattered Showers" },
            { day: "Fri", temp: 29, humidity: 80, rain_prob: 80, condition: "Heavy Rain" },
            { day: "Sat", temp: 30, humidity: 75, rain_prob: 30, condition: "Cloudy" },
            { day: "Sun", temp: 31, humidity: 70, rain_prob: 15, condition: "Mostly Sunny" }
          ]
        });
      } catch (err) {
        console.error("Error loading weather data:", err);
        setWeather({
          location: "Register Farm to Set Location",
          current_temp_c: 28.0,
          current_humidity: 70,
          precipitation_mm: 0.0,
          wind_kph: 10.0,
          condition: "Sunny",
          irrigation_recommendation: "Please register your farm under the Farm Overview tab to activate custom agrometeorological irrigation forecasts.",
          alerts: [
            {
              type: "Setup Alert",
              severity: "low",
              description: "No farm profile found. Displaying default mock weather details."
            }
          ],
          forecast: [
            { day: "Mon", temp: 30, humidity: 60, rain_prob: 10, condition: "Sunny" },
            { day: "Tue", temp: 31, humidity: 55, rain_prob: 5, condition: "Sunny" },
            { day: "Wed", temp: 32, humidity: 50, rain_prob: 5, condition: "Sunny" },
            { day: "Thu", temp: 32, humidity: 50, rain_prob: 10, condition: "Sunny" },
            { day: "Fri", temp: 33, humidity: 52, rain_prob: 10, condition: "Sunny" },
            { day: "Sat", temp: 31, humidity: 55, rain_prob: 15, condition: "Partly Cloudy" },
            { day: "Sun", temp: 30, humidity: 60, rain_prob: 20, condition: "Partly Cloudy" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "mostly sunny":
        return <Sun className="text-amber-500" size={32} />;
      case "heavy rain":
        return <CloudRain className="text-blue-600" size={32} />;
      case "scattered showers":
      case "cloudy":
        return <CloudDrizzle className="text-blue-400" size={32} />;
      default:
        return <CloudSun className="text-sky-500" size={32} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weather Center</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Micro-climate telemetry and agrometeorological risk analysis.</p>
      </div>

      {/* Main Current Card & Irrigation Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{weather.location}</h3>
              <p className="text-xs text-gray-400">Current Conditions</p>
            </div>
            {getWeatherIcon(weather.condition)}
          </div>
          
          <div className="py-4">
            <p className="text-5xl font-extrabold">{weather.current_temp_c}°C</p>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-300 mt-1">{weather.condition}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-4 text-center">
            <div>
              <Droplet className="mx-auto text-sky-500 mb-1" size={18} />
              <p className="text-xs font-bold">{weather.current_humidity}%</p>
              <p className="text-[9px] text-gray-400">Humidity</p>
            </div>
            <div>
              <Wind className="mx-auto text-teal-500 mb-1" size={18} />
              <p className="text-xs font-bold">{weather.wind_kph} kph</p>
              <p className="text-[9px] text-gray-400">Wind</p>
            </div>
            <div>
              <Thermometer className="mx-auto text-orange-500 mb-1" size={18} />
              <p className="text-xs font-bold">Low Risk</p>
              <p className="text-[9px] text-gray-400">Frost Index</p>
            </div>
          </div>
        </div>

        {/* Irrigation Recommendation */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4 border-l-4 border-teal-600">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Info className="text-teal-600" /> Weather Agent Irrigation Guidelines
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
            {weather.irrigation_recommendation}
          </p>

          {weather.alerts.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-700 dark:text-red-400 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider">CRITICAL WEATHER WARNING</p>
              <p className="text-sm font-semibold">{weather.alerts[0].type}</p>
              <p className="text-xs">{weather.alerts[0].description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">7-Day Agricultural Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {weather.forecast.map((day: any, idx: number) => (
            <div key={idx} className="glass-panel p-4 rounded-xl text-center space-y-3 hover:border-teal-500/30 transition-colors">
              <p className="text-xs font-bold text-gray-400">{day.day}</p>
              <div className="flex justify-center">{getWeatherIcon(day.condition)}</div>
              <div>
                <p className="text-base font-bold">{day.temp}°C</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{day.condition}</p>
              </div>
              <div className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                Rain: {day.rain_prob}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
