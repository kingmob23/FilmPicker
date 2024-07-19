from sqlalchemy import Column, Integer, String
from .db import Base


class Film(Base):
    __tablename__ = "films"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    year = Column(String, index=True)
    username = Column(String, index=True)
