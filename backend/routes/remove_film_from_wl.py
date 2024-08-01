from backend.db.database import get_db
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/watchlist/remove", response_model=dict)
async def remove_from_watchlist(request: Request, db: Session = Depends(get_db)):
    # request example: {'film': 'monkey-ostrich-and-grave', 'usernames': [{'name': 'cronenbergman', 'type': 'LB', 'refresh': False}]}
    pass
