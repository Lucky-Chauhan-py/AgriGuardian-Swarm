from sqlalchemy.orm import Session
from app.database import Memory, Chat
import json

class MemoryAgent:
    def __init__(self):
        self.name = "Memory Agent"
        self.role = "Context & Memory Custodian"

    def run(self, db: Session, farm_id: int, action: str = "retrieve", key: str = None, value: str = None) -> dict:
        """
        Manages long-term farm memory and user preference context.
        """
        thoughts = [
            f"Accessing long-term memory registries for Farm ID: {farm_id}.",
            f"Performing memory action: '{action}' on key: '{key}'."
        ]

        if action == "save" and key and value:
            # Check if key exists
            mem_entry = db.query(Memory).filter(Memory.farm_id == farm_id, Memory.key == key).first()
            if mem_entry:
                mem_entry.value = value
            else:
                mem_entry = Memory(farm_id=farm_id, key=key, value=value)
                db.add(mem_entry)
            db.commit()
            thoughts.append(f"Successfully committed memory value to persistent database.")
            return {
                "agent": self.name,
                "thoughts": thoughts,
                "status": "success",
                "output": {"message": f"Memory '{key}' saved successfully."}
            }
        
        elif action == "retrieve" and key:
            mem_entry = db.query(Memory).filter(Memory.farm_id == farm_id, Memory.key == key).first()
            val = mem_entry.value if mem_entry else None
            thoughts.append(f"Retrieved value for key '{key}': '{val}'")
            return {
                "agent": self.name,
                "thoughts": thoughts,
                "status": "success",
                "output": {"key": key, "value": val}
            }
            
        elif action == "retrieve_all":
            memories = db.query(Memory).filter(Memory.farm_id == farm_id).all()
            mem_dict = {m.key: m.value for m in memories}
            thoughts.append(f"Retrieved {len(mem_dict)} active memory contexts.")
            return {
                "agent": self.name,
                "thoughts": thoughts,
                "status": "success",
                "output": mem_dict
            }

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "error",
            "message": "Invalid memory action specified."
        }

memory_agent = MemoryAgent()
