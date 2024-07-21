import logging

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.db.database import get_db
from backend.routes import scraper

logger = logging.getLogger("custom_logger")

logging.basicConfig(
    level=logging.INFO,
)

uvicorn_log_level = logging.getLevelName(logging.getLogger("uvicorn").level)
logger.setLevel(uvicorn_log_level)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scraper.router, dependencies=[Depends(get_db)])
