from fastapi import APIRouter

router = APIRouter()


@router.get("/intersection/")
async def get_intersection(users: tuple[int]):
    pass
