from sqlalchemy import Column, Integer, String, ForeignKey, BigInteger, TIMESTAMP, create_engine
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

# Users Model
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # Relationship to link with files
    files = relationship('File', back_populates='user', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


# Files Model
class File(Base):
    __tablename__ = 'files'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    uploaded_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    # Relationship to link with user
    user = relationship('User', back_populates='files')

    def __repr__(self):
        return f"<File(id={self.id}, file_name='{self.file_name}', user_id={self.user_id})>"
