from sqlalchemy.orm import Session
from my_app.app import models, schemas

def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(title=item.title, url=item.url)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_items(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Item).offset(skip).limit(limit).all()

def get_item(db: Session, item_id: int):
    return db.query(models.Item).filter(models.Item.id == item_id).first()

def create_items_from_watchlist(db: Session, items: list[schemas.ItemCreate]):
    db_items = [models.Item(title=item.title, url=item.url) for item in items]
    db.add_all(db_items)
    db.commit()
    return db_items
