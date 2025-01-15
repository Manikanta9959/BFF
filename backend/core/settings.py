from decouple import config
from pydantic import BaseSettings


def get_service_details():
    return {
        "title": "testing",
        "description": "Typeface",
        "docs_url" : "/docs/doc",
        "redoc_url" : "/docs/redoc",
        "contact": {
            "name": "typeface-support",
        }
    }


class Settings(BaseSettings):
    VERSION: str = config("VERSION")
    
    API_V1_STR: str = "/api/v1"
        
    SQLALCHEMY_DATABASE_URL: str = config("MYSQL_URI")
    
    REDIS_URL: str = config("REDIS_URI")
    
    DB_POOLSIZE: int = config("DB_POOLSIZE", cast=int, default = 5)
    DB_MAXOVERFLOW : int = config("DB_MAXOVERFLOW", cast=int, default = 10)

    class Config:
        case_sensitive = True


settings = Settings()