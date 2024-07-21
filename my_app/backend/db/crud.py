from sqlalchemy import func
from sqlalchemy.orm import Session

from my_app.backend.db.models import Film


def create_film(db: Session, title: str, lb_id: str, username: str):
    db_film = Film(title=title, lb_id=lb_id, username=username)
    db.add(db_film)
    db.commit()
    db.refresh(db_film)
    return db_film


def get_watchlist(db: Session, username: str):
    return db.query(Film).filter(Film.username == username).all()


def get_watchlist_intersection(db: Session, usernames: list):
    subquery = (
        db.query(Film.title, func.count(Film.username).label("user_count"))
        .filter(Film.username.in_(usernames))
        .group_by(Film.title)
        .subquery()
    )

    query = db.query(subquery.c.title).filter(subquery.c.user_count == len(usernames))

    results = query.all()
    return [row.title for row in results]
