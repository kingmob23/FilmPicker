from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.db.models import Film, User, Watchlist


def create_film(db: Session, lb_id: int, slug: str):
    db_film = Film(lb_id=lb_id, slug=slug)
    db.add(db_film)
    db.commit()
    db.refresh(db_film)
    return db_film


def add_film_to_watchlist(db: Session, user_id: int, film_id: int):
    watchlist_entry = Watchlist(user_id=user_id, film_id=film_id)
    db.add(watchlist_entry)
    db.commit()
    db.refresh(watchlist_entry)
    return watchlist_entry


def get_user_watchlist(db: Session, user_id: int):
    return db.query(Film).join(Watchlist).filter(Watchlist.user_id == user_id).all()


def get_watchlist_intersection(db: Session, user_ids: list):
    subquery = (
        db.query(Watchlist.film_id, func.count(Watchlist.user_id).label("user_count"))
        .filter(Watchlist.user_id.in_(user_ids))
        .group_by(Watchlist.film_id)
        .subquery()
    )

    query = (
        db.query(Film)
        .join(subquery, Film.id == subquery.c.film_id)
        .filter(subquery.c.user_count == len(user_ids))
    )

    results = query.all()
    return [{"slug": row.slug} for row in results]
