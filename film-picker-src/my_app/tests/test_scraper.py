import unittest
from my_app.app.utils.scraper import scrape_data

class TestScraper(unittest.TestCase):
    def test_scrape_data(self):
        url = 'http://example.com'
        result = scrape_data(url)
        self.assertIn('title', result)
        self.assertIn('description', result)

if __name__ == '__main__':
    unittest.main()
