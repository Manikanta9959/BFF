from fastapi import FastAPI
from api_v1.api import app_router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/test-endpoint")
def func():
    return {
        "detail" : "ok"
    }


app.include_router(app_router, prefix="/api/v1")




