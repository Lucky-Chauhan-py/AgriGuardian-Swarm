from sqlalchemy.orm import Session
from app.database import Notification
import datetime

class NotificationAgent:
    def __init__(self):
        self.name = "Notification Agent"
        self.role = "Proactive Alert Dispatcher"

    def run(self, db: Session, user_id: int, triggers: list) -> dict:
        """
        Schedules and saves critical notifications (weather alerts, treatment reminders) to the DB.
        """
        thoughts = [
            f"Scanning triggers for User ID: {user_id}.",
            "Mapping risk alerts and schedules into persistent notifications."
        ]

        created_notifications = []

        for trigger in triggers:
            trigger_type = trigger.get("type", "info")
            title = trigger.get("title", "Alert")
            message = trigger.get("message", "Details")

            # Check if notification already exists to avoid duplicates (optional, but clean)
            notification = Notification(
                user_id=user_id,
                title=title,
                message=message,
                type=trigger_type,
                is_read=False,
                created_at=datetime.datetime.utcnow()
            )
            db.add(notification)
            created_notifications.append({
                "title": title,
                "message": message,
                "type": trigger_type
            })

        db.commit()
        thoughts.append(f"Dispatched {len(created_notifications)} proactive notifications to user feed.")

        return {
            "agent": self.name,
            "thoughts": thoughts,
            "status": "success",
            "output": {
                "notifications_sent": created_notifications
            }
        }

notification_agent = NotificationAgent()
