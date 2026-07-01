import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriGuardian Swarm API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkeyforagriguardianswarmjwt")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agriguardian.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # We will support offline/mock mode if no key is provided
    MOCK_AI: bool = True if not os.getenv("GEMINI_API_KEY") else False

    class Config:
        case_sensitive = True

settings = Settings()
