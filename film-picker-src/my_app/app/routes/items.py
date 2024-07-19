from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from my_app.app import crud, models, schemas
from my_app.app.db import get_db

router = APIRouter()

@router.post("/items/", response_model=schemas.Film)
def create_item(item: schemas.FilmCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)

@router.get("/items/", response_model=list[schemas.Film])
def read_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items

@router.get("/items/{item_id}", response_model=schemas.Film)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud.get_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item
