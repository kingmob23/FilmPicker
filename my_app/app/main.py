import logging
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles

from my_app.app.routes import scraper
from my_app.app.db import engine, Base, get_db

logging.basicConfig(level=logging.DEBUG)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(scraper.router, dependencies=[Depends(get_db)])

app.mount("/", StaticFiles(directory="my_app/frontend", html=True), name="frontend")
