from fastapi import APIRouter
from api_v1.endpoints.files import router as file_router

app_router = APIRouter()


app_router.include_router(file_router, prefix="")