from fastapi import FastAPI
from fastapi.responses import FileResponse

from .routers import intersection, lb_link, watchlists

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "my endpoints: /lb_link, /watchlists, /intersection"}


app.include_router(lb_link.router)
app.include_router(watchlists.router)
app.include_router(intersection.router)
