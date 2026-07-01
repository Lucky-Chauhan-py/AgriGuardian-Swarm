"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, AlertTriangle, Info, Calendar } from "lucide-react";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch("/api/v1/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading notifications", err);
        setLoading(false);
      });
  };

  const handleMarkAsRead = (id: number) => {
    fetch(`/api/v1/notifications/${id}`, {
      method: "PUT"
    })
      .then(() => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      })
      .catch((err) => console.error("Error marking notification as read", err));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="text-red-500" size={18} />;
      case "reminder":
        return <Calendar className="text-amber-500" size={18} />;
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">View swarm alerts, fertilizer schedules, and market price notifications.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-3">
            <Bell className="text-teal-655 text-teal-600" size={20} /> Notification Feed
          </h3>
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start justify-between p-4 rounded-xl border border-border transition-all duration-150 ${
                    notif.is_read 
                      ? "bg-slate-100/30 dark:bg-slate-900/20 opacity-60" 
                      : "bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-850 border border-border mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">{notif.title}</p>
                      <p className="text-xs text-gray-600 dark:text-slate-300 font-light">{notif.message}</p>
                      <p className="text-[9px] text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-1.5 rounded-lg border border-border hover:bg-teal-50 dark:hover:bg-teal-950/20 text-gray-400 hover:text-teal-600 transition-colors"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs font-light">
                No new notifications. All systems are green!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
