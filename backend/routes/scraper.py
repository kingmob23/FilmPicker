import logging
import random
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db.crud import create_film, get_watchlist, get_watchlist_intersection
from backend.db.database import get_db
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
    for username in request.usernames:
        logging.info(f"Received request to scrape watchlist for user: {username}")

        user_watchlist = get_watchlist(db, username)
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

            for lb_film_id, film_name, film_slug, release_year in watchlist:
                create_film(
                    db, lb_film_id, film_name, film_slug, release_year, username
                )
        except Exception as e:
            logging.error(f"Error scraping watchlist for user {username}: {e}")

    intersection = get_watchlist_intersection(db, request.usernames)
    n = len(request.usernames) + 1
    random_intersection = random.sample(intersection, min(len(intersection), n))

    return ScrapeResponse(
        intersection=random_intersection, intersection_len=len(intersection)
    )
