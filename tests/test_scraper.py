import os
import sys

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure the application path is in the sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))

from backend.db import Base, SessionLocal, engine, get_db  # Ensure get_db is imported
from backend.db.crud import get_films
from backend.main import app

# Set up a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override the get_db dependency to use the test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_scrape_and_save_films(setup_database):
    username = "cronenbergman"
    response = client.post("/scrape/", json={"username": username})
    assert response.status_code == 200
    data = response.json()
    assert "watchlist" in data
    assert len(data["watchlist"]) > 0

    db = next(override_get_db())
    saved_films = get_films(db, username)
    assert len(saved_films) > 0
    for film in saved_films:
        assert film.username == username


def test_get_user_films(setup_database):
    username = "cronenbergman"
    response = client.get(f"/films/{username}")
    assert response.status_code == 200
    films = response.json()
    assert len(films) > 0
    for film in films:
        assert film["username"] == username
