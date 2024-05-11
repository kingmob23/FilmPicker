from fastapi import APIRouter, HTTPException
from logic.logic import handle_lb_link
from pydantic import BaseModel

router = APIRouter()


class LinkModel(BaseModel):
    link: str


@router.post("/lb_link")
def post_lb_link(link_model: LinkModel):
    try:
        result = handle_lb_link(link_model.link)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
