from fastapi import FastAPI
from api_v1.api import app_router

app = FastAPI()


@app.get("/test-endpoint")
def func():
    return {
        "detail" : "ok"
    }


app.include_router(app_router, prefix="/api/v1")




