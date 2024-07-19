import requests
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

def scrape_watchlist(username: str) -> list:
    url = f"https://letterboxd.com/{username}/watchlist/"
    logger.info(f"Fetching URL: {url}")
    
    response = requests.get(url)
    logger.info(f"Response status code: {response.status_code}")

    if response.status_code != 200:
        logger.error(f"Failed to fetch data from {url}, status code: {response.status_code}")
        raise Exception(f"Failed to fetch data from {url}")

    logger.debug(f"Response content: {response.text[:1000]}")  # Logging only first 1000 characters for brevity

    # Save the HTML content to a file
    with open('watchlist.html', 'w', encoding='utf-8') as file:
        file.write(response.text)
    logger.info("Saved HTML content to watchlist.html")

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all film containers in the watchlist
    film_containers = soup.find_all('li', class_='poster-container')

    # Extract film titles and years
    watchlist = []
    for film in film_containers:
        film_div = film.find('div', class_='film-poster')
        film_title = film_div.get('data-film-slug').replace('-', ' ').title() if film_div else None
        film_year = film_div.get('data-film-id') if film_div else None
        if film_title and film_year:
            watchlist.append((film_title, film_year))

    # Log the extracted films
    for title, year in watchlist:
        logger.info(f"Found film: {title} ({year})")

    return watchlist
