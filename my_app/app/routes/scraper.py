import logging
from typing import List, Dict, Tuple
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from my_app.app.crud import create_film, get_watchlist, get_watchlist_intersection
from my_app.app.db import get_db
from my_app.app.utils.scraper import scrape_watchlist

router = APIRouter()

class ScrapeRequest(BaseModel):
    usernames: List[str]

class ScrapeResponse(BaseModel):
    intersection: List[str]

@router.post("/scrape/", response_model=ScrapeResponse)
async def scrape_and_store_watchlists(request: ScrapeRequest, db: Session = Depends(get_db)) -> ScrapeResponse:
    results: Dict[str, List[Tuple[str, int]]] = {}
    for username in request.usernames:
        logging.info(f"Received request to scrape watchlist for user: {username}")
        
        # Check if the user's watchlist is already in the database
        user_watchlist = get_watchlist(db, username)
        if user_watchlist:
            logging.info(f"Found existing watchlist for user: {username} in the database")
            results[username] = [film.title for film in user_watchlist]
            continue
        
        try:
            # If not in database, scrape the watchlist
            watchlist = scrape_watchlist(username)
            if not watchlist:
                raise HTTPException(status_code=404, detail="Watchlist is empty")

            logging.info(f"Successfully scraped watchlist for user: {username}, found {len(watchlist)} items")

            # Save to the database
            for title, lb_id in watchlist:
                create_film(db, title, lb_id, username)
            
            results[username] = watchlist
        except Exception as e:
            logging.error(f"Error scraping watchlist for user {username}: {e}")
            results[username] = {"error": str(e)}

    # Найти пересечения watchlist'ов с использованием SQLAlchemy
    intersection = get_watchlist_intersection(db, request.usernames)
    
    return ScrapeResponse(intersection=intersection)