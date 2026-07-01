from app.config import settings

class RiskAnalysisAgent:
    def __init__(self):
        self.name = "Risk Analysis Agent"
        self.role = "Agricultural Risk Actuary"

    def run(self, farm_profile: dict, weather_data: dict, vision_data: dict = None) -> dict:
        """
        Synthesizes information to calculate risk quotients and preventive guidelines.
        """
        thoughts = [
            "Correlating weather humidity forecasts with current crop disease status to calculate spread probability.",
            "Analyzing crop water demand against forecasted rainfall to estimate water shortage risk.",
            "Assessing soil profile data and irrigation capacity to evaluate crop failure index.",
            "Cross-referencing market price volatility to flag potential revenue crashes."
        ]

        # Calculate disease spread probability
        disease_detected = vision_data is not None
        has_rain_forecast = False
        if weather_data and "output" in weather_data:
            for day in weather_data["output"].get("forecast", []):
                if day.get("rain_prob", 0) > 60:
                    has_rain_forecast = True
                    break

        disease_spread_prob = 0.20
        if disease_detected:
            disease_spread_prob = 0.75 if has_rain_forecast else 0.45

        # Yield reduction estimate
        yield_reduction_pct = 5.0
        if disease_detected:
            severity = vision_data["output"].get("severity_score", 0.5)
            yield_reduction_pct = round(severity * 35.0, 1)

        # High-fidelity risk meters
        risks = {
            "disease_outbreak": {
                "level": "High" if disease_spread_prob > 0.6 else "Medium" if disease_spread_prob > 0.3 else "Low",
                "probability": disease_spread_prob,
                "preventive_action": "Apply organic/chemical fungicide immediately. Prune infected leaves. Stop overhead irrigation."
            },
            "water_shortage": {
                "level": "Low",
                "probability": 0.15,
                "preventive_action": "Ensure mulching is applied to retain soil moisture. Transition to drip lines."
            },
            "crop_failure": {
                "level": "Medium" if disease_detected and disease_spread_prob > 0.6 else "Low",
                "probability": 0.35 if disease_detected else 0.10,
                "preventive_action": "Monitor daily. Prepare soil drenches. Isolate infected crop rows."
            },
            "market_crash": {
                "level": "Low",
                "probability": 0.08,
                "preventive_action": "Review contract farming options. Consider storage in cold warehouses to delay selling if prices drop."
            },
            "yield_reduction": {
                "pct": yield_reduction_pct,
                "level": "High" if yield_reduction_pct > 25 else "Medium" if yield_reduction_pct > 10 else "Low",
                "preventive_action": "Foliar spray of micronutrients to boost plant immunity and recover vegetative growth."
            }
        }

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "success",
            "output": {
                "risks": risks,
                "overall_risk_score": round((disease_spread_prob * 0.4 + 0.15 * 0.1 + 0.35 * 0.3 + 0.08 * 0.2) * 100, 1)
            }
        }

risk_agent = RiskAnalysisAgent()
