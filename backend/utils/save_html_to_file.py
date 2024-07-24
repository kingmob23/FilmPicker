import logging
import os

logger = logging.getLogger("custom_logger")


def save_html_to_file(content: str, username: str, page: int):
    """useful when debuging"""
    directory = "html_pages"
    os.makedirs(directory, exist_ok=True)
    file_path = os.path.join(directory, f"{username}_watchlist_page_{page}.html")
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)
    logger.info(f"Saved HTML content for {username}, page {page} to {file_path}")
