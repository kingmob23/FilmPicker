from sqlalchemy.orm import Session
from my_app.app.models import Film

def create_film(db: Session, title: str, year: str, username: str):
    db_film = Film(title=title, year=year, username=username)
    db.add(db_film)
    db.commit()
    db.refresh(db_film)
    return db_film

def get_watchlist(db: Session, username: str):
    return db.query(Film).filter(Film.username == username).all()
