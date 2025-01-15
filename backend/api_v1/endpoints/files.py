from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from pydantic import UUID4
from sqlalchemy.orm import Session
from uuid import uuid4
from models.user import File as FileModel
from db_module.session import GetSQLDB
from typing import List
from fastapi.responses import FileResponse
from pathlib import Path
import urllib.parse



router = APIRouter()
ALLOWED_EXTENSIONS = ['txt', 'jpg', 'jpeg', 'png', 'json']

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@router.get("/files/{user_id}", response_model=List[dict])
def list_files_by_user(user_id: int, db: Session = Depends(GetSQLDB())):
    """
    Fetch all files for a given user ID.
    """
    files = db.query(FileModel).filter(FileModel.user_id == user_id).all()
    
    if not files:
        raise HTTPException(status_code=404, detail="No files found for this user")

    return [
        {
            "file_id": file.id,
            "file_name": file.file_name,
            "file_path": file.file_path,
            "file_size": file.file_size,
            "created_at": file.uploaded_at,
        }
        for file in files
    ]


@router.post("/upload")
def upload_files(
    user_id: int = Form(...),  # User ID associated with the file
    file: UploadFile = File(...),
    db: Session = Depends(GetSQLDB())  # Database session
):
    try:
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed. Only txt, jpg, png, and json are allowed.")
        # Generate unique filename and save the file
        temp_id = str(uuid4())
        file_path = f"/app/file_uploads/{user_id}_{temp_id}_{file.filename}"
        
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        
        # Save file metadata to the database
        file_record = FileModel(
            user_id=user_id,
            file_name=file.filename,
            file_path=file_path,
            file_type=file.content_type,
            file_size=len(file.file.read()),
        )
        db.add(file_record)
        db.commit()
        db.refresh(file_record)
        
        return {
            "upload_id": temp_id,
            "file_id": file_record.id,
            "detail": "File uploaded successfully",
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download")
def download_files(download_path: str):
    """
    Serve the file for download if it exists in the upload directory.
    """
    # Construct the absolute file path
    # Check if the file exists
    download_path = urllib.parse.unquote(download_path)

    file_path = Path(download_path)
    # if not file_path.exists() or not file_path.is_file():
    #     print(file_path)
    #     raise HTTPException(status_code=404, detail="File not found")

    # Serve the file with the correct filename
    return FileResponse(
        path=str(file_path),
        filename=file_path.name,  # This will be the filename for the downloaded file
        media_type="application/octet-stream",  # You can adjust the media type if needed
    )



