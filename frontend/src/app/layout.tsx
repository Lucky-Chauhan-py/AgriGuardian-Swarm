"use client";

import React, { useState, useEffect } from "react";
import "./globals.css";
import {
  LayoutDashboard,
  Sprout,
  Bot,
  ScanLine,
  CloudSun,
  TrendingUp,
  Award,
  CalendarDays,
  FilePieChart,
  Bell,
  Settings as SettingsIcon,
  LineChart,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState<{ name: string; email: string; initials: string } | null>(null);

  // Pages that don't need auth or the sidebar layout
  const isPublicPage = pathname === "/" || pathname === "/auth";

  // Load theme preference
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Load user info and protect routes
  useEffect(() => {
    if (isPublicPage) return;

    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      // Not logged in — redirect to login page
      router.push("/auth");
      return;
    }

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
    } else {
      // Fetch user info from API using stored token
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          const name = data.full_name || data.email;
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          const userObj = { name, email: data.email, initials };
          setUser(userObj);
          localStorage.setItem("user", JSON.stringify(userObj));
        })
        .catch(() => {
          // Token invalid — clear and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/auth");
        });
    }
  }, [pathname]);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Farm Overview", path: "/farm-overview", icon: Sprout },
    { name: "AI Farm Assistant", path: "/assistant", icon: Bot },
    { name: "Image Scanner", path: "/scanner", icon: ScanLine },
    { name: "Weather Center", path: "/weather", icon: CloudSun },
    { name: "Market Intelligence", path: "/market", icon: TrendingUp },
    { name: "Government Schemes", path: "/schemes", icon: Award },
    { name: "Task Planner", path: "/tasks", icon: CalendarDays },
    { name: "Reports", path: "/reports", icon: FilePieChart },
    { name: "Analytics", path: "/analytics", icon: LineChart },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "pa", name: "ਪੰਜਾਬੀ" },
  ];

  return (
    <html lang={language} className={darkMode ? "dark" : ""}>
      <head>
        <title>AgriGuardian Swarm - AI OS for Farmers</title>
        <meta
          name="description"
          content="Autonomous multi-agent system for farm monitoring, crop diagnostics, weather risk, and market intelligence."
        />
      </head>
      <body className="bg-background text-foreground transition-colors duration-300">
        {/* Public pages (landing + auth) — render without sidebar */}
        {isPublicPage ? (
          children
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 glass-panel border-r border-border transition-transform duration-300 transform lg:translate-x-0 lg:static ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-sm">
                    A
                  </div>
                  <span className="font-display font-bold text-lg text-teal-700 dark:text-teal-400">
                    AgriGuardian
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-600/25 dark:shadow-teal-900/35"
                          : "hover:bg-teal-50 dark:hover:bg-slate-800/60 text-gray-600 dark:text-slate-300"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Sidebar Footer — Real User Info */}
              <div className="p-4 border-t border-border space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-teal-50/50 dark:bg-slate-800/40 border border-border">
                  <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {user?.initials || "?"}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-semibold truncate">
                      {user?.name || "Loading..."}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              {/* Header */}
              <header className="flex items-center justify-between h-16 px-6 glass-panel border-b border-border z-40">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 lg:hidden"
                  >
                    <Menu size={20} />
                  </button>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-slate-300">
                    <Sprout size={16} className="text-teal-600" />
                    Green Valley Farms
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-4">
                  {/* Language Selector */}
                  <div className="flex items-center gap-1.5">
                    <Globe size={16} className="text-gray-500" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                    >
                      {languages.map((lang) => (
                        <option
                          key={lang.code}
                          value={lang.code}
                          className="dark:bg-slate-900"
                        >
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notifications */}
                  <Link
                    href="/notifications"
                    className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  </Link>

                  {/* Dark Mode Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-slate-950/30">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
