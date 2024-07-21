from sqlalchemy import Column, Integer, String

from .database import Base


class Film(Base):
    __tablename__ = "films"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    lb_id = Column(String, index=True)
    username = Column(String, index=True)
