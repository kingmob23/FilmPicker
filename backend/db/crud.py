from tkinter import NO
from typing import Optional

from backend.db.models import Film, User, Watchlist
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


def get_or_create_user(db: Session, username: str) -> User:
    user = db.query(User).filter(User.username == username).first()
    if not user:
        db_user = User(username=username)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    return user


def get_or_create_film_record(db: Session, movie, type: str) -> Film:
    film = None
    if type == "lb":
        film = db.query(Film).filter(Film.lb_id == movie.lb_film_id).first()
        if not film:
            film = Film(lb_id=movie.lb_film_id, lb_slug=movie.film_slug)
    elif type in ["kp", "ayz"]:
        film = (
            db.query(Film).filter(Film.kp_russian_title == movie.russian_title).first()
        )
        if not film:
            film = Film(
                kp_russian_title=movie.russian_title,
                kp_english_title=movie.english_title,
                kp_director_name_rus=movie.director_name_rus,
                kp_year=movie.year,
            )
    if film is None:
        db.add(film)
        db.commit()
        db.refresh(film)
    return film


def add_film_to_watchlist(db: Session, user_id: int, film_id: int) -> Watchlist:
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


def clear_user_watchlist(db: Session, user_id: int):
    db.query(Watchlist).filter(Watchlist.user_id == user_id).delete()
    db.commit()
