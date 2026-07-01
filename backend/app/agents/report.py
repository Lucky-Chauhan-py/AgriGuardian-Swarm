from app.config import settings
from app.services.pdf_service import pdf_service
import datetime

class ReportAgent:
    def __init__(self):
        self.name = "Report Agent"
        self.role = "Farm Analytics Compiler"

    def run(self, farm_profile: dict, analytics_data: dict, tasks: list = None) -> dict:
        """
        Compiles analytical data and triggers PDF report generation.
        """
        thoughts = [
            "Gathering farm performance history and yield predictions.",
            "Structuring financial data: calculating expense-to-income forecasts.",
            "Invoking the PDF service to compile a publication-ready PDF.",
            "Returning the downloadable path and JSON summary to the Coordinator."
        ]

        farm_name = farm_profile.get("name", "Guardian Farm Alpha")
        crop_type = farm_profile.get("crop_type", "Tomato")
        
        # Calculate yield and financial predictions
        size = farm_profile.get("size_acres", 1.0)
        yield_tons = round(size * 12.5, 1)  # 12.5 tons per acre mock
        estimated_revenue = int(yield_tons * 10 * 2200)  # 10 q/ton * 2200 Rs/q
        estimated_expenses = int(size * 8000 + 5000)  # 8000 Rs/acre + base
        estimated_profit = estimated_revenue - estimated_expenses

        report_data = {
            "farm_name": farm_name,
            "farmer_name": farm_profile.get("farmer_name", "Farmer"),
            "date": datetime.date.today().strftime("%B %d, %Y"),
            "crop_health_score": analytics_data.get("crop_health_score", 88),
            "sustainability_score": analytics_data.get("sustainability_score", 78),
            "active_tasks_count": len(tasks) if tasks else 2,
            "soil_status": farm_profile.get("soil_type", "Sandy Loam, pH 6.5"),
            "market_recommendation": "Market trends show high demand for quality tomatoes. Direct transport to Bareilly Mandi recommended.",
            "ai_insights": [
                f"Your yield prediction is {yield_tons} tons for {crop_type}.",
                f"Net profit is estimated at ₹{estimated_profit:,} with a ROI of {round((estimated_profit/estimated_expenses)*100, 1)}%.",
                "Water usage efficiency is high. Keep drip irrigation schedules active."
            ],
            "tasks": tasks or [
                {"title": "Apply copper fungicide foliar spray", "category": "treatment", "due_date": "Tomorrow", "status": "Pending"},
                {"title": "Check drip irrigation lines for leaks", "category": "watering", "due_date": "In 2 days", "status": "Pending"}
            ]
        }

        file_name = f"report_{farm_profile.get('id', 1)}_{datetime.date.today().isoformat()}.pdf"
        
        try:
            pdf_path = pdf_service.generate_report_pdf(report_data, file_name)
            # Create a web-accessible URL path
            web_path = f"/static/reports/{file_name}"
        except Exception as e:
            print(f"Report generation error: {e}")
            web_path = None

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "success",
            "output": {
                "report_title": f"Intelligence Report - {farm_name}",
                "pdf_url": web_path,
                "summary": report_data["ai_insights"],
                "financials": {
                    "yield_prediction_tons": yield_tons,
                    "estimated_revenue": estimated_revenue,
                    "estimated_expenses": estimated_expenses,
                    "estimated_profit": estimated_profit
                }
            }
        }

report_agent = ReportAgent()
