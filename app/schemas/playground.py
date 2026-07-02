from pydantic import BaseModel


class PlaygroundRequest(BaseModel):
    method: str
    url: str
    headers: dict = {}
    body: dict | None = None
