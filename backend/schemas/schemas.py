from typing import Optional

from pydantic import BaseModel


class Username(BaseModel):
    name: str
    type: str
    refresh: bool


class ScrapeRequest(BaseModel):
    usernames: list[Username]


class ScrapeResponse(BaseModel):
    intersection_len: int
    intersection: list[str]


class KinopFilmDetails(BaseModel):
    russian_title: str
    english_title: str
    director_name_rus: str
    year: Optional[int]


class LetterbFilmDetails(BaseModel):
    lb_film_id: int
    film_slug: str
