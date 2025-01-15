from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schema.users import User, UserLogin
from models.user import User as UserModel
from db_module.session import GetSQLDB

router = APIRouter()

@router.post("/register")
def register_user(details: User, db: Session = Depends(GetSQLDB())):
    # Check if the user already exists
    existing_user = db.query(UserModel).filter(UserModel.username == details.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    try:
    # Create a new user
        new_user = UserModel(
            username=details.username,
            email=details.email,
            password=details.password,  # In a real app, hash the password!
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as err:
        print(err)
        

    return {
        "detail": "User registered successfully",
        "user_id": new_user.id,
        "username": new_user.username,
    }




@router.post("/login")
def register_user(details: UserLogin, db: Session = Depends(GetSQLDB())):

    existing_user = db.query(UserModel).filter(UserModel.username == details.username).first()
    if not existing_user:
        raise HTTPException(status_code=400, detail="Username doesnt exists")
    if existing_user.password != details.password:
        raise HTTPException(status_code=400, detail="Incorrect password")


    return {
        "detail": "Login successfull",
        "username" : existing_user.username,
        "id": existing_user.id
    }