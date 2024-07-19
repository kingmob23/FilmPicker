import requests
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

def scrape_watchlist(username: str) -> list:
    base_url = f"https://letterboxd.com/{username}/watchlist/page/"
    page = 1
    watchlist = []

    while True:
        url = base_url + str(page)
        logger.info(f"Fetching URL: {url}")
        
        response = requests.get(url)
        logger.info(f"Response status code: {response.status_code}")

        if response.status_code != 200:
            logger.error(f"Failed to fetch data from {url}, status code: {response.status_code}")
            break

        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all film containers in the watchlist
        film_containers = soup.find_all('li', class_='poster-container')

        # Check if there are no more films to process
        if not film_containers:
            logger.info(f"No more films found on page {page}. Stopping.")
            break

        # Extract film titles and years
        for film in film_containers:
            film_div = film.find('div', class_='film-poster')
            film_title = film_div.get('data-film-slug').replace('-', ' ').title() if film_div else None
            film_year = film_div.get('data-film-id') if film_div else None
            if film_title and film_year:
                watchlist.append((film_title, film_year))
                logger.info(f"Found film: {film_title} ({film_year})")

        # Move to the next page
        page += 1

    logger.info(f"Total films found: {len(watchlist)}")
    return watchlist
