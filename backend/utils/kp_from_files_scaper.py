import csv
import logging
import os
import re

from backend.schemas.schemas import KinopFilmDetails
from bs4 import BeautifulSoup

logger = logging.getLogger("custom_logger")


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


def save_watchlist_to_csv(username: str, watchlist: list[KinopFilmDetails]):
    csv_filename = f"{username}_watchlist.csv"
    csv_filepath = os.path.join("backend/utils/csv", csv_filename)

    os.makedirs(os.path.dirname(csv_filepath), exist_ok=True)

    with open(csv_filepath, "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["russian_title", "english_title", "director_name_rus", "year"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for film in watchlist:
            writer.writerow(
                {
                    "russian_title": film.russian_title,
                    "english_title": film.english_title,
                    "director_name_rus": film.director_name_rus,
                    "year": film.year,
                }
            )

    logger.info(f"Watchlist for user {username} saved to {csv_filepath}")


def scrape_kp_watchlist_from_files(username: str) -> list[KinopFilmDetails]:
    base_dir = f"backend/utils/html"
    watchlist = []

    for filename in os.listdir(base_dir):
        if not filename.startswith(username):
            continue

        file_path = os.path.join(base_dir, filename)
        logger.info(f"Parsing file: {file_path} for user: {username}")

        try:
            with open(file_path, "r", encoding="utf-8") as file:
                html_content = file.read()
        except Exception as e:
            logger.error(
                f"Failed to read file {file_path} for user {username}, error: {e}"
            )
            continue

        soup = BeautifulSoup(html_content, "html.parser")
        films_list = soup.find("ul", id="itemList", class_="dropper dropper2")

        if not films_list or isinstance(films_list, str):
            logger.info(
                f"No film list found in file {file_path} for user: {username}. Skipping."
            )
            continue

        film_containers = films_list.find_all("li")

        for film in film_containers:
            try:
                film_details = parse_li_element(film)
                watchlist.append(film_details)
            except Exception as e:
                logger.error(
                    f"Failed to parse film details in file {file_path} for user {username}: {e}"
                )

    logger.info(f"Total films found for user {username} from files: {len(watchlist)}")

    save_watchlist_to_csv(username, watchlist)

    return watchlist
