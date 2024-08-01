import logging

from backend.db.database import get_db
from backend.routes import remove_film_from_wl, scraper
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
)

logger = logging.getLogger("custom_logger")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scraper.router, prefix="/api", dependencies=[Depends(get_db)])
app.include_router(
    remove_film_from_wl.router, prefix="/api", dependencies=[Depends(get_db)]
)
