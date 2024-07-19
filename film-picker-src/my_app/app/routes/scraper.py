import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from my_app.app.utils.scraper import scrape_watchlist

router = APIRouter()

class ScrapeRequest(BaseModel):
    username: str

@router.post("/scrape/")
async def scrape_and_store_watchlist(request: ScrapeRequest):
    username = request.username
    logging.info(f"Received request to scrape watchlist for user: {username}")
    try:
        watchlist = scrape_watchlist(username)
        if not watchlist:
            raise HTTPException(status_code=404, detail="Watchlist is empty")
        
        logging.info(f"Successfully scraped watchlist for user: {username}, found {len(watchlist)} items")
        # Further processing or storing in the database can be done here
        return {"watchlist": watchlist}
    except Exception as e:
        logging.error(f"Error scraping watchlist for user {username}: {e}")
        raise HTTPException(status_code=500, detail="Error scraping watchlist")
