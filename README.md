# 🌾 AgriGuardian Swarm

### **Autonomous Multi-Agent AI Operating System for Smallholder Farmers**

[![Google × Kaggle](https://img.shields.io/badge/Competition-Google%20%C3%97%20Kaggle-orange.svg?style=for-the-badge)](https://www.kaggle.com)
[![Agents for Good](https://img.shields.io/badge/Track-Agents%20For%20Good-emerald.svg?style=for-the-badge)](https://www.kaggle.com)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Gemini](https://img.shields.io/badge/AI%20Engine-Gemini%201.5%20Flash-blue.svg?style=for-the-badge&logo=google)](https://ai.google.dev)

---

## 📺 Live Links & Demo

* 🚀 **Live Demo Platform**: [agri-guardian-swarm.vercel.app](https://agri-guardian-swarm.vercel.app)
* 📹 **Video Walkthrough (YouTube)**: *[Insert your YouTube video link here]*
* 🏛️ **Kaggle Submission Notebook**: *[Insert your Kaggle Notebook link here]*
* 📂 **Backend API Documentation**: `https://your-backend-url.onrender.com/docs` (Swagger UI)

---

## 🌍 The Problem: Livelihoods in Jeopardy

Over **600 million smallholder farmers** grow food for the planet, yet they remain among the most economically vulnerable people on Earth. They face a compounding storm of challenges every single season:
* **Undetected Crop Diseases**: Pathogens spread silently, wiping out 20–40% of yields before a farmer notices the damage.
* **Extreme Climate Volatility**: Shifts in weather make traditional irrigation windows and harvesting schedules dangerously unpredictable.
* **Market Exploitation & Price Drops**: Due to a lack of real-time market data, farmers often sell their crops at a loss to middlemen.
* **Bureaucratic Exclusion**: Millions of dollars in government loans, crop insurance, and subsidies go unclaimed because policy documents are complex, paper-heavy, and rarely published in local languages.

### **Chatbots are not the solution.**
Farmers do not have the time to type complex queries, copy-paste outputs, or coordinate different advice tools. They need an **autonomous operating system** that monitors, predicts, plans, and delivers ready-to-execute action items on a single screen.

---

## 🤖 The AgriGuardian Swarm Solution

**AgriGuardian Swarm** is an autonomous multi-agent AI operating system. 
Rather than operating as a simple QA chatbot, it coordinates **12 specialized AI agents** that run continuously in the background, collaborating with each other to analyze farm conditions, mitigate environmental risks, match government support, calculate local market prices, and deliver a single, unified farm action plan.

The farmer inputs their farm profile **once**. After that, the swarm works for them.

---

## 🏗️ System Architecture

The platform uses a **Coordinator-Worker multi-agent pattern** built on Google's Gemini 1.5 Flash. The React frontend communicates with a FastAPI server that manages the agent state machine, SQLite transactional database, and FAISS vector index.

![System Architecture](docs/architecture.png)

---

## 🔄 The 10-Agent Crop Scan Pipeline

When a farmer uploads a photo of a crop disease, they do not get a simple classification label. The upload triggers a **10-agent sequential reflection and collaboration workflow** that completes in under 8 seconds:

![Agent Flow Diagram](docs/flow.png)

1. **Vision Agent (Gemini Vision API)**: Analyzes the crop photograph, identifies the pathogen (e.g., Early Blight), computes severity percentage, and writes a detailed clinical diagnostic summary.
2. **Weather Agent**: Reads the local 7-day weather forecast and alerts the swarm if upcoming rain or humidity will accelerate the pathogen's spread.
3. **Risk Agent**: Compiles the diagnosis and weather data to calculate the yield loss risk percentage if left untreated.
4. **Planning Agent**: Formulates a detailed, day-by-day 7-day chemical and biological treatment calendar.
5. **Government Scheme Agent**: Queries the FAISS vector database to match the crop damage profile with eligible insurance coverages (e.g., PMFBY) and claims support.
6. **Market Agent**: Looks up regional market price trends for tomatoes to estimate the salvage value of the crop.
7. **Memory Agent**: Commits the entire event to the SQLite history log to maintain historical context for future seasons.
8. **Notification Agent**: Establishes scheduled alerts for daily fertilizer, watering, and treatment tasks.
9. **Report Agent**: Compiles all outputs and triggers a PDF rendering engine (ReportLab) to build a downloadable farm report.
10. **Coordinator Agent**: Synthesizes the outputs of the 9 specialist agents into a clean, concise, single-screen action card.

---

## 🧠 The 12 Agent Specialists

Each agent inside the swarm is configured with a distinct prompt, agronomical persona, memory context, and specific tools:

| Agent | Agronomical Persona | Primary Responsibility |
|---|---|---|
| **1. Coordinator** | Lead Agricultural Architect | Synthesizes complex specialist agent outputs into a unified action plan. |
| **2. Vision Agent** | Plant Pathologist AI | Classifies diseases, nutrient deficiencies, and pests from crop images. |
| **3. Weather Agent** | Agrometeorologist | Analyzes weather patterns to optimize irrigation and warn of frost/heatwaves. |
| **4. Risk Agent** | Agricultural Actuary | Evaluates compound risks (crop failure, water scarcity, cost overruns). |
| **5. Planning Agent** | Agronomy Planner | Designs daily task schedules, fertilizer application dates, and crop rotations. |
| **6. Market Agent** | Commodity Economist | Tracks mandi (market) prices, predicts price trends, and calculates net profit margins. |
| **7. GovScheme Agent** | Policy Consultant | Queries vector embeddings to find applicable subsidies, loans, and machinery support. |
| **8. Memory Agent** | Historical Archivist | Tracks historical farm profiles and queries past diagnoses using vector similarity. |
| **9. Notification Agent** | Alert Dispatcher | Manages and delivers SMS/browser push alerts for crucial farm deadlines. |
| **10. Report Agent** | PDF Compiler | Compiles metrics and outputs into formatted PDF files for bank loans or insurance. |
| **11. Sustainability Agent** | Eco-Agronomist | Computes soil health scores, carbon footprints, and water usage efficiency. |
| **12. Profile Agent** | Registrar Officer | Manages onboarding data, soil pH records, irrigation details, and farmer settings. |

---

## 🌿 Social Impact & UN SDG Alignment

Designed specifically for the **Google × Kaggle Agents for Good** track, AgriGuardian Swarm directly addresses 5 United Nations Sustainable Development Goals:

* 🌾 **SDG 2: Zero Hunger**
  * Optimizes food security by identifying diseases early, raising crop yields by an estimated **15% to 25%** per farm.
* 💰 **SDG 1: No Poverty**
  * Increases farmer profitability by matching them to government subsidies and warning them of market price drops, preventing cycle-of-debt crashes.
* 🚰 **SDG 6: Clean Water and Sanitation**
  * Encourages micro-drip irrigation patterns through the Weather Agent's predictive watering recommendations, reducing water waste by up to **60%** compared to traditional flood irrigation.
* ⚖️ **SDG 10: Reduced Inequalities**
  * Democratizes agricultural consultancy. The multilingual voice command interface (supporting English, Hindi, and Punjabi) makes expert advice accessible to farmers with low literacy or limited English skills.
* 🌍 **SDG 13: Climate Action**
  * The Sustainability Agent calculates and tracks the carbon footprint of fertilizer usage and machinery, encouraging eco-friendly crop rotation patterns.

---

## 🛠️ Technical Stack

* **Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion (for smooth micro-animations and live agent thought logs), Recharts (for yield and expense dashboards).
* **Backend**: FastAPI (Python), SQLAlchemy ORM (SQLite DB), native `bcrypt` library (secure user authentication), ReportLab (automated PDF compilation).
* **AI & Search**: Google Gemini 1.5 Flash + Gemini Vision, FAISS (Facebook AI Similarity Search) vector DB for semantic RAG of policy documents.
* **Deployment**: Frontend deployed on **Vercel**, Backend deployed on **Render**.

---

## ⚙️ Quick Start (Local Setup)

### **Windows (One-Click Launch)**
We have packaged a batch script that handles dependencies, virtual environments, seeding, and execution automatically:
1. Double-click the [START.bat](START.bat) file in the root folder.
2. The script will open a browser window automatically at `http://localhost:3000`.
3. Log in with the pre-seeded credentials:
   * **Email**: `farmer@agriguardian.com`
   * **Password**: `farmer123`

---

### **Mac / Linux (Manual Setup)**

#### **1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/agriguardian-swarm.git
cd agriguardian-swarm
```

#### **2. Start the Backend (FastAPI)**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*The database will auto-seed with a default user, farm, fields, and default data.*

#### **3. Start the Frontend (Next.js)**
Open a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and log in using:
* **Email**: `farmer@agriguardian.com`
* **Password**: `farmer123`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*Built with passion for the Google × Kaggle AI Agents Capstone. Empowering those who feed the world.*
