from fastapi import APIRouter

router = APIRouter()


@router.post("/watchlists")
async def create_watchlist(watchlist: dict[str, list[str]]):
    pass


@router.get("/watchlists/{id}")
async def get_watchlist(id: int):
    pass


@router.put("/watchlists/{id}")
async def update_watchlist(id: int):
    pass


@router.delete("/watchlists/{id}")
async def delete_watchlist(id: int):
    pass
