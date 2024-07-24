from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.db.models import Film, Watchlist


def create_film(
    db: Session,
    lb_id: int = None,
    lb_slug: str = None,
    kp_russian_title: str = None,
    kp_english_title: str = None,
    kp_director_name_rus: str = None,
    kp_year: int = None,
):
    db_film = Film(
        lb_id=lb_id,
        lb_slug=lb_slug,
        kp_russian_title=kp_russian_title,
        kp_english_title=kp_english_title,
        kp_director_name_rus=kp_director_name_rus,
        kp_year=kp_year,
    )
    db.add(db_film)
    db.commit()
    db.refresh(db_film)
    return db_film


def add_film_to_watchlist(db: Session, user_id: int, film_id: int):
    existing_entry = (
        db.query(Watchlist).filter_by(user_id=user_id, film_id=film_id).first()
    )
    if existing_entry is not None:
        return existing_entry

    watchlist_entry = Watchlist(user_id=user_id, film_id=film_id)
    db.add(watchlist_entry)
    try:
        db.commit()
        db.refresh(watchlist_entry)
    except IntegrityError:
        db.rollback()
        raise
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
    return [
        {"slug": row.lb_slug, "kp_english_title": row.kp_english_title}
        for row in results
    ]
