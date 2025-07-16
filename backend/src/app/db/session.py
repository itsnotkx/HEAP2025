from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from core.config import settings  # Where DB URL is stored
# Create engine
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, echo=False)

# Create a configured "SessionLocal" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get a session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
