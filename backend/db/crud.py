from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.db.models import Film


def create_film(db: Session, lb_id: int, slug: str, username: str):
    db_film = Film(lb_id=lb_id, slug=slug, username=username)
    db.add(db_film)
    db.commit()
    db.refresh(db_film)
    return db_film


def get_watchlist(db: Session, username: str):
    return db.query(Film).filter(Film.username == username).all()


def get_watchlist_intersection(db: Session, usernames: list):
    subquery = (
        db.query(Film.slug, func.count(Film.username).label("user_count"))
        .filter(Film.username.in_(usernames))
        .group_by(Film.slug)
        .subquery()
    )

    query = db.query(subquery.c.slug).filter(subquery.c.user_count == len(usernames))

    results = query.all()
    return [{"slug": row.slug} for row in results]
