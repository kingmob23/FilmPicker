def parse_link(link: str):
    watchlist = link.split("/")[-1] + "_watchlist"
    return watchlist
