import logging
import re

import requests
from backend.schemas.schemas import KinopFilmDetails
from backend.utils.save_html_to_file import save_html_to_file
from bs4 import BeautifulSoup

logger = logging.getLogger("custom_logger")


from backend.schemas.schemas import KinopFilmDetails


def parse_li_element(li) -> KinopFilmDetails:
    russian_title = li.find("a", class_="name").text.strip()

    english_title_with_year = li.find("span").text.strip()

    match = re.match(r"^(.*) \((\d{4})\)", english_title_with_year)
    if match:
        english_title = match.group(1).strip()
        year = int(match.group(2).strip())
    else:
        english_title = english_title_with_year
        year = None

    director_name = li.find("i").find("a").text.strip()

    return KinopFilmDetails(
        russian_title=russian_title,
        english_title=english_title,
        director_name_rus=director_name,
        year=year,
    )


def scrape_kp_watchlist(username: str) -> list[KinopFilmDetails]:
    base_url = f"https://www.kinopoisk.ru/user/{username}/movies/list/type/3575/sort/default/vector/desc/page/"
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

        save_html_to_file(response.text, username, page)

        soup = BeautifulSoup(response.text, "html.parser")
        films_list = soup.find("ul", id="itemList", class_="dropper dropper2")

        if not films_list or isinstance(films_list, str):
            logger.info(
                f"No film list found on page {page} for user: {username}. Stopping."
            )
            break

        film_containers = films_list.find_all("li")

        if not film_containers:
            logger.info(
                f"No more films found on page {page} for user: {username}. Stopping."
            )
            break

        for film in film_containers:
            try:
                film_details = parse_li_element(film)
                watchlist.append(film_details)
            except Exception as e:
                logger.error(
                    f"Failed to parse film details on page {page} for user {username}: {e}"
                )

        page += 1

    logger.info(f"Total films found for user {username}: {len(watchlist)}")
    return watchlist
