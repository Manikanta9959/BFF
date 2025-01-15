"""
This module contains all functions which are concerned with connecting to SQL Db
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.settings import settings

engine = create_engine(settings.SQLALCHEMY_DATABASE_URL, pool_recycle=3600, pool_size=5, max_overflow=0)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
class GetSQLDB:

    def __init__(self):
        # Initialize flags
        self._db = None
        
    def __call__(self):
        """
        Connects to the DB and yields the appropriate session(s).
        """
        try:
            self._db = SessionLocal()
            yield self._db
        finally:
            self._db.close()

    def __enter__(self):
        self._db = SessionLocal()
        return self._db
        
    def __exit__(self, exc_type, exc_value, traceback):
        self._db.close()