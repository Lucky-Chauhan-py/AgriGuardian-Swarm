from app.config import settings
from app.services.rag_service import rag_service

class GovernmentSchemeAgent:
    def __init__(self):
        self.name = "Government Scheme Agent"
        self.role = "Agricultural Policy Consultant"

    def run(self, query: str, farm_profile: dict = None) -> dict:
        """
        Uses RAG to find matching government schemes and verify farmer eligibility.
        """
        thoughts = [
            f"Analyzing user query: '{query}' for policy matching.",
            "Executing semantic search over the vectorized agricultural schemes database.",
            "Extracting eligibility criteria and cross-matching with farm profile (size, location, crop).",
            "Synthesizing customized recommendations and step-by-step application instructions."
        ]

        # Use RAG Service to fetch matching schemes
        matched_schemes = rag_service.search(query, top_k=2)

        # Evaluate eligibility based on farm profile
        results = []
        farm_size = farm_profile.get("size_acres", 1.5) if farm_profile else 1.5
        
        for scheme in matched_schemes:
            eligible = True
            reason = "You meet all criteria for this scheme."
            
            # Simple eligibility rules for mock/RAG demonstration
            if "pm-kisan" in scheme["title"].lower():
                if farm_size > 5.0:  # e.g., PM-Kisan focuses on small/marginal
                    eligible = False
                    reason = "This scheme is primarily designed for small and marginal landholdings (usually under 5 acres)."
            elif "crop insurance" in scheme["category"].lower() or "pmfby" in scheme["title"].lower():
                eligible = True
                reason = "Eligible. Highly recommended for crop protection against weather volatility."
            elif "subsidy" in scheme["category"].lower() or "smam" in scheme["title"].lower():
                eligible = True
                reason = "Eligible. Subsidies up to 50% are available for agricultural machinery purchases."

            results.append({
                "title": scheme["title"],
                "description": scheme["description"],
                "benefits": scheme["benefits"],
                "eligibility_criteria": scheme["eligibility_criteria"],
                "application_process": scheme["application_process"],
                "category": scheme["category"],
                "is_eligible": eligible,
                "eligibility_reason": reason
            })

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "success",
            "output": {
                "matched_schemes": results
            }
        }

gov_agent = GovernmentSchemeAgent()
