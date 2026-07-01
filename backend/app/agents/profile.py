from sqlalchemy.orm import Session
from app.database import Farm, Field

class FarmProfileAgent:
    def __init__(self):
        self.name = "Farm Profile Agent"
        self.role = "Farm Registry Officer"

    def run(self, db: Session, farm_id: int) -> dict:
        """
        Retrieves farm details, crops, and fields to construct a comprehensive profile context.
        """
        thoughts = [
            f"Querying farm registry for Farm ID: {farm_id}.",
            "Mapping soil type, irrigation systems, and active field plantings."
        ]

        farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if not farm:
            return {
                "agent": self.name,
                "thoughts": thoughts,
                "status": "error",
                "message": "Farm profile not found."
            }

        # Query fields/crops
        fields = db.query(Field).filter(Field.farm_id == farm_id).all()
        field_list = []
        primary_crop = "Tomato"  # Default
        for f in fields:
            field_list.append({
                "id": f.id,
                "name": f.name,
                "crop_type": f.crop_type,
                "crop_variety": f.crop_variety,
                "planting_date": f.planting_date.isoformat() if f.planting_date else None,
                "status": f.status
            })
            if f.status == "active":
                primary_crop = f.crop_type

        profile = {
            "id": farm.id,
            "name": farm.name,
            "location": farm.location or "Bareilly, Uttar Pradesh",
            "size_acres": farm.size_acres,
            "soil_type": farm.soil_type or "Loamy",
            "water_source": farm.water_source or "Borewell",
            "irrigation_type": farm.irrigation_type or "Drip",
            "fields": field_list,
            "crop_type": primary_crop
        }

        thoughts.append(f"Profile compiled: crop='{primary_crop}', size={farm.size_acres} acres.")

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "success",
            "output": profile
        }

profile_agent = FarmProfileAgent()
