import logging
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from my_app.app.routes import scraper, items
from my_app.app.db import engine, Base

logging.basicConfig(level=logging.DEBUG)

# Ensure the database tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(scraper.router)
app.include_router(items.router)

app.mount("/static", StaticFiles(directory="my_app/frontend/static"), name="static")
app.mount("/", StaticFiles(directory="my_app/frontend", html=True), name="frontend")
