from database import (
    SessionLocal,
    add_film_to_user_watchlist,
    create_film,
    create_user,
    get_user_watchlist,
)
from scraper.scraper.runner import run_spider


def handle_lb_link(link: str):
    data = run_spider(link)
    db = SessionLocal()
    user = create_user(db, data["username"])
    for film_title in data["films"]:
        film = create_film(db, film_title)
        add_film_to_user_watchlist(db, user.id, film.id)
    return get_user_watchlist(db, user.id)
