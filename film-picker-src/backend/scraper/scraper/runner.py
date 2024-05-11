from scraper.spiders.watchlist import WatchlistSpider
from scrapy.crawler import CrawlerProcess


def run_spider(url):
    process = CrawlerProcess(
        {
            "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
    )
    process.crawl(WatchlistSpider, start_url=url)
    process.start()
