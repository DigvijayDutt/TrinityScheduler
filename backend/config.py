from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "trinityscheduler"
    DATABASE_USER: str = "admin"
    DATABASE_PASSWORD: str = "admin123"
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    CORS_ORIGINS: str = "*"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
