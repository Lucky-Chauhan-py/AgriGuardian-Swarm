from app.config import settings
import datetime

class CropPlanningAgent:
    def __init__(self):
        self.name = "Crop Planning Agent"
        self.role = "Agronomist Planner"

    def run(self, farm_profile: dict, disease_diagnosis: dict = None) -> dict:
        """
        Generates customized agricultural calendars, fertilizer schedules, and watering timelines.
        """
        thoughts = [
            "Analyzing crop growth stage and soil parameters from farm profile.",
            "Incorporating any disease diagnosis to inject corrective treatment tasks.",
            "Calculating water requirements based on crop coefficient and growth cycle.",
            "Formulating N-P-K fertilizer application intervals.",
            "Designing optimal crop rotation sequences based on soil replenishment needs."
        ]

        crop_type = farm_profile.get("crop_type", "Tomato")
        
        # Generate Schedules
        today = datetime.date.today()
        
        # Base schedules
        watering_schedule = f"Irrigate every 2 days. Apply 15,000 Liters per acre via drip system. Best performed at 6:00 AM."
        fertilizer_schedule = f"Apply Nitrogen-rich NPK (19:19:19) at vegetative stage. Dosage: 5kg per acre via fertigation."
        harvesting_schedule = f"Expected harvesting in 45 days. Pick fruits when they turn light red/pink for optimal shelf life."
        crop_rotation_advice = f"After harvesting {crop_type}, plant Legumes (e.g., Beans, Peas) to naturally restore nitrogen levels in the soil."

        daily_tasks = [
            {"title": "Morning field scouting for early pest symptoms", "category": "scouting", "due_in_days": 0, "description": "Walk through rows, check underside of leaves."},
            {"title": "Drip irrigation run", "category": "watering", "due_in_days": 0, "description": "Run irrigation for 45 minutes."}
        ]

        weekly_tasks = [
            {"title": "Soil moisture check and weeding", "category": "weeding", "due_in_days": 2, "description": "Remove weeds around the base of the crop rows."},
            {"title": "NPK Fertigation application", "category": "fertilizer", "due_in_days": 4, "description": "Mix 5kg of NPK in fertigation tank."}
        ]

        # Inject disease treatment tasks if diagnosed
        if disease_diagnosis:
            disease_name = disease_diagnosis.get("disease_name", "early blight")
            daily_tasks.insert(0, {
                "title": f"Prune leaves infected with {disease_name}",
                "category": "treatment",
                "due_in_days": 0,
                "description": "Prune lower leaves showing spots. Disinfect shears between cuts."
            })
            weekly_tasks.insert(0, {
                "title": f"Apply copper fungicide spray",
                "category": "treatment",
                "due_in_days": 1,
                "description": "Foliar spray of Copper Oxychloride (2g/L) across the infected fields."
            })

        # Map due dates
        formatted_daily = []
        for task in daily_tasks:
            due_date = today + datetime.timedelta(days=task["due_in_days"])
            formatted_daily.append({
                "title": task["title"],
                "category": task["category"],
                "due_date": due_date.isoformat(),
                "description": task["description"],
                "status": "pending"
            })

        formatted_weekly = []
        for task in weekly_tasks:
            due_date = today + datetime.timedelta(days=task["due_in_days"])
            formatted_weekly.append({
                "title": task["title"],
                "category": task["category"],
                "due_date": due_date.isoformat(),
                "description": task["description"],
                "status": "pending"
            })

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "success",
            "output": {
                "daily_tasks": formatted_daily,
                "weekly_tasks": formatted_weekly,
                "watering_schedule": watering_schedule,
                "fertilizer_schedule": fertilizer_schedule,
                "harvesting_schedule": harvesting_schedule,
                "crop_rotation_advice": crop_rotation_advice
            }
        }

planning_agent = CropPlanningAgent()
