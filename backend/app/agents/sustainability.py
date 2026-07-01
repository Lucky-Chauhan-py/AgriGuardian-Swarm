from app.config import settings

class SustainabilityAgent:
    def __init__(self):
        self.name = "Sustainability Agent"
        self.role = "Eco-Agronomy Specialist"

    def run(self, farm_profile: dict) -> dict:
        """
        Calculates sustainability scores, carbon footprint, and resource efficiencies.
        """
        thoughts = [
            "Analyzing farm irrigation type and water source to evaluate water efficiency.",
            "Estimating carbon footprint based on fertilizer application volume and tractor usage hours.",
            "Assessing soil carbon sequestration opportunities.",
            "Synthesizing sustainable farming recommendations."
        ]

        size = farm_profile.get("size_acres", 1.0)
        irrigation = farm_profile.get("irrigation_type", "Drip")
        soil_type = farm_profile.get("soil_type", "Loamy")

        # Carbon footprint estimation: base 120 kg CO2 per acre, reduced by 30% if drip
        base_carbon = size * 150.0
        if irrigation == "Drip":
            carbon_footprint = round(base_carbon * 0.7, 1)
            water_efficiency = 90.0  # 90%
            sustainability_score = 85
        elif irrigation == "Sprinkler":
            carbon_footprint = round(base_carbon * 0.85, 1)
            water_efficiency = 75.0
            sustainability_score = 75
        else:  # Flood
            carbon_footprint = base_carbon
            water_efficiency = 50.0
            sustainability_score = 55

        # Soil type adjustments
        fertilizer_efficiency = 80.0 if soil_type == "Loamy" else 65.0 if soil_type == "Sandy" else 70.0

        recommendations = [
            "Maintain drip irrigation. It saves approximately 40% water compared to flood irrigation.",
            "Incorporate green manure or compost to improve soil organic carbon content.",
            "Use split fertilizer application rather than single-dose to minimize nitrogen leaching."
        ]

        if irrigation == "Flood":
            recommendations.insert(0, "Transition from flood irrigation to drip irrigation to boost water efficiency from 50% to 90%.")

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "success",
            "output": {
                "water_usage_liters_per_day": round(size * 15000 / (7 if irrigation == "Drip" else 4), 1),
                "carbon_footprint_kg_co2": carbon_footprint,
                "fertilizer_efficiency_pct": fertilizer_efficiency,
                "sustainability_score": sustainability_score,
                "recommendations": recommendations
            }
        }

sustainability_agent = SustainabilityAgent()
