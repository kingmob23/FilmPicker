from sqlalchemy import Column, Integer, String

from .database import Base


class Film(Base):
    __tablename__ = "films"
    id = Column(Integer, primary_key=True, index=True)
    lb_id = Column(String, index=True)
    title = Column(String, index=True)
    slug = Column(String, index=True)
    year = Column(String, index=True)
    username = Column(String, index=True)
