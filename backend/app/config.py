import os
from pydantic_settings import BaseSettings

# Resolve absolute path to the backend directory so the DB file is always in the same place
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DEFAULT_DB_PATH = f"sqlite:///{os.path.join(_BACKEND_DIR, 'agriguardian.db')}"

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriGuardian Swarm API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkeyforagriguardianswarmjwt")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    # Use absolute path by default so DB file survives working-directory changes on restart
    DATABASE_URL: str = os.getenv("DATABASE_URL", _DEFAULT_DB_PATH)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # We will support offline/mock mode if no key is provided
    MOCK_AI: bool = True if not os.getenv("GEMINI_API_KEY") else False

    class Config:
        case_sensitive = True

settings = Settings()
