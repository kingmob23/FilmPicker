import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from my_app.app.routes import scraper
from my_app.app.db import engine, Base, get_db

logging.basicConfig(level=logging.INFO)

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Позволить доступ с любого источника, можно ограничить конкретными доменами
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)

app.include_router(scraper.router, dependencies=[Depends(get_db)])

app.mount("/", StaticFiles(directory="my_app/frontend", html=True), name="frontend")
