from fastapi import APIRouter
from pydantic import UUID4
from uuid import uuid4

router = APIRouter()

@router.post("/upload")
def upload_files():
    temp_id = str(uuid4())
    return {
        "upload_id" : temp_id,
        "detail" : "ok"
    }


@router.get("/files/")
def list_all_files():
    return [
        {
            "file_id" : "#######1",
            "file_name" : "file_name1.csv",
            "created_at" : ""
        },
        {
            "file_id" : "#######2",
            "file_name" : "file_name2.csv",
            "created_at" : ""
        }
    ]


@router.get("/download/{download_id}")
def download_files(
    downlaod_id : UUID4
):
    return {
        "presigned_url" : "",
        "filename" : "",
        "download_id" : downlaod_id
    }



