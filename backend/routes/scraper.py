import logging
import random

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db.crud import (
    add_film_to_watchlist,
    create_film,
    get_user_watchlist,
    get_watchlist_intersection,
)
from backend.db.database import get_db
from backend.db.models import Film, User
from backend.utils.scraper import scrape_watchlist

router = APIRouter()


class Username(BaseModel):
    name: str
    type: str
    refresh: bool


class ScrapeRequest(BaseModel):
    usernames: list[Username]


class ScrapeResponse(BaseModel):
    intersection_len: int
    intersection: list[str]


@router.post("/scrape/", response_model=ScrapeResponse)
async def scrape_and_store_watchlists(
    request: ScrapeRequest, db: Session = Depends(get_db)
) -> ScrapeResponse:
    logging.info(f"Started processing request {request}")
    user_ids = []

    for username in request.usernames:
        logging.info(f"Received request to scrape watchlist for user: {username}")

        user = db.query(User).filter(User.username == username.name).first()
        if not user:
            user = User(username=username.name)
            db.add(user)
            db.commit()
            db.refresh(user)

        user_ids.append(user.id)

        user_watchlist = get_user_watchlist(db, user.id)
        if user_watchlist:
            logging.info(
                f"Found existing watchlist for user: {username} in the database"
            )
            continue

        try:
            watchlist = scrape_watchlist(username.name)
            if not watchlist:
                raise HTTPException(status_code=404, detail="Watchlist is empty")

            logging.info(
                f"Successfully scraped watchlist for user: {username.name}, found {len(watchlist)} items"
            )

            for wl in watchlist:
                film = db.query(Film).filter(Film.lb_id == wl.lb_film_id).first()
                if not film:
                    film = create_film(db, wl.lb_film_id, wl.film_slug)

                add_film_to_watchlist(db, user.id, film.id)

        except Exception as e:
            logging.error(f"Error scraping watchlist for user {username}: {e}")

    intersection = get_watchlist_intersection(db, user_ids)
    n = len(request.usernames) + 1
    random_intersection = random.sample(
        [item["slug"] for item in intersection], min(len(intersection), n)
    )

    return ScrapeResponse(
        intersection=random_intersection, intersection_len=len(intersection)
    )
