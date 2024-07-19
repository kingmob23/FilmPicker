from pydantic import BaseModel

class ItemBase(BaseModel):
    title: str
    url: str

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int

    class Config:
        orm_mode = True
