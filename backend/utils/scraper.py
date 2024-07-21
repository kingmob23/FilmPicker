import logging
import os
from dataclasses import dataclass

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger("custom_logger")


@dataclass
class FilmDetails:
    lb_film_id: int
    film_slug: str


def save_html_to_file(content: str, username: str, page: int):
    """useful when debuging"""
    directory = "html_pages"
    os.makedirs(directory, exist_ok=True)
    file_path = os.path.join(directory, f"{username}_watchlist_page_{page}.html")
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)
    logger.info(f"Saved HTML content for {username}, page {page} to {file_path}")


def scrape_watchlist(username: str) -> list[FilmDetails]:
    base_url = f"https://letterboxd.com/{username}/watchlist/page/"
    page = 1
    watchlist = []

    while True:
        url = base_url + str(page)
        logger.info(f"Fetching URL: {url} for user: {username}")

        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.error(
                f"Failed to fetch data from {url} for user {username}, error: {e}"
            )
            break

        logger.debug(f"Response status code: {response.status_code}")

        # save_html_to_file(response.text, username, page)

        soup = BeautifulSoup(response.text, "html.parser")

        film_containers = soup.find_all(
            "li", class_=["poster-container", "film-not-watched"]
        )

        if not film_containers:
            logger.info(
                f"No more films found on page {page} for user: {username}. Stopping."
            )
            break

        for film in film_containers:
            film_div = film.find("div", class_="film-poster")
            if not film_div:
                logger.warning(
                    f"Film poster div not found for a film on page {page} for user: {username}"
                )
                continue

            try:
                lb_film_id = int(film_div.get("data-film-id"))
                film_slug = film_div.get("data-film-slug")

                if lb_film_id and film_slug:
                    watchlist.append(FilmDetails(lb_film_id, film_slug))
                else:
                    raise ValueError("One or more attributes are missing")
            except (ValueError, TypeError) as e:
                logger.error(
                    f"Failed to parse film attributes on page {page} for user: {username} - "
                    f"lb_film_id: {film_div.get('data-film-id')}, "
                    f"film_slug: {film_div.get('data-film-slug')} - error: {e}"
                )

        page += 1

    logger.info(f"Total films found for user {username}: {len(watchlist)}")
    return watchlist
