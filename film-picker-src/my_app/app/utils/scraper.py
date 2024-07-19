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

    logger.debug(f"Response content: {response.content[:1000]}")  # Logging only first 1000 characters for brevity
    
    soup = BeautifulSoup(response.content, 'html.parser')
    watchlist = []

    films = soup.select('li.poster-container')
    if not films:
        logger.error("No films found in watchlist")
        raise Exception("No films found in watchlist")

    for film in films:
        data_component = film.find('div', class_='react-component')
        if data_component:
            title = data_component['data-film-name'] if 'data-film-name' in data_component.attrs else 'No title found'
            film_url = f"https://letterboxd.com{data_component['data-film-link']}" if 'data-film-link' in data_component.attrs else 'No URL found'
            watchlist.append({"title": title, "url": film_url})
        else:
            logger.error(f"Failed to find react-component in film element: {film}")
            raise Exception("Failed to find react-component in film element")

    return watchlist
