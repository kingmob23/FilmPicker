import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from my_app.app.utils.scraper import scrape_watchlist
from my_app.app.crud import create_items_from_watchlist
from my_app.app.schemas import ItemCreate
from my_app.app.db import get_db

logger = logging.getLogger(__name__)

router = APIRouter()

class UsernameRequest(BaseModel):
    username: str

@router.post("/scrape/")
def scrape_and_store(request: UsernameRequest, db: Session = Depends(get_db)):
    logger.info(f"Received request to scrape watchlist for user: {request.username}")
    try:
        username = request.username
        watchlist = scrape_watchlist(username)
        logger.info(f"Successfully scraped watchlist for user: {username}, found {len(watchlist)} items")
    except Exception as e:
        logger.error(f"Error scraping watchlist for user {username}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    items = [ItemCreate(title=item['title'], url=item['url']) for item in watchlist]
    logger.info(f"Creating {len(items)} items in the database for user: {username}")
    return create_items_from_watchlist(db=db, items=items)
