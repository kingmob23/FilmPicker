from backend.db.crud import (
    get_film_by_slug,
    get_or_create_user,
    remove_film_from_watchlist,
)
from backend.db.database import get_db
from backend.db.models import Film
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/watchlist/remove", response_model=dict)
async def remove_from_watchlist(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    # TODO: this implementation only works for lb

    film_slug = data.get("film")
    usernames = data.get("usernames", [])

    if not film_slug or not usernames:
        raise HTTPException(status_code=400, detail="Film and usernames are required")

    film = get_film_by_slug(db, film_slug)
    if not film:
        raise HTTPException(status_code=404, detail="Film not found")

    film_id = film.id

    results = {}
    for user_data in usernames:
        username = user_data.get("name")
        user = get_or_create_user(db, username)
        success = remove_film_from_watchlist(db, user.id, film_id)
        results[username] = success

    return {"results": results}
