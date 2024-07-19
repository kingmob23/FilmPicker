import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from my_app.app.crud import create_film, get_watchlist
from my_app.app.db import get_db
from my_app.app.utils.scraper import scrape_watchlist

router = APIRouter()

class ScrapeRequest(BaseModel):
    username: str

@router.post("/scrape/")
async def scrape_and_store_watchlist(request: ScrapeRequest, db: Session = Depends(get_db)):
    username = request.username
    logging.info(f"Received request to scrape watchlist for user: {username}")
    
    # Check if the user's watchlist is already in the database
    user_watchlist = get_watchlist(db, username)
    if user_watchlist:
        logging.info(f"Found existing watchlist for user: {username} in the database")
        return {"watchlist": [(film.title, film.year) for film in user_watchlist]}
    
    try:
        # If not in database, scrape the watchlist
        watchlist = scrape_watchlist(username)
        if not watchlist:
            raise HTTPException(status_code=404, detail="Watchlist is empty")

        logging.info(f"Successfully scraped watchlist for user: {username}, found {len(watchlist)} items")

        # Save to the database
        for title, year in watchlist:
            create_film(db, title, year, username)
        
        return {"watchlist": watchlist}
    except Exception as e:
        logging.error(f"Error scraping watchlist for user {username}: {e}")
        raise HTTPException(status_code=500, detail="Error scraping watchlist")

@router.get("/watchlist/{username}")
async def get_user_films(username: str, db: Session = Depends(get_db)):
    films = get_watchlist(db, username)
    if not films:
        raise HTTPException(status_code=404, detail="No films found for this user")
    return films
