from sqlalchemy import Column, Integer, String
from .db import Base


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    url = Column(String, index=True)


class Film(Base):
    __tablename__ = "films"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    year = Column(String, index=True)
    username = Column(String, index=True)
