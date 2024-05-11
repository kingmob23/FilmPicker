import scrapy


class WatchlistSpider(scrapy.Spider):
    name = "watchlist"

    def __init__(self, url=None, *args, **kwargs):
        super(WatchlistSpider, self).__init__(*args, **kwargs)
        if url is not None:
            self.start_urls = [url]

    def parse(self, response):
        for film in response.css("div.film-detail"):
            yield {
                "title": film.css("a.film-title::text").get(),
            }
