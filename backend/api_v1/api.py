from fastapi import APIRouter
from api_v1.endpoints.files import router as file_router
from api_v1.endpoints.register import router as register_router

app_router = APIRouter()


app_router.include_router(file_router, prefix="", tags=["upload"])
app_router.include_router(register_router, prefix="", tags=["register"])