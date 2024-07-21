from sqlalchemy import Column, ForeignKey, Integer, String

from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)


class Film(Base):
    __tablename__ = "films"
    id = Column(Integer, primary_key=True, index=True)
    lb_id = Column(Integer, index=True)
    slug = Column(String, index=True)


class Watchlist(Base):
    __tablename__ = "watchlist_films"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    film_id = Column(Integer, ForeignKey("films.id"), primary_key=True)
