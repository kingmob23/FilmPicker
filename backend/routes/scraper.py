import logging
import random

from backend.db.crud import (
    add_film_to_watchlist,
    clear_user_watchlist,
    get_or_create_film_record,
    get_or_create_user,
    get_user_watchlist,
    get_watchlist_intersection,
)
from backend.db.database import get_db
from backend.schemas.schemas import ScrapeRequest, ScrapeResponse, Username
from backend.utils.kp_from_files_scaper import scrape_kp_watchlist_from_files
from backend.utils.kp_scraper import scrape_kp_watchlist
from backend.utils.lb_scraper import scrape__lb_watchlist
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


def scrape_user_watchlist(username: Username):
    if username.type.lower() == "lb":
        return scrape__lb_watchlist(username.name)
    elif username.type.lower() == "kp":
        return scrape_kp_watchlist(username.name)
    elif username.type.lower() == "ayz":
        return scrape_kp_watchlist_from_files(username.name)
    else:
        raise HTTPException(status_code=400, detail="Unknown watchlist type")


@router.post("/scrape/", response_model=ScrapeResponse)
async def scrape_and_store_watchlists(
    request: ScrapeRequest, db: Session = Depends(get_db)
) -> ScrapeResponse:
    logging.info(f"Started processing request {request}")
    user_ids = []

    for username in request.usernames:
        logging.info(f"Received request to scrape watchlist for user: {username}")

        user = get_or_create_user(db, username.name)
        user_ids.append(user.id)

        user_watchlist = get_user_watchlist(db, user.id)
        if user_watchlist and not username.refresh:
            logging.info(
                f"Found existing watchlist for user: {username.name} in the database"
            )
            continue

        try:
            watchlist = scrape_user_watchlist(username)
            if not watchlist:
                raise HTTPException(status_code=404, detail="Watchlist is empty")

            logging.info(
                f"Successfully scraped watchlist for user: {username.name}, found {len(watchlist)} items"
            )

            clear_user_watchlist(db, user.id)

            for movie in watchlist:
                film = get_or_create_film_record(db, movie, username.type.lower())
                add_film_to_watchlist(db, user.id, film.id)

        except Exception as e:
            logging.error(f"Error scraping watchlist for user {username}: {e}")
            raise HTTPException(
                status_code=500, detail=f"Error processing user {username.name}"
            )

    intersection = get_watchlist_intersection(db, user_ids)

    if not intersection:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request {request}, no intersection in user's watchlist found",
        )

    string_intersection = [
        str(item["slug"] if item.get("slug") is not None else item["kp_english_title"])
        for item in intersection
    ]

    n = len(request.usernames) + 1

    if len(intersection) < n:
        return ScrapeResponse(
            intersection_len=len(intersection), intersection=string_intersection
        )

    random_intersection = random.sample(
        string_intersection, min(len(string_intersection), n)
    )

    logging.info(f"{random_intersection} of type {type(random_intersection)}")

    return ScrapeResponse(
        intersection_len=len(intersection), intersection=random_intersection
    )
