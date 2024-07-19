from pydantic import BaseModel, ConfigDict

class FilmBase(BaseModel):
    title: str
    year: str
    username: str

    class Config(ConfigDict):
        from_attributes = True

class FilmCreate(FilmBase):
    pass

class Film(FilmBase):
    id: int

    class Config(ConfigDict):
        from_attributes = True
