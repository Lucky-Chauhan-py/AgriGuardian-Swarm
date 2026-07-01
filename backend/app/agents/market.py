from app.config import settings

class MarketIntelligenceAgent:
    def __init__(self):
        self.name = "Market Intelligence Agent"
        self.role = "Agri-Market Economist"

    def run(self, crop_type: str = "Tomato", state: str = "Uttar Pradesh", district: str = "Bareilly") -> dict:
        """
        Retrieves Mandi price trends and estimates revenue and profit opportunities.
        """
        thoughts = [
            f"Accessing regional Mandi pricing feeds for commodity: '{crop_type}' in {state}/{district}.",
            "Calculating weekly price velocity and identifying peak selling windows.",
            "Estimating transportation costs to nearby secondary markets.",
            "Formulating optimal selling recommendations based on supply-demand indices."
        ]

        # Mandi pricing database simulation
        price_db = {
            "Tomato": {"min": 1800, "max": 2500, "modal": 2200, "unit": "Quintal (100 kg)"},
            "Wheat": {"min": 2100, "max": 2300, "modal": 2245, "unit": "Quintal (100 kg)"},
            "Rice": {"min": 2000, "max": 2400, "modal": 2150, "unit": "Quintal (100 kg)"},
            "Potato": {"min": 1200, "max": 1600, "modal": 1400, "unit": "Quintal (100 kg)"}
        }

        crop_info = price_db.get(crop_type, {"min": 1500, "max": 2000, "modal": 1750, "unit": "Quintal"})

        # Markets simulation
        nearby_markets = [
            {"market_name": f"{district} Mandi", "distance_km": 8, "price": crop_info["modal"], "transport_cost_per_q": 50},
            {"market_name": "Lucknow Grain Market", "distance_km": 75, "price": crop_info["modal"] + 250, "transport_cost_per_q": 150},
            {"market_name": "Regional FPO Hub", "distance_km": 15, "price": crop_info["modal"] - 50, "transport_cost_per_q": 30}
        ]

        # Trend prediction
        market_trend = "Bullish" if crop_type in ["Tomato", "Wheat"] else "Stable"
        price_change_forecast_pct = 8.5 if market_trend == "Bullish" else 1.2
        selling_opportunity = (
            f"Hold harvesting/selling for 7-10 days if storage allows. "
            f"Prices are expected to rise by {price_change_forecast_pct}% due to lower arrivals in neighboring districts."
            if market_trend == "Bullish" else
            "Sell immediately. Market arrivals are steady and prices are expected to remain flat."
        )

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "success",
            "output": {
                "commodity": crop_type,
                "current_price": crop_info,
                "nearby_markets": nearby_markets,
                "market_trend": market_trend,
                "price_change_forecast_pct": price_change_forecast_pct,
                "selling_opportunity": selling_opportunity,
                "estimated_profit_per_q": crop_info["modal"] - 800  # Cost of cultivation mock: 800
            }
        }

market_agent = MarketIntelligenceAgent()
