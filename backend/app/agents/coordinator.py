from sqlalchemy.orm import Session
from app.agents.profile import profile_agent
from app.agents.vision import vision_agent
from app.agents.weather import weather_agent
from app.agents.risk import risk_agent
from app.agents.planning import planning_agent
from app.agents.gov_scheme import gov_agent
from app.agents.market import market_agent
from app.agents.memory import memory_agent
from app.agents.report import report_agent
from app.agents.notification import notification_agent
from app.agents.sustainability import sustainability_agent

class CoordinatorAgent:
    def __init__(self):
        self.name = "Coordinator Agent"
        self.role = "Swarm Orchestrator"

    def run_image_workflow(self, db: Session, farm_id: int, user_id: int, image_path: str, mock_disease: str = None) -> dict:
        """
        Executes the complete autonomous multi-agent workflow when a crop image is uploaded.
        """
        thought_logs = []
        
        # 1. Profile Agent
        thought_logs.append({"agent": self.name, "thought": "Initializing autonomous crop analysis workflow. Fetching farm profile."})
        profile_res = profile_agent.run(db, farm_id)
        thought_logs.extend([{"agent": profile_agent.name, "thought": t} for t in profile_res["thoughts"]])
        farm_profile = profile_res["output"]

        # 2. Vision Agent
        thought_logs.append({"agent": self.name, "thought": "Activating Vision Agent to analyze crop image."})
        vision_res = vision_agent.run(image_path, mock_disease=mock_disease)
        thought_logs.extend([{"agent": vision_agent.name, "thought": t} for t in vision_res["thoughts"]])
        diagnosis = vision_res["output"]

        # 3. Weather Agent
        thought_logs.append({"agent": self.name, "thought": "Querying Weather Agent for localized forecasting and risk assessment."})
        weather_res = weather_agent.run(farm_profile.get("location"))
        thought_logs.extend([{"agent": weather_agent.name, "thought": t} for t in weather_res["thoughts"]])

        # 4. Risk Agent
        thought_logs.append({"agent": self.name, "thought": "Requesting Risk Analysis Agent to evaluate spread probability and yield loss."})
        risk_res = risk_agent.run(farm_profile, weather_res, vision_res)
        thought_logs.extend([{"agent": risk_agent.name, "thought": t} for t in risk_res["thoughts"]])

        # 5. Planning Agent
        thought_logs.append({"agent": self.name, "thought": "Activating Crop Planning Agent to design a customized treatment calendar."})
        planning_res = planning_agent.run(farm_profile, diagnosis)
        thought_logs.extend([{"agent": planning_agent.name, "thought": t} for t in planning_res["thoughts"]])

        # 6. Government Agent
        thought_logs.append({"agent": self.name, "thought": "Invoking Government Scheme Agent to find matching subsidies or insurance schemes."})
        gov_res = gov_agent.run(f"crop disease subsidy {diagnosis.get('disease_name')}", farm_profile)
        thought_logs.extend([{"agent": gov_agent.name, "thought": t} for t in gov_res["thoughts"]])

        # 7. Market Agent
        thought_logs.append({"agent": self.name, "thought": "Querying Market Intelligence Agent for Mandi price outlooks."})
        market_res = market_agent.run(farm_profile.get("crop_type"), district=farm_profile.get("location").split(",")[0])
        thought_logs.extend([{"agent": market_agent.name, "thought": t} for t in market_res["thoughts"]])

        # 8. Sustainability Agent
        thought_logs.append({"agent": self.name, "thought": "Running Sustainability Agent to calculate water and carbon metrics."})
        sust_res = sustainability_agent.run(farm_profile)
        thought_logs.extend([{"agent": sustainability_agent.name, "thought": t} for t in sust_res["thoughts"]])

        # 9. Memory Agent (Save History)
        thought_logs.append({"agent": self.name, "thought": "Instructing Memory Agent to log this diagnostic event."})
        memory_val = {
            "disease": diagnosis.get("disease_name"),
            "severity": diagnosis.get("severity_score"),
            "diagnosed_at": datetime.date.today().isoformat()
        }
        memory_agent.run(db, farm_id, action="save", key=f"disease_history_{datetime.date.today().isoformat()}", value=str(memory_val))

        # 10. Notification Agent
        thought_logs.append({"agent": self.name, "thought": "Scheduling reminders for treatment and weather alerts."})
        triggers = [
            {
                "type": "alert",
                "title": f"Crop Disease: {diagnosis.get('disease_name')}",
                "message": f"Action Required: Apply treatment. Severity is high ({int(diagnosis.get('severity_score', 0)*100)}%)."
            },
            {
                "type": "reminder",
                "title": "Fungicide Spray Reminder",
                "message": "Reminder: Apply copper fungicide spray tomorrow morning."
            }
        ]
        notification_agent.run(db, user_id, triggers)

        # 11. Report Agent
        thought_logs.append({"agent": self.name, "thought": "Generating comprehensive PDF intelligence report."})
        analytics_mock = {"crop_health_score": int((1 - diagnosis.get("severity_score", 0.5) * 0.5) * 100), "sustainability_score": sust_res["output"]["sustainability_score"]}
        all_tasks = planning_res["output"]["daily_tasks"] + planning_res["output"]["weekly_tasks"]
        report_res = report_agent.run(farm_profile, analytics_mock, all_tasks)

        # Final unified plan presentation
        thought_logs.append({"agent": self.name, "thought": "Synthesizing all agent inputs into a single action plan."})

        return {
            "status": "success",
            "diagnosis": diagnosis,
            "weather": weather_res["output"],
            "risks": risk_res["output"],
            "tasks": planning_res["output"],
            "schemes": gov_res["output"]["matched_schemes"],
            "market": market_res["output"],
            "sustainability": sust_res["output"],
            "report": report_res["output"],
            "thought_logs": thought_logs
        }

    def run_text_workflow(self, db: Session, farm_id: int, user_id: int, question: str) -> dict:
        """
        Executes a dynamic multi-agent workflow based on farmer text/voice question.
        """
        thought_logs = []
        thought_logs.append({"agent": self.name, "thought": f"Received query: '{question}'. Analyzing intent."})

        # Fetch profile
        profile_res = profile_agent.run(db, farm_id)
        farm_profile = profile_res["output"]
        crop_type = farm_profile.get("crop_type", "Tomato")

        # Intent Routing
        q_lower = question.lower()
        if any(w in q_lower for w in ["price", "mandi", "market", "sell", "profit", "मंडी", "भाव"]):
            thought_logs.append({"agent": self.name, "thought": "Routing query to Market Intelligence Agent."})
            market_res = market_agent.run(crop_type, district=farm_profile.get("location").split(",")[0])
            thought_logs.extend([{"agent": market_agent.name, "thought": t} for t in market_res["thoughts"]])
            
            response_text = (
                f"Based on market analysis, the current price for {crop_type} is ₹{market_res['output']['current_price']['modal']}/Quintal. "
                f"The trend is {market_res['output']['market_trend']}. {market_res['output']['selling_opportunity']}"
            )
            return {
                "response": response_text,
                "thought_logs": thought_logs,
                "data": {"market": market_res["output"]}
            }

        elif any(w in q_lower for w in ["scheme", "subsidy", "loan", "gov", "yojana", "योजना", "लोन"]):
            thought_logs.append({"agent": self.name, "thought": "Routing query to Government Scheme Agent."})
            gov_res = gov_agent.run(question, farm_profile)
            thought_logs.extend([{"agent": gov_agent.name, "thought": t} for t in gov_res["thoughts"]])
            
            schemes = gov_res["output"]["matched_schemes"]
            if schemes:
                response_text = f"I found the following matching government scheme: **{schemes[0]['title']}**. Benefits: {schemes[0]['benefits']}. Eligibility: {schemes[0]['eligibility_reason']}"
            else:
                response_text = "I couldn't find any specific matching government schemes for your query at this moment."
            return {
                "response": response_text,
                "thought_logs": thought_logs,
                "data": {"schemes": schemes}
            }

        elif any(w in q_lower for w in ["weather", "rain", "temperature", "forecast", "मौसम", "बारिश"]):
            thought_logs.append({"agent": self.name, "thought": "Routing query to Weather Intelligence Agent."})
            weather_res = weather_agent.run(farm_profile.get("location"))
            thought_logs.extend([{"agent": weather_agent.name, "thought": t} for t in weather_res["thoughts"]])
            
            w_out = weather_res["output"]
            response_text = f"Current weather in {w_out['location']} is {w_out['current_temp_c']}°C, {w_out['current_humidity']}% humidity. Recommendation: {w_out['irrigation_recommendation']}"
            return {
                "response": response_text,
                "thought_logs": thought_logs,
                "data": {"weather": w_out}
            }

        else:
            # General fallback: Query memory and synthesize
            thought_logs.append({"agent": self.name, "thought": "Querying Memory Agent for past context."})
            mem_res = memory_agent.run(db, farm_id, action="retrieve_all")
            
            # Simple rules or Gemini generation
            thought_logs.append({"agent": self.name, "thought": "Synthesizing answer using agricultural base knowledge."})
            
            response_text = (
                f"Hello! I am monitoring your {crop_type} farm. "
                f"Your soil is {farm_profile['soil_type']} and you are using {farm_profile['irrigation_type']} irrigation. "
                f"Let me know if you would like me to analyze weather forecasts, check Mandi prices, or check eligibility for government schemes!"
            )
            return {
                "response": response_text,
                "thought_logs": thought_logs,
                "data": {}
            }

coordinator_agent = CoordinatorAgent()
import datetime
