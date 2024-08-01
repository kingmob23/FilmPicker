# backend/routes/scraper.py

from backend.db.crud import remove_film_from_watchlist
from backend.db.database import get_db
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/watchlist/remove", response_model=dict)
async def remove_from_watchlist(request: Request, db: Session = Depends(get_db)):
    pass
