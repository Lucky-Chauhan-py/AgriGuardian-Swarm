"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Mic, MicOff, Volume2, Sparkles, BrainCircuit, User } from "lucide-react";

interface Message {
  id: number;
  message: string;
  sender: "user" | "system";
  agent_thoughts?: any[];
  created_at: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeThoughts, setActiveThoughts] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Seed initial message if empty
    setMessages([
      {
        id: 0,
        message: "Hello Rajesh! I am the AgriGuardian Swarm. How can I assist you with your farm operations today?",
        sender: "system",
        created_at: new Date().toISOString()
      }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg: Message = {
      id: Date.now(),
      message: textToSend,
      sender: "user",
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Call Swarm Agent API
    fetch("/api/v1/agents/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: textToSend, farm_id: 1 })
    })
      .then((res) => res.json())
      .then((data) => {
        const systemMsg: Message = {
          id: data.id,
          message: data.message,
          sender: "system",
          agent_thoughts: data.agent_thoughts,
          created_at: data.created_at
        };
        setMessages((prev) => [...prev, systemMsg]);
        if (data.agent_thoughts) {
          setActiveThoughts(data.agent_thoughts);
        }
      })
      .catch((err) => console.error("Error sending message to swarm", err));
  };

  // Simulated Voice Assistant (STT/TTS)
  const handleVoiceAssistant = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    
    // Simulate speech recognition after 3 seconds
    setTimeout(() => {
      let speechResult = "मंडी का भाव क्या है"; // Hindi for "what is the market price"
      if (selectedLanguage === "en") {
        speechResult = "what is the market price of tomato";
      } else if (selectedLanguage === "pa") {
        speechResult = "ਮੰਡੀ ਦਾ ਭਾਅ ਕੀ ਹੈ";
      }

      setIsRecording(false);
      
      // Post voice command
      const formData = new FormData();
      formData.append("message", speechResult);
      formData.append("lang", selectedLanguage);
      formData.append("farm_id", "1");

      const userMsg: Message = {
        id: Date.now(),
        message: speechResult,
        sender: "user",
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, userMsg]);

      fetch("/api/v1/agents/voice", {
        method: "POST",
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          const systemMsg: Message = {
            id: Date.now() + 1,
            message: data.agent_response,
            sender: "system",
            agent_thoughts: data.thought_logs,
            created_at: new Date().toISOString()
          };
          setMessages((prev) => [...prev, systemMsg]);
          if (data.thought_logs) {
            setActiveThoughts(data.thought_logs);
          }
          
          // Trigger TTS
          speakText(data.agent_response);
        })
        .catch((err) => console.error("Error in voice command", err));

    }, 3000);
  };

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === "hi" ? "hi-IN" : selectedLanguage === "pa" ? "pa-IN" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Chat Section */}
      <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col justify-between overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-600 text-white shadow-md">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base">Swarm Assistant</h3>
              <p className="text-xs text-gray-500">Autonomous multi-agent coordinator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2 py-1 rounded-lg border border-border bg-white dark:bg-slate-900 text-xs focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isSystem = msg.sender === "system";
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isSystem ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                  isSystem ? "bg-teal-600 text-white" : "bg-sky-600 text-white"
                }`}>
                  {isSystem ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isSystem 
                      ? "bg-slate-100/80 dark:bg-slate-900/60 border border-border text-foreground rounded-tl-none" 
                      : "bg-teal-600 text-white rounded-tr-none"
                  }`}>
                    {msg.message}
                  </div>
                  {isSystem && msg.agent_thoughts && (
                    <button
                      onClick={() => setActiveThoughts(msg.agent_thoughts || [])}
                      className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <BrainCircuit size={12} /> View Agent Thoughts
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-950/50 flex items-center gap-3">
          <button
            onClick={handleVoiceAssistant}
            className={`p-3 rounded-xl border border-border flex items-center justify-center transition-colors ${
              isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white dark:bg-slate-900 hover:bg-gray-50"
            }`}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            type="text"
            placeholder={isRecording ? "Listening... speak now" : "Ask the Swarm about weather, prices, or schemes..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-teal-500"
            disabled={isRecording}
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-md flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Agent Thought Process Logs */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between overflow-hidden h-full">
        <div>
          <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
            <BrainCircuit className="text-teal-600" /> Swarm Orchestration Log
          </h3>
          <p className="text-xs text-gray-400 mb-4 font-light">Real-time telemetry showing agent communications and task delegation.</p>
          
          <div className="space-y-4 overflow-y-auto max-h-[380px] pr-2">
            {activeThoughts.length > 0 ? (
              activeThoughts.map((thought, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{thought.agent}</span>
                    <p className="text-xs text-gray-600 dark:text-slate-300 font-mono mt-0.5">{thought.thought}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs font-light">
                <Sparkles size={24} className="mx-auto mb-2 text-teal-500/50" />
                No active swarm logs. Send a message to watch the agents coordinate.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
