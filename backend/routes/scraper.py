import logging
import random

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.db.crud import (
    add_film_to_watchlist,
    create_film,
    get_user_watchlist,
    get_watchlist_intersection,
)
from backend.db.database import get_db
from backend.db.models import Film, User
from backend.utils.kp_from_files_scaper import scrape_kp_watchlist_from_files
from backend.utils.kp_scraper import scrape_kp_watchlist
from backend.utils.lb_scraper import scrape__lb_watchlist

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

        user = db.query(User).filter(User.username == username.name).first()
        if not user:
            user = User(username=username.name)
            db.add(user)
            db.commit()
            db.refresh(user)

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

            for wl in watchlist:
                if username.type.lower() == "lb":
                    film = db.query(Film).filter(Film.lb_id == wl.lb_film_id).first()
                    if not film:
                        film = create_film(
                            db, lb_id=wl.lb_film_id, lb_slug=wl.film_slug, source="lb"
                        )
                elif username.type.lower() in ["kp", "ayz"]:
                    film = (
                        db.query(Film)
                        .filter(Film.kp_russian_title == wl.russian_title)
                        .first()
                    )
                    if not film:
                        film = create_film(
                            db,
                            kp_russian_title=wl.russian_title,
                            kp_english_title=wl.english_title,
                            kp_director_name_rus=wl.director_name_rus,
                            kp_year=wl.year,
                        )

                try:
                    add_film_to_watchlist(db, user.id, film.id)
                except IntegrityError as e:
                    logging.error(
                        f"Failed to add film {film.id} to watchlist for user {username.name}: {e}"
                    )

        except Exception as e:
            logging.error(f"Error scraping watchlist for user {username}: {e}")
            raise HTTPException(
                status_code=500, detail=f"Error processing user {username.name}"
            )

    intersection = get_watchlist_intersection(db, user_ids)
    n = len(request.usernames) + 1
    random_intersection = random.sample(
        [
            item["slug"] if item.get("slug") else item["kp_english_title"]
            for item in intersection
        ],
        min(len(intersection), n),
    )

    return ScrapeResponse(
        intersection=random_intersection, intersection_len=len(intersection)
    )
