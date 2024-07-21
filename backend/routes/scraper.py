import logging
import random
from typing import List

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


class ScrapeRequest(BaseModel):
    usernames: List[str]


class ScrapeResponse(BaseModel):
    intersection_len: int
    intersection: List[str]


@router.post("/scrape/", response_model=ScrapeResponse)
async def scrape_and_store_watchlists(
    request: ScrapeRequest, db: Session = Depends(get_db)
) -> ScrapeResponse:
    logging.info(f"Started processing request with usernames: {request.usernames}")
    user_ids = []

    for username in request.usernames:
        logging.info(f"Received request to scrape watchlist for user: {username}")

        # Retrieve or create user
        user = db.query(User).filter(User.username == username).first()
        if not user:
            user = User(username=username)
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
            watchlist = scrape_watchlist(username)
            if not watchlist:
                raise HTTPException(status_code=404, detail="Watchlist is empty")

            logging.info(
                f"Successfully scraped watchlist for user: {username}, found {len(watchlist)} items"
            )

            for wl in watchlist:
                # Check if the film already exists in the database
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
